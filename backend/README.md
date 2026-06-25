# Global Health Dashboard API

A RESTful backend powering the **Global Health Dashboard** application.
This API provides data persistence, CRUD operations, and business logic
for managing health data using **Flask** and **PostgreSQL**.

------------------------------------------------------------------------

# About the Project

The Global Health Dashboard API is the backend service for the Global
Health Dashboard application.

In Phase 1, the frontend consumed the WHO Global Health Observatory
public API directly.

For Phase 2, we are extending the application into a full-stack solution
by introducing our own backend and PostgreSQL database. The backend
stores and manages user-created data while exposing RESTful API
endpoints that the React frontend consumes.

------------------------------------------------------------------------

# Features

-   RESTful API built with Flask
-   PostgreSQL relational database
-   SQLAlchemy ORM
-   Database migrations with Flask-Migrate
-   Full CRUD operations
-   JSON API responses
-   Modular project architecture
-   CORS enabled
-   Environment-based configuration
-   Seed database support

------------------------------------------------------------------------

# Tech Stack

  Layer           Technology
  --------------- ---------------
  Language        Python 3
  Framework       Flask
  ORM             SQLAlchemy
  Database        PostgreSQL
  Migration       Flask-Migrate
  Serialization   Marshmallow
  Environment     python-dotenv

------------------------------------------------------------------------

# Project Structure

``` text
backend/
│
├── app/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── config.py
│   ├── extensions.py
│   └── __init__.py
│
├── migrations/
├── seed.py
├── run.py
├── requirements.txt
├── .env
└── README.md
```

------------------------------------------------------------------------

# Installation

## Clone the repository

``` bash
git clone <repository-url>
cd backend
```

## Create a virtual environment

### macOS / Linux

``` bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows

``` bash
python -m venv .venv
.venv\Scripts\activate
```

## Install dependencies

``` bash
pip install -r requirements.txt
```

------------------------------------------------------------------------

# Environment Variables

Create a `.env` file.

``` env
FLASK_APP=run.py
FLASK_ENV=development

SECRET_KEY=your-secret-key

DATABASE_URL=postgresql://postgres:password@localhost:5432/health_dashboard
```

------------------------------------------------------------------------

# Database Setup

``` bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

(Optional)

``` bash
python seed.py
```

------------------------------------------------------------------------

# Running the Server

``` bash
python run.py
```

API URL

    http://localhost:5000

------------------------------------------------------------------------

# Example API Endpoints

## Countries

  Method   Endpoint
  -------- --------------------------
  GET      /countries
  GET      /countries/`<id>`{=html}
  POST     /countries
  PATCH    /countries/`<id>`{=html}
  DELETE   /countries/`<id>`{=html}

## Favorites

  Method   Endpoint
  -------- --------------------------
  GET      /favorites
  GET      /favorites/`<id>`{=html}
  POST     /favorites
  PATCH    /favorites/`<id>`{=html}
  DELETE   /favorites/`<id>`{=html}

------------------------------------------------------------------------

# Future Improvements

-   JWT Authentication
-   User Accounts
-   Search & Filtering
-   Swagger/OpenAPI Documentation
-   Docker Support
-   Automated Testing
-   CI/CD Pipeline

------------------------------------------------------------------------

# Team

  Name             Responsibility
  ---------------- -------------------------------------
  Collins Kiptoo   Project Lead & Backend Architecture
  Shawn Ochieng    Backend API
  Wasaa Abdalla    Frontend Integration
  Samuel Wanjau    Frontend Features
  Rhoda Kinoti     UI/UX & Documentation

------------------------------------------------------------------------
