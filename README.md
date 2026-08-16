# Mock Interview

Serverless mock interview app. Single HTML page, no backend, hosts on GitHub Pages.

Uses your Google account's Gemini API quota via OAuth implicit flow.

---

## Features

- **AI Interviewer** — Gemini 3.5 Flash, 5 role presets (Frontend, Backend, PM, Data Science, Behavioral)
- **Voice Input** — Web Speech API with real-time transcript
- **Face Tracking** — face-api.js bounding box + 68 landmarks, eye contact indicator

---

## Setup

### 1. Google Cloud OAuth Client ID

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project (or select existing)
3. **APIs & Services → Library** → search "Generative Language API" → Enable
4. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: anything (e.g. "Mock Interview")
   - **Authorized JavaScript origins** — add both:
     - `http://localhost:8080` (local dev)
     - `https://<your-username>.github.io` (production)
5. Copy the **Client ID** (ends in `.apps.googleusercontent.com`)

### 2. Configure the app (optional — can also paste at runtime)

Open `app.js` and set:
```js
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com'
```

If left empty, the app prompts for it on first load and stores it in `sessionStorage`.

### 3. Local dev

```bash
python -m http.server 8080
# then open http://localhost:8080
```

Or use VS Code Live Server / any static file server. Must be served over HTTP (not `file://`) for OAuth to work.

### 4. GitHub Pages

1. Push this repo to GitHub
2. Settings → Pages → Source: **main branch / root**
3. Your app lives at `https://<username>.github.io/<repo-name>/`

> Make sure to add that origin to your OAuth Client ID's authorized origins.

---

## Browser requirements

| Feature | Requirement |
|---|---|
| Web Speech API | Chrome or Edge (not Safari) |
| Webcam | Camera permission required |
| ES Modules | Any modern browser |

---

## How it works

1. **Sign in with Google** — triggers OAuth popup, captures access token
2. **Camera** — face-api.js loads models from CDN, opens webcam, runs detection loop
3. **Start Interview** — sends opening message to Gemini with chosen role's system prompt
4. **Record → speak → Stop → Submit** — transcript sent to Gemini, reply appears in chat
