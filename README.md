# 🥗 Nutrition Agent

An AI-powered nutrition planner that builds personalized meal plans based on your health goals, body stats, and dietary preferences — with integrated fridge-to-recipe matching aligned to your macro targets.

**Live Demo:** [nutrition-agent-virid.vercel.app](https://nutrition-agent-virid.vercel.app)

---

## What It Does

Walk through a 4-step onboarding flow and get a complete, personalized nutrition plan with daily macro targets and a repeatable meal schedule.

**Step 1 — Health Goal**
Choose from weight loss, muscle gain, maintenance, athletic performance, gut health, hormonal balance, heart health, energy optimization, or blood sugar control.

**Step 2 — Your Stats**
Age, weight, height, gender, and activity level — used to calculate precise calorie and macro targets.

**Step 3 — Dietary Preferences**
Eating style (high protein, keto, Mediterranean, vegan, etc.) and any restrictions or allergies.

**Step 4 — Plan Length**
Choose a 3, 5, or 7 day repeatable weekly plan.

**Each generated plan includes:**
- Daily calorie and macro targets (protein, carbs, fats, fiber, water)
- Macro rationale explaining why these targets suit your goal
- Day-by-day meal plan with breakfast, lunch, dinner, and snack
- Calories and macros per meal
- Foods to prioritize and foods to limit
- Weekly goals, nutrition tips, and supplement recommendations
- Nutrition and recovery notes

**Cook Now — Fridge Integration:**
Enter what's in your fridge and the agent generates recipes that match your specific macro targets — not just what you have available. A muscle gain plan gets high-protein recipes. A blood sugar plan gets low-glycemic recipes.

---

## Tech Stack

- **React** + **Vite** — frontend framework and build tool
- **Anthropic Claude API** (`claude-sonnet-4-6`) — personalized nutrition planning and recipe generation
- **Secure Backend Proxy** — API key never exposed to the browser
- **Vercel** — deployment and hosting

---

## Security

All API calls are routed through a secure backend proxy server. The Anthropic API key is stored only in the proxy's environment variables and never included in frontend code or exposed to the browser.

---

## Getting Started

### Prerequisites
- Node.js v18+
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- Backend proxy deployed (see [claude-proxy](https://github.com/JLSmith91/claude-proxy))

### Installation

```bash
git clone https://github.com/JLSmith91/nutrition-agent.git
cd nutrition-agent
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and build your plan.

---

## How to Use

1. Select your primary health goal
2. Enter your stats and activity level
3. Choose your eating style and any restrictions
4. Pick your plan length (3, 5, or 7 days)
5. Click **Generate My Plan**
6. Browse your macro targets, meal plan, and nutrition tips
7. Use **Cook Now** to find recipes from your available ingredients that match your targets

---

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Fork this repo
2. Deploy the [claude-proxy](https://github.com/JLSmith91/claude-proxy) backend and add your Anthropic API key there
3. Update the proxy URL in `src/App.jsx`
4. Import this repo into [vercel.com](https://vercel.com) and deploy

---

## Part of a Larger AI Tooling Portfolio

Nutrition Agent is part of a suite of AI-powered tools built for real-world daily use. Other projects include a workout plan generator, research agent, document Q&A tool, job search agent, meal planning agent, trade journal, and pre-market trading intelligence agent.

---

## Author

**Jared Smith** — [@JLSmith91](https://github.com/JLSmith91)
