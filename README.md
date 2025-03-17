# SuperCar Virtual Sales Assistant - Frontend Engineer Test

## Overview

This repository contains the development of the Frontend technical test based on Next.js 15, React.js 18, and Ant Design for components and styling. The app features a single view that includes:

- AI Chat
- Weather Module
- Dealership Address Module
- Appointment Availability Module
- Appointment Confirmation Module (non-functional)

> **Note:** The Appointment Confirmation Module is non-functional because I did not receive a response from the corresponding API tool_use.

### Running Project (Backend and Frontend)

#### Config Backend

- First go to and create an account.
- Then go to https://console.groq.com/keys and create a new key.
- Place the key in the `backend/.env` file. There is already a .env.example file that you can use as a template.

#### Config Frontend

- Below are the steps to create the .env file in the /frontend folder by copying the content from .env.example

You have two options to run the backend:

#### Option 1: Using Docker

```bash
cd backend
docker build -t SuperCar-assistant-backend .
docker run -p 8000:8000 SuperCar-assistant-backend
```

#### Option 2: Using Docker Compose

```bash
cd infrastructure
docker-compose up
```

### Thank you for the opportunity

I hope you like the test.
