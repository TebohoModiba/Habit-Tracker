# Habit Tracker App with AI Suggestions

A full‑stack habit tracking mobile application that uses **Google Gemini AI** to generate personalised habit suggestions based on the user’s current habits and streaks.

- **Frontend:** React Native (Expo) + TypeScript  
- **Backend:** ASP.NET Core 8 Web API (C#)  
- **Database:** Firebase Firestore  
- **AI:** Google Gemini API (model: `gemini-2.5-flash`)  
- **Authentication:** JWT (via `dotnet user-jwts`) + BCrypt for password hashing  

---

## 📱 Features

- User registration & login with JWT authentication  
- Create, edit, delete, and mark habits as completed  
- Streak tracking (daily/weekly)  
- Dark / Light / System default theme (persisted)  
- Profile screen – upload avatar, edit bio, view stats  
- Bottom tab navigation: Habits, AI Tips, Profile, Settings  
- **AI‑powered suggestions** – Gemini analyses your habits and suggests 3 new complementary habits (JSON‑formatted, camelCase)  
- Fallback mock suggestions if the AI API fails  

---

## 🛠️ Tech Stack

| Layer       | Technology                                                                 |
|-------------|----------------------------------------------------------------------------|
| Frontend    | React Native (Expo), TypeScript, React Navigation, AsyncStorage           |
| Backend     | ASP.NET Core 8 Web API, C#                                                 |
| Database    | Google Cloud Firestore (NoSQL)                                            |
| AI          | Google Gemini API (`gemini-2.5-flash`)                                     |
| Auth        | JWT (generated via `dotnet user-jwts`) + BCrypt                            |
| HTTP Client | Frontend: `fetch` – Backend: `HttpClient` + Google.GenAI SDK              |

---

## 📂 Project Structure

```
habit-tracker/
├── backend/
│   └── HabitTrackerApi/
│       ├── Controllers/         # Auth, Habits, Suggestions
│       ├── Models/              # User, Habit, DTOs
│       ├── Services/            # AuthService, HabitService, SuggestionService, TokenService
│       ├── Program.cs
│       ├── appsettings.json
│       └── firebase-adminsdk.json   # (not committed)
├── frontend/
│   ├── assets/                  # Logo, images
│   ├── Components/              # HabitCard, SuggestionCard
│   ├── Context/                 # ThemeContext
│   ├── Functions/               # apiService.ts, habitService.ts
│   ├── Navigation/              # MainTabs.tsx
│   ├── Screens/                 # SignIn, SignUp, Home, HabitDetails, Suggestions, Profile, Settings
│   ├── Styles/                  # globalStyle.ts (theme‑aware)
│   ├── App.tsx
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+) and **npm** / **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **.NET 8 SDK** (for backend)
- **Google Cloud account** (Firestore + Gemini API)
- **Android Studio / Xcode** (for emulators) or a physical device with Expo Go

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/habit-tracker.git
cd habit-tracker
```

---

### 2. Backend Setup

#### a) Configure Firestore

- Create a Firebase project (e.g., `habittracker-d63f1`).
- Enable **Firestore Database** (e.g., `europe-west1`).
- Generate a **service account key** (JSON) from Project Settings → Service accounts → Generate new private key.
- Save the file as `firebase-adminsdk.json` in the backend project root (`HabitTrackerApi/`).

#### b) Configure Gemini API

- Go to [Google AI Studio](https://aistudio.google.com/apikey) and create an API key.
- Enable the **Generative Language API** in your Google Cloud Console.

#### c) Configure JWT

- In the backend folder, run:
  ```bash
  dotnet user-jwts key
  ```
- Copy the generated base64 secret key.

#### d) Update `appsettings.json`

```json
{
  "Logging": { ... },
  "AllowedHosts": "*",
  "Firestore": {
    "ProjectId": "habittracker-d63f1"
  },
  "Gemini": {
    "ApiKey": "YOUR_GEMINI_API_KEY"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY_FROM_DOTNET_USER_JWTS",
    "Issuer": "dotnet-user-jwts",
    "Audience": "http://localhost:5059",
    "ExpiryMinutes": 60
  }
}
```

#### e) Run the Backend

```bash
cd backend/HabitTrackerApi
dotnet restore
dotnet build
dotnet run --urls "http://0.0.0.0:5000"
```

The API will be available at `http://localhost:5000` (or your PC's IP on the local network).

---

### 3. Frontend Setup

#### a) Install Dependencies

```bash
cd frontend
npm install
```

#### b) Configure API Base URL

In `Functions/apiService.ts`, set `BASE_URL` to your backend’s IP and port (e.g., `http://192.168.1.89:5000/api`). Use your computer’s local IPv4 address when testing on a physical device.

#### c) Run the App

```bash
npx expo start --clear
```

Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).

---

## 🔌 API Endpoints (Backend)

All endpoints are prefixed with `/api`.

| Method | Endpoint                          | Description                      |
|--------|-----------------------------------|----------------------------------|
| POST   | `/auth/register`                  | Register new user                |
| POST   | `/auth/login`                     | Login, returns JWT token         |
| POST   | `/habits`                         | Create a new habit               |
| GET    | `/habits/user/{userId}`           | Get all habits for a user        |
| GET    | `/habits/{habitId}`               | Get a single habit               |
| PUT    | `/habits/{habitId}`               | Update a habit                   |
| DELETE | `/habits/{habitId}`               | Delete a habit                   |
| PATCH  | `/habits/{habitId}/complete`      | Mark a habit as completed        |
| POST   | `/suggestions/{userId}`           | Generate AI suggestions          |

> **Note:** All habit endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## 🎨 Theme System

The app supports **Light**, **Dark**, and **System default** themes.  
- The selected theme is stored in AsyncStorage and persists across sessions.  
- When `System default` is chosen, the app reacts to the device’s current appearance and updates in real time.  
- All styles are generated dynamically via `createGlobalStyles(colors)`.

---

## 🤖 AI Suggestions

- The backend fetches the user’s existing habits from Firestore.  
- A prompt instructs Gemini to return **exactly 3** habits as a **camelCase JSON array**.  
- The response is cleaned, validated, and parsed. Missing fields are filled with defaults.  
- If the Gemini API fails (network, quota, etc.), a static fallback list is returned so the feature never breaks.

Example Gemini response:
```json
[
  {"title":"Morning Stretch","description":"10 min yoga","frequency":"daily","targetCount":1},
  {"title":"Read 20 pages","description":"Daily reading","frequency":"daily","targetCount":1},
  {"title":"Weekly Review","description":"Plan the week","frequency":"weekly","targetCount":1}
]
```

---

## 🧪 Troubleshooting

### “Network request failed” (frontend)
- Ensure the phone and PC are on the **same WiFi network**.  
- Update `BASE_URL` in `apiService.ts` with the correct IPv4 address (run `ipconfig` on Windows).  
- Temporarily disable Windows Firewall or add an inbound rule for port 5000.

### Gemini API returns 404
- Enable the **Generative Language API** in Google Cloud Console.  
- Use a model from the list returned by `GET /v1beta/models?key=...`.  
- The code uses `gemini-2.5-flash` – confirm it’s available for your key.

### JSON parsing error on backend
- The backend logs the cleaned JSON – inspect it for malformed array or missing fields.  
- The prompt includes an example to guide the model.

### Theme not applying correctly
- Clear the app’s AsyncStorage or uninstall/reinstall.  
- Ensure `ThemeProvider` wraps the entire navigator in `App.tsx`.

---

## 📦 Dependencies (Key Packages)

### Backend (NuGet)
- `Google.Cloud.Firestore`
- `Google.GenAI`
- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `BCrypt.Net-Next`
- `Swashbuckle.AspNetCore`

### Frontend (npm)
- `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/stack`
- `expo-image-picker`
- `@react-native-async-storage/async-storage`
- `@expo/vector-icons`

---

## 📄 License

This project is for personal/educational use.  
All third‑party APIs (Gemini, Firebase) are subject to their own terms.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📧 Contact

For questions or support, open an issue on GitHub or reach out to [tebohomodiba658@gmail.com].

**Happy habit building! 🌱**
```