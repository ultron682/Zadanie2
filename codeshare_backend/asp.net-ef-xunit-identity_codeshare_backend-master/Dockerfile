FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5555

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CodeShareBackend/CodeShareBackend.csproj", "CodeShareBackend/"]
RUN dotnet restore "CodeShareBackend/CodeShareBackend.csproj"
COPY . .
WORKDIR "/src/CodeShareBackend"
RUN dotnet build "CodeShareBackend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CodeShareBackend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5555
ENTRYPOINT ["dotnet", "CodeShareBackend.dll"]
