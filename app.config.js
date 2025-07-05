// app.config.js
export default {
  expo: {
    name: "Personal Health Tracker",
    slug: "personalhealthtracker",
    version: "1.0.0",
    extra: {
      // These will be available in your app
      groqApiKey: process.env.GROQ_API_KEY || "default-key-for-dev",
      groqApiUrl: process.env.GROQ_API_URL || "https://api.groq.com/openai/v1",
      environment: process.env.NODE_ENV || "development"
    },
    // ... other expo config
  },
};