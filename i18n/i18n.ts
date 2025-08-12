import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      // Auth
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      name: "Full Name",
      forgotPassword: "Forgot Password?",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",

      // Onboarding
      welcome: "Welcome to AI Fitness",
      chooseTrainer: "Choose Your AI Trainer",
      selectGoal: "Select Your Fitness Goal",

      // Goals
      weightLoss: "Weight Loss",
      muscleGain: "Muscle Gain",
      endurance: "Endurance",
      flexibility: "Flexibility",

      // Trainers
      sophia: "Sophia",
      emma: "Emma",
      alexis: "Alexis",
      maya: "Maya",

      // Main App
      home: "Home",
      workouts: "Workouts",
      nutrition: "Nutrition",
      progress: "Progress",
      profile: "Profile",

      // Workout
      startWorkout: "Start Workout",
      pause: "Pause",
      resume: "Resume",
      skip: "Skip",
      repeat: "Repeat",
      complete: "Complete",

      // Settings
      settings: "Settings",
      darkMode: "Dark Mode",
      language: "Language",
      notifications: "Notifications",
      help: "Help & Support",
      faq: "FAQ",
      contactSupport: "Contact Support",
      feedback: "Feedback",
      logout: "Logout",

      // Challenges
      challenges: "Challenges",
      joinChallenge: "Join Challenge",
      dayChallenge: "30-Day Fitness Challenge",

      // Notifications
      milestone: "Milestone Achieved!",
      goalCompleted: "Goal Completed",
    },
  },
  nl: {
    translation: {
      // Auth
      login: "Inloggen",
      register: "Registreren",
      email: "E-mail",
      password: "Wachtwoord",
      name: "Volledige Naam",
      forgotPassword: "Wachtwoord Vergeten?",
      dontHaveAccount: "Geen account?",
      alreadyHaveAccount: "Al een account?",

      // Onboarding
      welcome: "Welkom bij AI Fitness",
      chooseTrainer: "Kies Je AI Trainer",
      selectGoal: "Selecteer Je Fitness Doel",

      // Goals
      weightLoss: "Gewichtsverlies",
      muscleGain: "Spiergroei",
      endurance: "Uithoudingsvermogen",
      flexibility: "Flexibiliteit",

      // Trainers
      sophia: "Sophia",
      emma: "Emma",
      alexis: "Alexis",
      maya: "Maya",

      // Main App
      home: "Thuis",
      workouts: "Trainingen",
      nutrition: "Voeding",
      progress: "Voortgang",
      profile: "Profiel",

      // Workout
      startWorkout: "Start Training",
      pause: "Pauzeren",
      resume: "Hervatten",
      skip: "Overslaan",
      repeat: "Herhalen",
      complete: "Voltooien",

      // Settings
      settings: "Instellingen",
      darkMode: "Donkere Modus",
      language: "Taal",
      notifications: "Meldingen",
      help: "Help & Ondersteuning",
      faq: "Veelgestelde Vragen",
      contactSupport: "Contact Ondersteuning",
      feedback: "Feedback",
      logout: "Uitloggen",

      // Challenges
      challenges: "Uitdagingen",
      joinChallenge: "Deelnemen aan Uitdaging",
      dayChallenge: "30-Dagen Fitness Uitdaging",

      // Notifications
      milestone: "Mijlpaal Bereikt!",
      goalCompleted: "Doel Voltooid",
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
