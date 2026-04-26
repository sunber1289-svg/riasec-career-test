// firebase-config.js
// ─────────────────────────────────────────────────────────────
// 1. https://console.firebase.google.com дээр шинэ project үүсгэ
// 2. Project settings → Your apps → Add app → Web (</>)
// 3. Доорх утгуудыг өөрийн project-ийн config-ээр солино уу

export const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};
