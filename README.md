# Zadanie 2 - Full-Stack Application w Minikube

## A. Opis aplikacji

Wybrana aplikacja to **CodeShare** - platforma do współdzielenia kodu w czasie rzeczywistym. Aplikacja umożliwia tworzenie snippetów kodu, ich edycję oraz udostępnianie poprzez unikalne linki. Jest to moja aplikacja, którą kiedyś stworzyłem do swojego portfolio. W czasie robienia zadania znowu miałem problemy z RAM'em. Musiałem trochę ograniczyć zasoby, ale ostatecznie wszystko się udało.

Poniżej linki prowadzące do moich repo. Są tam screenshoty i gify prezentujące aplikację:
Backend: https://github.com/ultron682/asp.net-ef-xunit-identity_codeshare_backend
Frontend: https://github.com/ultron682/react-signalR_codeshare_frontend

### Stack technologiczny

Aplikacja wykorzystuje stack **MERN-like**:

- **Frontend**: React 18 z SignalR Client, CodeMirror (edytor kodu), React Router
- **Backend**: ASP.NET Core 8.0 Web API z SignalR Hub
- **Baza danych**: Entity Framework Core InMemory (dla uproszczenia w środowisku Minikube)

## B. Konfiguracja klastra Minikube

Uruchomienie klastra z 4 węzłami i addonem Ingress:

```
minikube start --nodes 4 --cni calico --driver docker
```

Włączenie addonu Ingress:

```
minikube addons enable ingress
```

Wynik:

```
💡  ingress is an addon maintained by Kubernetes.
    ▪ Using image registry.k8s.io/ingress-nginx/controller:v1.13.2
🌟  The 'ingress' addon is enabled
```

Sprawdzenie węzłów:

```
kubectl get nodes
NAME           STATUS   ROLES           AGE   VERSION
minikube       Ready    control-plane   50m   v1.34.0
minikube-m02   Ready    <none>          49m   v1.34.0
minikube-m03   Ready    <none>          48m   v1.34.0
minikube-m04   Ready    <none>          47m   v1.34.0
```

## C. Budowanie obrazów Docker

### Backend (ASP.NET Core)

```
cd codeshare_backend/asp.net-ef-xunit-identity_codeshare_backend-master
docker build -t codeshare-backend:v1 .
```

Wynik:

```
[+] Building 34.6s (18/18) FINISHED
 => [build 4/7] RUN dotnet restore "CodeShareBackend/CodeShareBackend.csproj"   23.3s
 => [build 7/7] RUN dotnet build "CodeShareBackend.csproj" -c Release            6.3s
 => [publish 1/1] RUN dotnet publish "CodeShareBackend.csproj" -c Release        3.1s
 => naming to docker.io/library/codeshare-backend:v1
```

### Frontend (React)

```
cd react_frontend/react-signalR_codeshare_frontend-master
docker build --build-arg REACT_APP_API_URL=http://brilliantapp.zad/api \
             --build-arg REACT_APP_SIGNALR_URL=http://brilliantapp.zad/codeshare \
             -t codeshare-frontend:v1 .
```

Wynik:

```
[+] Building 128.9s (15/15) FINISHED
 => [build 4/6] RUN npm install                                                 56.7s
 => [build 6/6] RUN npm run build                                               51.9s
 => naming to docker.io/library/codeshare-frontend:v1
```

### Załadowanie obrazów do Minikube

```
minikube image load codeshare-backend:v1
minikube image load codeshare-frontend:v1
```

## D. Pliki konfiguracyjne wdrożenia

### Struktura manifestów

```
manifests/
├── 01-namespaces.yaml       # Namespace codeshare
├── 02-configmaps.yaml       # ConfigMaps dla frontend i backend
├── 03-secrets.yaml          # Secrets (JWT, connection strings)
├── 05-backend-deployment.yaml   # Deployment i Service backend
├── 06-frontend-deployment.yaml  # Deployment i Service frontend
└── 07-ingress.yaml          # Ingress z routingiem
```

## E. Wdrożenie aplikacji

Aplikacja manifestów:

```
kubectl apply -f manifests/
```

Wynik:

```
namespace/codeshare created
configmap/frontend-config created
configmap/backend-config created
secret/postgres-secret created
secret/backend-secret created
deployment.apps/backend created
service/backend-service created
deployment.apps/frontend created
service/frontend-service created
ingress.networking.k8s.io/codeshare-ingress created
```

### Weryfikacja Pod-ów

```
kubectl get pods -n codeshare -o wide
NAME                        READY   STATUS    RESTARTS   AGE     IP               NODE
backend-7db984bf7f-cl6ms    1/1     Running   0          3m15s   10.244.205.216   minikube-m02
backend-7db984bf7f-slwg5    1/1     Running   0          3m15s   10.244.151.20    minikube-m03
frontend-858574987c-ctptv   1/1     Running   0          16m     10.244.59.150    minikube-m04
frontend-858574987c-ffq9q   1/1     Running   0          16m     10.244.205.215   minikube-m02
```

### Weryfikacja serwisów

```
kubectl get svc -n codeshare
NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
backend-service    ClusterIP   10.109.171.130   <none>        5555/TCP   16m
frontend-service   ClusterIP   10.100.162.54    <none>        80/TCP     16m
```

### Weryfikacja Ingress

```
kubectl get ingress -n codeshare
NAME                CLASS   HOSTS              ADDRESS        PORTS   AGE
codeshare-ingress   nginx   brilliantapp.zad   192.168.49.2   80      16m
```

## F. Konfiguracja dostępu

### 1. Dodanie wpisu do pliku hosts

Żeby zadziałało musiałem do pliku hosts w `C:\Windows\System32\drivers\etc\hosts` dodać odwołanie do brilliantapp.zad :

```
127.0.0.1 brilliantapp.zad
```

### 2. Uruchomienie tunelu Minikube

```
minikube tunnel
```

Wynik:

```
✅  Tunnel successfully started
📌  NOTE: Please do not close this terminal as this process must stay alive...
🏃  Starting tunnel for service codeshare-ingress.
```

### 3. Dostęp do aplikacji

Aplikacja dostępna pod adresem: **http://brilliantapp.zad**

## G. Testy poprawności działania

### Test dostępności frontendu

```
kubectl port-forward svc/frontend-service 80:80 -n codeshare &
curl http://localhost:80 | Select-String "title"
```

Wynik:

```
<title>CodeShare</title>
```

### Test dostępności backendu (SignalR negotiate)

```
kubectl port-forward svc/backend-service 5555:5555 -n codeshare &
Invoke-WebRequest -Uri http://localhost:5555/codesharehub/negotiate -Method POST
```

Wynik:

```
StatusCode        : 200
StatusDescription : OK
```

Backend SignalR Hub odpowiada poprawnie.

### Test logów backendu

```
kubectl logs -n codeshare deployment/backend --tail=10
```

Wynik:

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://[::]:5555
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /app
```

---

# CZĘŚĆ NIEOBOWIĄZKOWA

## A. Aktualizacja aplikacji bez przerywania działania

### Opis zmian

Zmiana widoczna po aktualizacji: **zmiana tytułu strony** z "Code Share" na "CodeShare v2 - Live Code Editor".

### 1. Modyfikacja pliku index.html

```html
<!-- Przed -->
<title>Code Share</title>

<!-- Po -->
<title>CodeShare v2 - Live Code Editor</title>
```

### 2. Budowanie nowej wersji obrazu

```
cd react_frontend/react-signalR_codeshare_frontend-master
docker build --build-arg REACT_APP_API_URL=http://brilliantapp.zad/api \
             --build-arg REACT_APP_SIGNALR_URL=http://brilliantapp.zad/codeshare \
             -t codeshare-frontend:v2 .
```

Wynik:

```
[+] Building 47.9s (15/15) FINISHED
 => [build 6/6] RUN npm run build                                               42.6s
 => naming to docker.io/library/codeshare-frontend:v2
```

Załadowanie do Minikube:

```
minikube image load codeshare-frontend:v2
```

### 3. Aktualizacja Deployment

```
kubectl set image deployment/frontend frontend=docker.io/library/codeshare-frontend:v2 -n codeshare
```

Wynik:

```
deployment.apps/frontend image updated
```

### 4. Monitorowanie rolling update

```
kubectl rollout status deployment/frontend -n codeshare
```

Wynik:

```
Waiting for deployment "frontend" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "frontend" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "frontend" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "frontend" rollout to finish: 1 of 2 updated replicas are available...
deployment "frontend" successfully rolled out
```

### 5. Weryfikacja

Stan Pod-ów po aktualizacji:

```
kubectl get pods -n codeshare -o wide
NAME                        READY   STATUS    AGE     NODE
backend-7db984bf7f-cl6ms    1/1     Running   6m41s   minikube-m02
backend-7db984bf7f-slwg5    1/1     Running   6m41s   minikube-m03
frontend-766596b6d6-kfm6z   1/1     Running   16s     minikube-m03
frontend-766596b6d6-xff6m   1/1     Running   16s     minikube-m04
```

Test nowego tytułu:

```
kubectl port-forward svc/frontend-service 80:80 -n codeshare &
curl http://localhost:80 | Select-String "title"
```

Wynik:

```
<title>CodeShare v2 - Live Code Editor</title>
```

Zmiana została wdrożona bez przerywania dostępności aplikacji. Czyli aktualizacja udana.

## B. Uzasadnienie konfiguracji sond i uzasadnienie doboru

### Sondy TCP Socket

Wybrałem sondy typu `tcpSocket` zamiast `httpGet` ponieważ:

1. **startupProbe** - sprawdza czy aplikacja ASP.NET Core zdążyła się uruchomić. Ustawienia:

   - `initialDelaySeconds: 5` - daje czas na bootstrap kontenera
   - `periodSeconds: 3` - szybkie sprawdzanie
   - `failureThreshold: 20` - łącznie 65 sekund na uruchomienie (5 + 20\*3)

2. **readinessProbe** - sprawdza czy aplikacja jest gotowa do przyjmowania ruchu:

   - `initialDelaySeconds: 10` - po startupProbe
   - `periodSeconds: 5` - regularne sprawdzanie

3. **livenessProbe** - sprawdza czy aplikacja nadal działa:

   - `initialDelaySeconds: 15` - dłuższy czas początkowy
   - `periodSeconds: 10` - rzadsze sprawdzanie
   - `failureThreshold: 3` - restart po 3 nieudanych próbach

### Dlaczego wybrałem TCP zamiast HTTP?

- No bo w mojej aplikacji Swagger UI (czyli taka stronka do testowania endpointów) jest dostępna tylko w trybie Development
- Nie dodałem wtedy do aplikacji dedykowanego health endpointu
- I najważniejsze: TCP Socket skutecznie weryfikuje czy port nasłuchuje

### Implementacja wszystkich trzech typów sond

Backend wykorzystuje wszystkie 3 typy sond:

```yaml
startupProbe:
  tcpSocket:
    port: 5555
  initialDelaySeconds: 5
  periodSeconds: 3
  timeoutSeconds: 2
  failureThreshold: 20

readinessProbe:
  tcpSocket:
    port: 5555
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3

livenessProbe:
  tcpSocket:
    port: 5555
  initialDelaySeconds: 15
  periodSeconds: 10
  timeoutSeconds: 3
  failureThreshold: 3
```

### Współpraca sond podczas rolling update

1. Nowy Pod startuje → startupProbe sprawdza uruchomienie
2. startupProbe przechodzi → readinessProbe sprawdza gotowość
3. readinessProbe przechodzi → Pod dodany do Service endpoints
4. Stary Pod otrzymuje SIGTERM → graceful shutdown
5. livenessProbe monitoruje nowe Pod-y pod kątem zawieszenia

Ta konfiguracja według mnie powinnma zagwarantować **zero downtime deployment**.
Mam nadzieję, że udało mi się w pełni wykonać zadanie.
