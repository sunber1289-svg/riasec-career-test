# 🚀 RIASEC Мэргэжил Сонголтын Тест

10 насны хүүхдүүдэд зориулсан RIASEC карьерын тест вебсайт.  
**Firebase Hosting + Firestore** ашиглана.

---

## 📁 Файлын бүтэц

```
riasec-career-test/
├── index.html          ← Үндсэн HTML
├── styles.css          ← Бүх CSS загвар
├── app.js              ← Тестийн логик + Firebase холболт
├── firebase-config.js  ← ⚠️ Өөрийн Firebase config энд
├── firestore.rules     ← Firestore аюулгүй байдлын дүрэм
└── README.md
```

---

## ⚙️ Тохируулах алхам

### 1. Firebase Project үүсгэх

1. [Firebase Console](https://console.firebase.google.com) нэвтэр
2. **"Add project"** → нэр оруул → үүсгэ
3. **Firestore Database** → Create database → **Production mode** → байршил сонго

### 2. Web App нэмэх

1. Project Settings → **Your apps** → `</>` (Web) дарна
2. App nickname оруул → **Register app**
3. Гарч ирсэн `firebaseConfig` объектыг **`firebase-config.js`** файлд оруул:

```js
export const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "myproject.firebaseapp.com",
  projectId:         "myproject",
  storageBucket:     "myproject.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123:web:abc",
};
```

### 3. Firestore Rules тохируулах

Firebase Console → **Firestore Database → Rules** табд орж `firestore.rules` файлын агуулгыг хуулж тавь → **Publish**.

### 4. Firebase Hosting суулгах (terminal-д)

```bash
# Firebase CLI суулгах
npm install -g firebase-tools

# Нэвтрэх
firebase login

# Төсөл эхлүүлэх (folder дотроо ажиллуул)
firebase init

# Асуултуудад хариулах:
# ✅ Hosting: Configure files for Firebase Hosting
# ✅ Firestore: Configure security rules and indexes
# ? What do you want to use as your public directory? → . (цэг)
# ? Configure as a single-page app? → No
# ? Set up automatic builds with GitHub? → No (эсвэл Yes)

# Deploy хийх
firebase deploy
```

Deploy дууссаны дараа terminal-д URL гарна:
```
✔ Hosting URL: https://YOUR_PROJECT_ID.web.app
```

---

## 🌐 GitHub Pages дээр ажиллуулах (Firebase-гүй)

Firebase ашиглахгүй бол `app.js` файлын эхний 10 мөр (import хэсэг) болон `saveResult`, `loadLeaderboard` функцуудыг устга. Тест Firebase-гүйгээр ч ажиллана.

```
GitHub repo → Settings → Pages → Branch: main → Save
```

---

## 📊 Firestore дахь өгөгдлийн бүтэц

Collection: **`results`**

| Field         | Төрөл     | Тайлбар                        |
|---------------|-----------|-------------------------------|
| `name`        | string    | Хүүхдийн нэр                  |
| `topType`     | string    | R / I / A / S / E / C        |
| `typeName`    | string    | "Бүтээлч хүн" гэх мэт        |
| `scores`      | map       | `{ R: 20, I: 15, ... }`      |
| `answers`     | map       | Бүх асуултын хариулт          |
| `followAnswers` | map     | Нэмэлт асуултын хариулт       |
| `createdAt`   | timestamp | Автоматаар үүснэ              |

---

## 🧪 RIASEC Төрлүүд

| Код | Нэр              | Emoji | Гол чиглэл                  |
|-----|------------------|-------|------------------------------|
| R   | Практик хүн      | 🔧    | Техник, механик, барилга     |
| I   | Судлаач хүн      | 🔬    | Шинжлэх ухаан, математик     |
| A   | Бүтээлч хүн      | 🎨    | Урлаг, дизайн, бичих         |
| S   | Нийгмийн хүн     | 🤝    | Хүн, боловсрол, эрүүл мэнд  |
| E   | Удирдагч хүн     | 👑    | Бизнес, менежмент            |
| C   | Зохион байгуулагч| 📋    | Санхүү, мэдээлэл, дүрэм      |

---

## 📝 Лиценз

MIT — Чөлөөтэй ашиглаж болно.
