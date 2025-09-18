**This is not the final folder structure**

school-project/
│── README.md
│── .gitignore
│── docker-compose.yml
│── .env
│
├── backend/                  # Node.js + PostgreSQL API
│   │── README.md
│   │── .env
│   │── package.json
│   │── jest.config.js
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── loaders/
│   │   ├── modules/
│   │   │   ├── auth/              # Login, register, password reset
│   │   │   ├── admin/             # Admin role
│   │   │   ├── farmers/           # Farmer role
│   │   │   ├── crops/             # Crop info & analytics
│   │   │   ├── weather/           # Weather API integration
│   │   │   ├── profile/           # Profile management
│   │   │   ├── settings/          # Preferences & system settings
│   │   │   └── notifications/     # Alerts & reminders
│   │   │
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── tests/
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── README.md
│
├── database/
│   ├── migrations/
│   │   ├── 001_init.sql
│   │   ├── 002_add_farmers.sql
│   │   └── 003_add_profiles.sql
│   └── README.md
│
├── web/                       # React Web App
│   │── README.md
│   │── .env
│   │── package.json
│   │── vite.config.js
│   │
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── Footer.jsx
│       │   ├── HeroSection.jsx   # Landing page hero
│       │   └── README.md
│       │
│       ├── pages/
│       │   ├── LandingPage.jsx   # Public landing page
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Settings.jsx
│       │   ├── Profile.jsx
│       │   │
│       │   ├── farmers/
│       │   │   ├── FarmersList.jsx
│       │   │   ├── FarmerProfile.jsx
│       │   │   ├── FarmerDashboard.jsx
│       │   │   └── README.md
│       │   │
│       │   └── admin/
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminUsers.jsx
│       │       ├── Reports.jsx
│       │       └── README.md
│       │
│       ├── services/
│       ├── hooks/
│       └── tests/
│
└── mobile/                    # Flutter Mobile App
    │── README.md
    │── .env
    │── pubspec.yaml
    │
    └── lib/
        ├── main.dart
        │
        ├── src/
        │   ├── screens/
        │   │   ├── landing_screen.dart
        │   │   ├── login_screen.dart
        │   │   ├── register_screen.dart
        │   │   ├── farmer_dashboard.dart
        │   │   ├── admin_dashboard.dart
        │   │   ├── settings_screen.dart
        │   │   ├── profile_screen.dart
        │   │   ├── notifications_screen.dart
        │   │   └── README.md
        │   │
        │   ├── widgets/
        │   │   ├── custom_button.dart
        │   │   ├── custom_input.dart
        │   │   └── README.md
        │   │
        │   ├── services/
        │   │   ├── api_service.dart
        │   │   ├── auth_service.dart
        │   │   └── README.md
        │   │
        │   ├── models/
        │   │   ├── farmer.dart
        │   │   ├── admin.dart
        │   │   ├── profile.dart
        │   │   └── README.md
        │   │
        │   └── tests/
        │       ├── login_test.dart
        │       ├── dashboard_test.dart
        │       └── README.md
        │
        └── assets/
            ├── images/
            │   ├── logo.png
            │   └── banner.png
            ├── icons/
            │   ├── settings_icon.png
            │   └── profile_icon.png
            └── README.md
