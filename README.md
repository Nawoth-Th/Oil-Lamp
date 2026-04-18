# 🪔 Pol Thel Pahana — Online Awrudu Uthsawaya 2026

An interactive web application that simulates the traditional Sri Lankan **Pol Thel Pahana Paththuwa** (coconut oil lamp lighting ceremony) for an online Awrudu Uthsawaya celebration.

---

## ✨ Features

- **Interactive Oil Lamp** — A real brass lamp image with 7 precise wick points, each individually clickable
- **Flame Animation** — Smooth flicker animation with glow effect when a wick is lit
- **Celebration Overlay** — Confetti burst and Sinhala New Year message when all 7 wicks are lit
- **Live Sync** — Pusher-based real-time state sharing compatible with serverless hosting (Vercel)
- **State Persistence** — Upstash Redis ensures lit wicks are remembered across sessions and restarts
- **Background Music** — Toggle traditional Awrudu audio
- **Progress Bar** — Visual tracker showing how many wicks have been lit
- **Countdown Timer** — Live countdown to the Sinhala New Year moment (April 13, 2026 at 6:17 AM)
- **Responsive Design** — Works on desktop and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + Vanilla CSS |
| Animations | Framer Motion |
| Real-time Events | Pusher Channels |
| Persistence | Upstash Redis |
| Language | TypeScript |
| Package Manager | pnpm |

---

## 📁 Project Structure

```text
pahana-app/
├── app/
│   ├── api/lamp/route.ts # Serverless API (Redis sync + Pusher trigger)
│   ├── globals.css       # Design tokens, animations, base styles
│   ├── layout.tsx        # Root layout & metadata
│   └── page.tsx          # Main page — lamp, countdown, progress, controls
├── components/
│   ├── OilLamp.tsx       # Lamp image + wick overlay positioning
│   ├── Wick.tsx          # Individual wick button + flame host
│   ├── Flame.tsx         # Animated SVG flame component
│   ├── Celebration.tsx   # All-lit overlay with confetti
│   ├── ProgressBar.tsx   # Wick lit progress indicator
│   └── AudioToggle.tsx   # Background music on/off toggle
├── hooks/
│   └── useLampState.ts   # Pusher real-time hook (syncs with API)
├── public/
│   ├── lamp.png          # Brass oil lamp source image (500×500px)
│   ├── header-01.png     # Sinhala title header image
│   ├── header-02.png     # Awrudu year header image
│   └── ...               # Audio & other assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Pusher Account (Free tier)
- Upstash Redis Database (Free tier)

### Environment Setup

Create a `.env.local` file in the `pahana-app/` directory and add your keys:

```bash
# Pusher
NEXT_PUBLIC_PUSHER_APP_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"
PUSHER_APP_ID="your-id"
PUSHER_SECRET="your-secret"

# Upstash Redis
UPSTASH_REDIS_REST_URL="your-url"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

### Install & Run

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Design

- **Palette** — Deep dark brown background (`#0f0500`) with gold (`#f5c842`), amber, and orange accents
- **Typography** — Cinzel (headings) + Noto Serif Sinhala (Sinhala script)
- **Wick coordinates** — Measured precisely from the 500×500px lamp image and mapped as percentages onto the container for pixel-perfect flame placement

---

## 🌺 Ceremony

Light all 7 wicks to complete the ceremony and receive the New Year blessing:

> **සුබ අලුත් අවුරුද්දක් වේවා !**
> *(Wishing you a Happy New Year!)*
