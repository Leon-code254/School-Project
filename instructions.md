Instructions for Copilot — School Project

I have already created the root folder project: School Project
Check in the terminal:
PS C:\Users\User\OneDrive\Documentos\SCHOOL PROJECT>

First, connect this folder to my GitHub repository:

Repo link: https://github.com/Leon-code254/School-Project.git

GitHub username: Leon-code254

GitHub email: leonosula@gmail.com

Project Summary

Name: School Project
Description: A context-aware mobile/web app that provides farmers with real-time personalized agricultural advice.

The system uses farmer profiles (farm location, crop type, soil info), contextual data (weather, market prices, optionally sensor data), and a recommendation engine (rule-based, later extendable to ML) to deliver actionable advice such as irrigation, fertiliser timing, or market sale suggestions.

Stepwise Build Plan for Copilot
1. Repository Setup

Ensure the local folder is connected to the GitHub repo.

Commit and push all project files regularly.

Maintain clear commit messages.

2. Workspace Structure

Use the workspace structure we designed:

backend for APIs and recommendation engine.

database for migrations.

web for the React web app.

mobile for the Flutter app.

docs for Chapters 1, 2, and 3 plus diagrams.

flowchart images for architecture and logic diagrams.

Each major folder must have its own README and .env file where applicable.

3. Essential Features to Implement

Farmer registration and profile setup (farm details, crop type, soil type, location).

Weather data fetching (OpenWeatherMap).

Soil moisture input (manual entry first, sensor optional later).

Recommendation engine for irrigation using rule-based logic.

Logging recommendations with timestamp, inputs, and outputs.

History view for farmers.

Admin role for system oversight.

Notifications/alerts module.

4. User Interfaces

Web app (React):

Landing page

Login and registration

Farmer dashboard

Admin dashboard

Profile page

Settings page

Recommendations history

Mobile app (Flutter):

Landing screen

Login and registration

Farmer dashboard

Admin dashboard

Profile screen

Settings screen

Notifications screen

5. Database

PostgreSQL schema with tables for:

users

farms

crops

soil readings

recommendations

weather cache

market prices

6. Recommendation Engine

Start with rule-based logic for irrigation.

Use farmer crop threshold + soil moisture + rainfall forecast.

Extendable to ML later.

7. Development Setup

Use .env files for secrets and config.

Use Docker for local development (Postgres + backend).

Use ngrok for connecting mobile app to local backend.

8. Testing

Unit tests for recommendation logic.

Integration tests for backend endpoints.

End-to-end tests for main user flows.

9. Deployment

Containerize services with Docker.

Use GitHub Actions for CI/CD.

Host:

Backend → Railway/Render

Web → Vercel/Netlify

Mobile → local APK/IPA builds

10. Deliverables

Source code in GitHub repo.

Running demo (local with ngrok or deployed).

Docs in /docs folder (Chapters 1–3).

Diagrams in /flowchart images.

Demo video (2–4 minutes).

Final report/slides for school presentation.

Final Notes for Copilot

Always separate roles (farmer vs admin) in both backend and frontend.

Do not commit sensitive .env values.

Keep implementation stepwise and modular.

At every step, ensure consistency across backend, web, and mobile apps.

Keep documentation updated inside each folder.

👉 This file is your master build plan.