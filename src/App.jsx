import { useState } from "react";

const COLORS = {
  bg: "#0d1117",
  surface: "#161b22",
  surface2: "#1c2333",
  border: "#2d3748",
  accent: "#c8a96e",
  accentDim: "#8a7040",
  accentPale: "rgba(200,169,110,0.08)",
  green: "#3fb950",
  red: "#f87171",
  yellow: "#fbbf24",
  blue: "#60a5fa",
  purple: "#a78bfa",
  muted: "#484f58",
  text: "#e6edf3",
  textDim: "#8b949e",
};

const GOALS = [
  { id: "weight_loss", label: "Weight Loss", emoji: "🔥", desc: "Lose body fat sustainably" },
  { id: "muscle_gain", label: "Muscle Gain", emoji: "💪", desc: "Build lean muscle mass" },
  { id: "maintenance", label: "Maintenance", emoji: "⚖️", desc: "Maintain current weight" },
  { id: "athletic", label: "Athletic Performance", emoji: "⚡", desc: "Fuel training and recovery" },
  { id: "gut_health", label: "Gut Health", emoji: "🌿", desc: "Improve digestion and microbiome" },
  { id: "hormonal", label: "Hormonal Balance", emoji: "🧬", desc: "Support hormonal health" },
  { id: "heart_health", label: "Heart Health", emoji: "❤️", desc: "Reduce cardiovascular risk" },
  { id: "energy", label: "Energy Optimization", emoji: "☀️", desc: "Maximize daily energy levels" },
  { id: "diabetes", label: "Blood Sugar Control", emoji: "🩺", desc: "Manage blood glucose levels" },
];

const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", desc: "Desk job, little exercise" },
  { id: "light", label: "Lightly Active", desc: "1-3 days/week exercise" },
  { id: "moderate", label: "Moderately Active", desc: "3-5 days/week exercise" },
  { id: "very", label: "Very Active", desc: "6-7 days/week hard training" },
  { id: "athlete", label: "Athlete", desc: "2x/day training or physical job" },
];

const DIET_STYLES = [
  "No restrictions", "High protein", "Low carb / Keto", "Mediterranean",
  "Whole foods / Clean eating", "Vegan", "Vegetarian", "Paleo", "Intermittent fasting"
];

const RESTRICTIONS = [
  "Gluten free", "Dairy free", "Nut allergy", "Shellfish allergy",
  "Egg free", "Soy free", "Kosher", "Halal"
];

export default function NutritionAgent() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [stats, setStats] = useState({ age: "", weight: "", height: "", gender: "" });
  const [activityLevel, setActivityLevel] = useState("");
  const [dietStyle, setDietStyle] = useState("");
  const [restrictions, setRestrictions] = useState([]);
  const [timeline, setTimeline] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedDay, setExpandedDay] = useState(0);
  const [fridgeItems, setFridgeItems] = useState("");
  const [fridgeLoading, setFridgeLoading] = useState(false);
  const [fridgeRecipes, setFridgeRecipes] = useState(null);
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  function toggleRestriction(r) {
    setRestrictions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  }

  function canProceed() {
    if (step === 1) return goal !== "";
    if (step === 2) return stats.age && stats.weight && stats.height && stats.gender && activityLevel;
    if (step === 3) return dietStyle !== "";
    return true;
  }

  async function generatePlan() {
    setLoading(true);
    setError(null);
    setPlan(null);

    const selectedGoal = GOALS.find(g => g.id === goal);
    const selectedActivity = ACTIVITY_LEVELS.find(a => a.id === activityLevel);

    const prompt = `You are a world-class registered dietitian and sports nutritionist with expertise across all health conditions. Create a comprehensive, personalized nutrition plan.

CLIENT PROFILE:
- Primary Goal: ${selectedGoal?.label} — ${selectedGoal?.desc}
- Age: ${stats.age}, Gender: ${stats.gender}
- Weight: ${stats.weight} lbs, Height: ${stats.height}
- Activity Level: ${selectedActivity?.label} (${selectedActivity?.desc})
- Diet Style: ${dietStyle}
- Dietary Restrictions: ${restrictions.length > 0 ? restrictions.join(", ") : "None"}
- Timeline: ${timeline || "No specific timeline"}
${notes ? `- Additional notes: ${notes}` : ""}

Return ONLY a valid JSON object (no markdown):
{
  "planName": "Personalized plan name",
  "summary": "2-3 sentence overview of this plan and approach",
  "dailyTargets": {
    "calories": 2200,
    "protein": 165,
    "carbs": 220,
    "fats": 73,
    "fiber": 30,
    "water": 3.5
  },
  "macroRationale": "2 sentences explaining why these specific macros suit this person's goal",
  "weeklyPlan": [
    {
      "day": "Monday",
      "theme": "High Protein Day",
      "totalCalories": 2200,
      "meals": [
        {
          "type": "Breakfast",
          "name": "Meal name",
          "description": "What's in it and how to prepare it briefly",
          "calories": 450,
          "protein": 35,
          "carbs": 40,
          "fats": 12
        },
        { "type": "Lunch", "name": "...", "description": "...", "calories": 550, "protein": 45, "carbs": 50, "fats": 18 },
        { "type": "Dinner", "name": "...", "description": "...", "calories": 650, "protein": 50, "carbs": 60, "fats": 22 },
        { "type": "Snack", "name": "...", "description": "...", "calories": 200, "protein": 15, "carbs": 20, "fats": 6 }
      ]
    }
  ],
  "monthlyProgression": [
    { "week": "Weeks 1-2", "focus": "Adaptation phase focus", "adjustment": "What to do or change" },
    { "week": "Weeks 3-4", "focus": "Building phase", "adjustment": "Progressive adjustment" },
    { "week": "Month 2", "focus": "Momentum phase", "adjustment": "How to progress" },
    { "week": "Month 3+", "focus": "Optimization", "adjustment": "Long-term strategy" }
  ],
  "supplements": [
    { "name": "Supplement name", "dose": "Amount and timing", "reason": "Why it helps this goal" }
  ],
  "weeklyGoals": [
    "Specific measurable goal 1",
    "Specific measurable goal 2",
    "Specific measurable goal 3"
  ],
  "nutritionTips": [
    "Practical tip 1 specific to this person's goal",
    "Practical tip 2",
    "Practical tip 3"
  ],
  "foodsToEat": ["food 1", "food 2", "food 3", "food 4", "food 5", "food 6", "food 7", "food 8"],
  "foodsToLimit": ["food 1", "food 2", "food 3", "food 4"],
  "warningSign": "One sign that would indicate the plan needs adjustment"
}

Generate a FULL 7-day weekly plan. Be specific with meal names and descriptions. Make this genuinely useful and scientifically sound for the stated goal.`;

    try {
      const response = await fetch("https://claude-proxy-kxgv.onrender.com/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 6000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");

      const fullText = data.content.map(i => i.type === "text" ? i.text : "").join("\n");
      const clean = fullText.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start === -1) throw new Error("Failed to generate plan");

      let jsonStr = clean.slice(start, end + 1);
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");
      jsonStr = jsonStr.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");

      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        throw new Error("JSON parse failed — try again");
      }

      setPlan(parsed);
      setActiveTab("overview");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function findFridgeRecipes() {
    if (!fridgeItems.trim() || !plan) return;
    setFridgeLoading(true);
    setFridgeRecipes(null);

    const prompt = `You are a nutrition-focused chef. Generate recipes using ONLY the available ingredients that also meet these specific nutritional targets.

NUTRITIONAL TARGETS (per meal):
- Daily calories: ${plan.dailyTargets?.calories} (aim for ~${Math.round(plan.dailyTargets?.calories / 3)} per main meal)
- Daily protein: ${plan.dailyTargets?.protein}g (aim for ~${Math.round(plan.dailyTargets?.protein / 3)}g per main meal)
- Diet style: ${dietStyle}
- Restrictions: ${restrictions.length > 0 ? restrictions.join(", ") : "None"}
- Goal: ${GOALS.find(g => g.id === goal)?.label}

AVAILABLE INGREDIENTS:
${fridgeItems}

Return ONLY valid JSON (no markdown):
{
  "recipes": [
    {
      "id": "1",
      "name": "Recipe name",
      "mealType": "Breakfast/Lunch/Dinner/Snack",
      "description": "Brief description",
      "cookTime": "20 mins",
      "difficulty": "Easy",
      "servings": 1,
      "calories": 450,
      "protein": 35,
      "carbs": 40,
      "fats": 12,
      "goalAlignment": "How well this fits their nutrition goal",
      "ingredients": ["ingredient with amount"],
      "steps": ["Step 1", "Step 2", "Step 3"],
      "missingIngredients": ["any small items needed"]
    }
  ]
}

Generate 4-6 recipes. Prioritize recipes that hit the protein target. Return only JSON.`;

    try {
      const response = await fetch("https://claude-proxy-kxgv.onrender.com/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");

      const fullText = data.content.map(i => i.type === "text" ? i.text : "").join("\n");
      const clean = fullText.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start === -1) throw new Error("No recipes found");

      let jsonStr = clean.slice(start, end + 1);
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");
      jsonStr = jsonStr.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
      const parsed = JSON.parse(jsonStr);
      setFridgeRecipes(parsed.recipes);
    } catch (err) {
      setError("Fridge recipe error: " + err.message);
    } finally {
      setFridgeLoading(false);
    }
  }

  const tabs = ["overview", "weekly", "monthly", "fridge"];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1117; }
        textarea { resize: vertical; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.surface }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "16px", color: COLORS.text, letterSpacing: "-0.02em" }}>
          🥗 Nutrition <span style={{ color: COLORS.accent }}>Agent</span>
        </div>
        {plan && (
          <button onClick={() => { setPlan(null); setStep(1); setGoal(""); setFridgeRecipes(null); }} style={{ background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.muted, padding: "6px 14px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
            New Plan
          </button>
        )}
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Onboarding */}
        {!plan && !loading && (
          <>
            {/* Progress bar */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
              {[1, 2, 3, 4].map(s => (
                <div key={s} style={{ flex: 1, height: "3px", borderRadius: "2px", background: s <= step ? COLORS.accent : COLORS.border, transition: "background 0.3s" }} />
              ))}
            </div>

            {/* Step 1 - Goal */}
            {step === 1 && (
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "8px", letterSpacing: "-0.02em" }}>What's your primary health goal?</div>
                <div style={{ fontSize: "13px", color: COLORS.textDim, marginBottom: "24px" }}>Your plan will be built around this goal.</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px", marginBottom: "32px" }}>
                  {GOALS.map(g => (
                    <button key={g.id} onClick={() => setGoal(g.id)} style={{ padding: "14px 16px", background: goal === g.id ? COLORS.accentPale : COLORS.surface, border: `1px solid ${goal === g.id ? COLORS.accent : COLORS.border}`, borderRadius: "10px", color: goal === g.id ? COLORS.accent : COLORS.textDim, cursor: "pointer", fontFamily: "'Inter', sans-serif", textAlign: "left", transition: "all 0.15s" }}>
                      <div style={{ fontSize: "20px", marginBottom: "6px" }}>{g.emoji}</div>
                      <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>{g.label}</div>
                      <div style={{ fontSize: "11px", opacity: 0.7 }}>{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 - Stats */}
            {step === 2 && (
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "8px", letterSpacing: "-0.02em" }}>Tell me about yourself</div>
                <div style={{ fontSize: "13px", color: COLORS.textDim, marginBottom: "24px" }}>Used to calculate your exact calorie and macro targets.</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  {[
                    { label: "Age", key: "age", placeholder: "e.g. 32" },
                    { label: "Weight (lbs)", key: "weight", placeholder: "e.g. 185" },
                    { label: "Height", key: "height", placeholder: "e.g. 5'11\"" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accentDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
                      <input value={stats[key]} onChange={e => setStats(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} style={{ width: "100%", background: COLORS.surface2, border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: "10px 14px", fontSize: "13px", borderRadius: "8px", fontFamily: "'Inter', sans-serif" }} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accentDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Gender</div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {["Male", "Female", "Other"].map(g => (
                        <button key={g} onClick={() => setStats(p => ({ ...p, gender: g }))} style={{ flex: 1, padding: "10px", background: stats.gender === g ? COLORS.accentPale : COLORS.surface2, border: `1px solid ${stats.gender === g ? COLORS.accent : COLORS.border}`, borderRadius: "8px", color: stats.gender === g ? COLORS.accent : COLORS.textDim, cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", transition: "all 0.15s" }}>{g}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accentDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Activity Level</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {ACTIVITY_LEVELS.map(a => (
                      <button key={a.id} onClick={() => setActivityLevel(a.id)} style={{ padding: "12px 16px", background: activityLevel === a.id ? COLORS.accentPale : COLORS.surface, border: `1px solid ${activityLevel === a.id ? COLORS.accent : COLORS.border}`, borderRadius: "8px", color: activityLevel === a.id ? COLORS.accent : COLORS.textDim, cursor: "pointer", fontFamily: "'Inter', sans-serif", textAlign: "left", display: "flex", justifyContent: "space-between", transition: "all 0.15s" }}>
                        <span style={{ fontSize: "13px", fontWeight: 500 }}>{a.label}</span>
                        <span style={{ fontSize: "12px", opacity: 0.6 }}>{a.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 - Diet */}
            {step === 3 && (
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "8px", letterSpacing: "-0.02em" }}>Your dietary preferences</div>
                <div style={{ fontSize: "13px", color: COLORS.textDim, marginBottom: "24px" }}>This shapes the foods and meals in your plan.</div>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accentDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Eating Style</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {DIET_STYLES.map(d => (
                      <button key={d} onClick={() => setDietStyle(d)} style={{ padding: "8px 16px", background: dietStyle === d ? COLORS.accentPale : COLORS.surface, border: `1px solid ${dietStyle === d ? COLORS.accent : COLORS.border}`, borderRadius: "20px", color: dietStyle === d ? COLORS.accent : COLORS.textDim, cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", transition: "all 0.15s" }}>{d}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accentDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Restrictions / Allergies</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {RESTRICTIONS.map(r => (
                      <button key={r} onClick={() => toggleRestriction(r)} style={{ padding: "8px 16px", background: restrictions.includes(r) ? "rgba(248,113,113,0.1)" : COLORS.surface, border: `1px solid ${restrictions.includes(r) ? "rgba(248,113,113,0.4)" : COLORS.border}`, borderRadius: "20px", color: restrictions.includes(r) ? COLORS.red : COLORS.textDim, cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", transition: "all 0.15s" }}>{r}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 - Timeline + Notes */}
            {step === 4 && (
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "8px", letterSpacing: "-0.02em" }}>Final details</div>
                <div style={{ fontSize: "13px", color: COLORS.textDim, marginBottom: "24px" }}>Optional but helpful for a more targeted plan.</div>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accentDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Timeline / Goal Date</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {["4 weeks", "8 weeks", "3 months", "6 months", "1 year", "Lifestyle change"].map(t => (
                      <button key={t} onClick={() => setTimeline(t)} style={{ padding: "8px 16px", background: timeline === t ? COLORS.accentPale : COLORS.surface, border: `1px solid ${timeline === t ? COLORS.accent : COLORS.border}`, borderRadius: "20px", color: timeline === t ? COLORS.accent : COLORS.textDim, cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", transition: "all 0.15s" }}>{t}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accentDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Anything else?</div>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. I have a wedding in 3 months, I work night shifts, I struggle with snacking at night, I love cooking..." style={{ width: "100%", minHeight: "80px", background: COLORS.surface2, border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: "12px 14px", fontSize: "13px", borderRadius: "8px", fontFamily: "'Inter', sans-serif" }} />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", gap: "12px" }}>
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 24px", background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.textDim, borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>Back</button>
              )}
              {step < 4 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} style={{ padding: "12px 32px", background: canProceed() ? COLORS.accent : COLORS.surface2, color: canProceed() ? COLORS.bg : COLORS.muted, border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: canProceed() ? "pointer" : "default", fontFamily: "'Inter', sans-serif" }}>Continue</button>
              ) : (
                <button onClick={generatePlan} style={{ padding: "12px 32px", background: COLORS.accent, color: COLORS.bg, border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>Generate My Plan</button>
              )}
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: COLORS.accentDim, fontSize: "13px", letterSpacing: "0.1em", animation: "pulse 1.5s ease-in-out infinite" }}>
            Building your personalized nutrition plan...
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(248,113,113,0.08)", border: `1px solid rgba(248,113,113,0.3)`, borderRadius: "8px", padding: "16px", color: COLORS.red, fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {/* Plan Output */}
        {plan && (
          <div>
            {/* Plan Header */}
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "28px", marginBottom: "20px", borderTop: `3px solid ${COLORS.accent}` }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Your Nutrition Plan</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "12px", letterSpacing: "-0.02em" }}>{plan.planName}</div>
              <p style={{ fontSize: "14px", color: COLORS.textDim, lineHeight: "1.75", marginBottom: "20px" }}>{plan.summary}</p>

              {/* Macro targets */}
              {plan.dailyTargets && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px", marginBottom: "16px" }}>
                  {[
                    { label: "Calories", value: plan.dailyTargets.calories, unit: "kcal", color: COLORS.accent },
                    { label: "Protein", value: plan.dailyTargets.protein, unit: "g", color: COLORS.green },
                    { label: "Carbs", value: plan.dailyTargets.carbs, unit: "g", color: COLORS.blue },
                    { label: "Fats", value: plan.dailyTargets.fats, unit: "g", color: COLORS.yellow },
                    { label: "Fiber", value: plan.dailyTargets.fiber, unit: "g", color: COLORS.purple },
                    { label: "Water", value: plan.dailyTargets.water, unit: "L", color: COLORS.blue },
                  ].map(({ label, value, unit, color }) => (
                    <div key={label} style={{ background: COLORS.surface2, borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "18px", fontWeight: 700, color, marginBottom: "2px" }}>{value}</div>
                      <div style={{ fontSize: "10px", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{unit}</div>
                      <div style={{ fontSize: "10px", color: COLORS.textDim, marginTop: "2px" }}>{label}</div>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ fontSize: "12px", color: COLORS.textDim, fontStyle: "italic" }}>{plan.macroRationale}</p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: COLORS.surface, borderRadius: "10px", padding: "4px", border: `1px solid ${COLORS.border}` }}>
              {[
                { id: "overview", label: "Overview" },
                { id: "weekly", label: "Weekly Plan" },
                { id: "monthly", label: "Progression" },
                { id: "fridge", label: "🥦 Cook Now" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "8px 12px", background: activeTab === tab.id ? COLORS.accent : "transparent", color: activeTab === tab.id ? COLORS.bg : COLORS.textDim, border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: activeTab === tab.id ? 600 : 400, cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.15s" }}>{tab.label}</button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Weekly Goals */}
                {plan.weeklyGoals?.length > 0 && (
                  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "20px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.green, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Weekly Goals</div>
                    {plan.weeklyGoals.map((g, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "13px", color: COLORS.textDim, alignItems: "flex-start" }}>
                        <span style={{ color: COLORS.green, flexShrink: 0 }}>✓</span>{g}
                      </div>
                    ))}
                  </div>
                )}

                {/* Foods to eat / limit */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {plan.foodsToEat?.length > 0 && (
                    <div style={{ background: COLORS.surface, border: `1px solid rgba(63,185,80,0.2)`, borderRadius: "10px", padding: "20px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.green, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Foods to Prioritize</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {plan.foodsToEat.map((f, i) => (
                          <span key={i} style={{ fontSize: "12px", padding: "3px 10px", background: "rgba(63,185,80,0.08)", border: "1px solid rgba(63,185,80,0.2)", color: COLORS.green, borderRadius: "20px" }}>{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {plan.foodsToLimit?.length > 0 && (
                    <div style={{ background: COLORS.surface, border: `1px solid rgba(248,113,113,0.2)`, borderRadius: "10px", padding: "20px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.red, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Foods to Limit</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {plan.foodsToLimit.map((f, i) => (
                          <span key={i} style={{ fontSize: "12px", padding: "3px 10px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: COLORS.red, borderRadius: "20px" }}>{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tips */}
                {plan.nutritionTips?.length > 0 && (
                  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "20px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Nutrition Tips</div>
                    {plan.nutritionTips.map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "13px", color: COLORS.textDim, alignItems: "flex-start" }}>
                        <span style={{ color: COLORS.accent, flexShrink: 0 }}>→</span>{t}
                      </div>
                    ))}
                  </div>
                )}

                {/* Supplements */}
                {plan.supplements?.length > 0 && (
                  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "20px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.purple, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Supplement Recommendations</div>
                    {plan.supplements.map((s, i) => (
                      <div key={i} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: i < plan.supplements.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: COLORS.text }}>{s.name}</span>
                          <span style={{ fontSize: "12px", color: COLORS.purple }}>{s.dose}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: COLORS.textDim }}>{s.reason}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warning */}
                {plan.warningSign && (
                  <div style={{ background: "rgba(251,191,36,0.06)", border: `1px solid rgba(251,191,36,0.2)`, borderRadius: "10px", padding: "16px 20px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: COLORS.yellow, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>⚠ Watch For</div>
                    <div style={{ fontSize: "13px", color: COLORS.textDim }}>{plan.warningSign}</div>
                  </div>
                )}
              </div>
            )}

            {/* Weekly Plan Tab */}
            {activeTab === "weekly" && plan.weeklyPlan && (
              <div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {plan.weeklyPlan.map((day, i) => (
                    <button key={i} onClick={() => setExpandedDay(i)} style={{ padding: "6px 14px", background: expandedDay === i ? COLORS.accent : COLORS.surface, border: `1px solid ${expandedDay === i ? COLORS.accent : COLORS.border}`, borderRadius: "20px", color: expandedDay === i ? COLORS.bg : COLORS.textDim, cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: expandedDay === i ? 600 : 400 }}>{day.day}</button>
                  ))}
                </div>

                {plan.weeklyPlan[expandedDay] && (
                  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: COLORS.text }}>{plan.weeklyPlan[expandedDay].day}</div>
                        <div style={{ fontSize: "13px", color: COLORS.accent }}>{plan.weeklyPlan[expandedDay].theme}</div>
                      </div>
                      <div style={{ fontSize: "13px", color: COLORS.textDim }}>{plan.weeklyPlan[expandedDay].totalCalories} kcal</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {plan.weeklyPlan[expandedDay].meals?.map((meal, j) => (
                        <div key={j} style={{ background: COLORS.surface2, borderRadius: "8px", padding: "14px 16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                            <div>
                              <div style={{ fontSize: "10px", color: COLORS.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{meal.type}</div>
                              <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.text }}>{meal.name}</div>
                            </div>
                            <div style={{ textAlign: "right", fontSize: "11px", color: COLORS.textDim }}>
                              <div style={{ color: COLORS.accent, fontWeight: 600 }}>{meal.calories} kcal</div>
                              <div>P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fats}g</div>
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", color: COLORS.textDim, lineHeight: "1.6" }}>{meal.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Monthly Progression Tab */}
            {activeTab === "monthly" && plan.monthlyProgression && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {plan.monthlyProgression.map((phase, i) => (
                  <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "20px", borderLeft: `3px solid ${COLORS.accent}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: COLORS.accent }}>{phase.week}</div>
                      <div style={{ fontSize: "12px", color: COLORS.textDim }}>{phase.focus}</div>
                    </div>
                    <div style={{ fontSize: "13px", color: COLORS.textDim, lineHeight: "1.6" }}>{phase.adjustment}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Fridge Tab */}
            {activeTab === "fridge" && (
              <div>
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: COLORS.text, marginBottom: "8px" }}>Cook With What You Have</div>
                  <div style={{ fontSize: "13px", color: COLORS.textDim, marginBottom: "16px", lineHeight: "1.6" }}>
                    Enter what's in your fridge and I'll generate recipes that fit your nutrition targets — {plan.dailyTargets?.calories} kcal, {plan.dailyTargets?.protein}g protein per day.
                  </div>
                  <textarea
                    value={fridgeItems}
                    onChange={e => setFridgeItems(e.target.value)}
                    placeholder="e.g. chicken breast, eggs, spinach, brown rice, olive oil, garlic, Greek yogurt, sweet potato..."
                    style={{ width: "100%", minHeight: "100px", background: COLORS.surface2, border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: "12px 14px", fontSize: "13px", borderRadius: "8px", fontFamily: "'Inter', sans-serif", lineHeight: "1.6", marginBottom: "16px" }}
                  />
                  <button
                    onClick={findFridgeRecipes}
                    disabled={fridgeLoading || !fridgeItems.trim()}
                    style={{ padding: "11px 28px", background: fridgeLoading || !fridgeItems.trim() ? COLORS.surface2 : COLORS.accent, color: fridgeLoading || !fridgeItems.trim() ? COLORS.muted : COLORS.bg, border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: fridgeLoading || !fridgeItems.trim() ? "default" : "pointer", fontFamily: "'Inter', sans-serif" }}
                  >
                    {fridgeLoading ? "Finding recipes..." : "Find Matching Recipes"}
                  </button>
                </div>

                {fridgeLoading && (
                  <div style={{ textAlign: "center", padding: "40px 0", color: COLORS.accentDim, fontSize: "13px", animation: "pulse 1.5s ease-in-out infinite" }}>
                    Finding recipes that match your nutrition goals...
                  </div>
                )}

                {fridgeRecipes && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {fridgeRecipes.map((recipe, i) => (
                      <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", overflow: "hidden", borderLeft: `3px solid ${COLORS.green}` }}>
                        <div style={{ padding: "18px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }} onClick={() => setExpandedRecipe(expandedRecipe === i ? null : i)}>
                          <div>
                            <div style={{ fontSize: "11px", color: COLORS.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>{recipe.mealType}</div>
                            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: COLORS.text, marginBottom: "6px" }}>{recipe.name}</div>
                            <div style={{ fontSize: "12px", color: COLORS.textDim }}>{recipe.cookTime} · {recipe.difficulty} · {recipe.calories} kcal · {recipe.protein}g protein</div>
                          </div>
                          <div style={{ color: COLORS.muted }}>{expandedRecipe === i ? "↑" : "↓"}</div>
                        </div>
                        {expandedRecipe === i && (
                          <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${COLORS.border}`, paddingTop: "16px" }}>
                            <div style={{ fontSize: "12px", color: COLORS.green, fontStyle: "italic", marginBottom: "14px" }}>✓ {recipe.goalAlignment}</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                              <div>
                                <div style={{ fontSize: "10px", fontWeight: 600, color: COLORS.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Ingredients</div>
                                {recipe.ingredients?.map((ing, j) => (
                                  <div key={j} style={{ fontSize: "12px", color: COLORS.textDim, marginBottom: "4px" }}>· {ing}</div>
                                ))}
                              </div>
                              <div>
                                <div style={{ fontSize: "10px", fontWeight: 600, color: COLORS.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Steps</div>
                                {recipe.steps?.map((step, j) => (
                                  <div key={j} style={{ fontSize: "12px", color: COLORS.textDim, marginBottom: "6px", display: "flex", gap: "8px" }}>
                                    <span style={{ color: COLORS.accent, flexShrink: 0 }}>{j + 1}</span>{step}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {recipe.missingIngredients?.length > 0 && (
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {recipe.missingIngredients.map((item, j) => (
                                  <span key={j} style={{ fontSize: "11px", padding: "2px 8px", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: COLORS.blue, borderRadius: "20px" }}>+ {item}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}