# CodeShareFrontend
A frontend that provides collaborative code writing with other people. 

The backend is located at: https://github.com/ultron682/asp.net-ef-xunit-identity_codeshare_backend

A quick look at the functionalities:

![intro](https://github.com/user-attachments/assets/dfd341d9-ebf8-4b43-a211-25e953620973)

CodeShareFrontend is an application written in React that allows multiple users to write code together in real time. 

The application requires an API written in ASP.NET to function. The application allows users to register, log in and manage their account.

Users can create up to 10 code snippets in their free account. The app supports multi-language (i18n) and provides user-friendly notifications for actions like deleting snippets or changing a nickname.


## A few screenshots of how the app works:
![image](https://github.com/user-attachments/assets/fd453796-bf08-409b-a22c-91a3e166210d)
![image](https://github.com/user-attachments/assets/eb60a23f-710a-4757-8ba3-c174f466e350)
![image](https://github.com/user-attachments/assets/ece77e9c-9e9d-464e-aa80-3a457161b44d)
![image](https://github.com/user-attachments/assets/7db5cdda-eb57-42ae-ae7a-dccf0eecca32)



## Features
- **User Authentication**: Register and log in using email and password.
- **Email Confirmation**: Users must confirm their email address to access the app.
- **Snippet Management**: Users can add, delete, and view code snippets.
- **Change Nickname**: Users can change their nickname after logging in.
- **Multi-language Support**: The app supports multiple languages using `react-i18next`.
- **Responsive UI**: The app is optimized for both desktop and mobile views.
- **Toast Notifications**: Success and error messages are shown using `react-toastify`.


## Installation

To run this project locally, follow these steps:

### Prerequisites

Make sure you have the following installed:
- Node.js (v20 or higher)
- npm
- Backend server (ASP.NET Core Web API) - [https://github.com/ultron682/asp.net-ef-xunit-identity_codeshare_backend](https://github.com/ultron682/asp.net-ef-xunit-identity_codeshare_backend)
- Clone the repository

Command to run: npm start
