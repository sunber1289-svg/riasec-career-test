// ============================================================
// app.js — RIASEC Career Test Main Logic + Firebase Integration
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  limit,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─── Firebase Config ───────────────────────────────────────
// TODO: firebase.google.com дээрх өөрийн project-ийн config-ийг энд оруул
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── Data ──────────────────────────────────────────────────
const QUESTIONS = [
  { id: 1,  text: "Машин засах",                    type: "R", emoji: "🔧" },
  { id: 2,  text: "Барилгын ажил хийх",              type: "R", emoji: "🏗️" },
  { id: 3,  text: "Гар ажиллагаа шаардсан зүйл хийх", type: "R", emoji: "🪚" },
  { id: 4,  text: "Хөдөө аж ахуй эрхлэх",            type: "R", emoji: "🌾" },
  { id: 5,  text: "Тоног төхөөрөмж ажиллуулах",       type: "R", emoji: "⚙️" },
  { id: 6,  text: "Цахилгаан хэрэгсэл засах",         type: "R", emoji: "⚡" },
  { id: 7,  text: "Туршилт хийх",                    type: "I", emoji: "🧪" },
  { id: 8,  text: "Шинжлэх ухааны судалгаа хийх",     type: "I", emoji: "🔬" },
  { id: 9,  text: "Математик бодлого бодох",           type: "I", emoji: "🔢" },
  { id: 10, text: "Өгөгдөл анализ хийх",              type: "I", emoji: "📊" },
  { id: 11, text: "Шинэ зүйл судалж нээх",            type: "I", emoji: "🔭" },
  { id: 12, text: "Логик асуудал шийдэх",             type: "I", emoji: "🧩" },
  { id: 13, text: "Зураг зурах",                     type: "A", emoji: "🎨" },
  { id: 14, text: "Дизайн гаргах",                   type: "A", emoji: "✏️" },
  { id: 15, text: "Хөгжим зохиох",                   type: "A", emoji: "🎵" },
  { id: 16, text: "Бүтээлч бичих",                   type: "A", emoji: "📝" },
  { id: 17, text: "Тайз, урлагийн ажил хийх",         type: "A", emoji: "🎭" },
  { id: 18, text: "Шинэ санаа гаргах",               type: "A", emoji: "💡" },
  { id: 19, text: "Хүмүүст зөвлөгөө өгөх",           type: "S", emoji: "💬" },
  { id: 20, text: "Багшлах",                         type: "S", emoji: "📚" },
  { id: 21, text: "Хүүхэд асрах",                    type: "S", emoji: "👶" },
  { id: 22, text: "Сайн дурын ажил хийх",            type: "S", emoji: "🤝" },
  { id: 23, text: "Бусдад туслах",                   type: "S", emoji: "❤️" },
  { id: 24, text: "Сэтгэлзүйн зөвлөгөө өгөх",        type: "S", emoji: "🧠" },
  { id: 25, text: "Бизнес эхлүүлэх",                 type: "E", emoji: "🚀" },
  { id: 26, text: "Бараа зарах",                     type: "E", emoji: "🛍️" },
  { id: 27, text: "Хүмүүсийг удирдах",               type: "E", emoji: "👑" },
  { id: 28, text: "Маркетинг хийх",                  type: "E", emoji: "📣" },
  { id: 29, text: "Илтгэл тавих",                    type: "E", emoji: "🎤" },
  { id: 30, text: "Хэлэлцээр хийх",                  type: "E", emoji: "🤜" },
  { id: 31, text: "Excel дээр ажиллах",              type: "C", emoji: "📋" },
  { id: 32, text: "Баримт бичиг боловсруулах",        type: "C", emoji: "📄" },
  { id: 33, text: "Санхүү тооцоо хийх",              type: "C", emoji: "💰" },
  { id: 34, text: "Мэдээлэл ангилах",                type: "C", emoji: "🗂️" },
  { id: 35, text: "Албан бичиг хөтлөх",              type: "C", emoji: "✍️" },
  { id: 36, text: "Дүрэм журам мөрдөх",              type: "C", emoji: "📏" },
];

const FOLLOW_UP = {
  R: ["Гадаа ажиллах дуртай юу?", "Биеийн хүчний ажилд дуртай юу?", "Техник хэрэгсэлтэй ажиллах сонирхолтой юу?"],
  I: ["Гүнзгий судалгаа хийх дуртай юу?", "Дата анализ хийх сонирхолтой юу?", "Шинжлэх ухаанд дуртай юу?"],
  A: ["Чөлөөт сэтгэлгээ чухал уу?", "Өөрийн стиль илэрхийлэх дуртай юу?", "Бүтээлч ажил илүүд үздэг үү?"],
  S: ["Хүмүүстэй өдөр бүр харилцах дуртай юу?", "Бусдад туслах нь чухал уу?", "Багийн орчинд ажиллах уу?"],
  E: ["Эрсдэл хүлээхэд бэлэн үү?", "Удирдах дуртай юу?", "Орлого нэмэгдүүлэх сонирхолтой юу?"],
  C: ["Дүрэм журам чухал уу?", "Нарийвчлалд анхаардаг уу?", "Давтагддаг ажилд дуртай юу?"],
};

const TYPE_INFO = {
  R: {
    name: "Практик хүн",
    emoji: "🔧",
    color: "#EF8C3D",
    careers: [{ icon: "🔩", name: "Механик инженер" }, { icon: "🏗️", name: "Барилгын инженер" }, { icon: "🛠️", name: "Техникч" }],
    desc: "Чи гараараа зүйл хийхийг үнэхээр дуртай байна! Машин, тоног төхөөрөмж, барилга бүтээл — биет зүйлстэй ажиллах чадвар маш их байна.",
  },
  I: {
    name: "Судлаач хүн",
    emoji: "🔬",
    color: "#3B82F6",
    careers: [{ icon: "📊", name: "Data analyst" }, { icon: "🧬", name: "Судлаач" }, { icon: "🏥", name: "Эмч" }],
    desc: "Чи асуулт асуух, судлах, нээлт хийхийг хайрладаг байна! Шинжлэх ухаан, математик, логик сэтгэлгээ — чиний гол давуу тал.",
  },
  A: {
    name: "Бүтээлч хүн",
    emoji: "🎨",
    color: "#A855F7",
    careers: [{ icon: "🖌️", name: "Дизайнер" }, { icon: "✍️", name: "Зохиолч" }, { icon: "🎬", name: "Контент бүтээгч" }],
    desc: "Чи бүтээлч, урлаг, сэтгэл хөдлөлөөр дүүрэн байна! Зураг, хөгжим, дизайн, бичих — чиний авьяас тэнд байна.",
  },
  S: {
    name: "Нийгмийн хүн",
    emoji: "🤝",
    color: "#22C55E",
    careers: [{ icon: "📚", name: "Багш" }, { icon: "🧠", name: "Сэтгэлзүйч" }, { icon: "❤️", name: "Эмч" }],
    desc: "Чи хүмүүст туслах, зөвлөх, хайр халамж үзүүлэхийг хайрладаг байна! Нийгмийн ажил, эмнэлэг, боловсрол — чиний зам.",
  },
  E: {
    name: "Удирдагч хүн",
    emoji: "👑",
    color: "#EAB308",
    careers: [{ icon: "💼", name: "CEO" }, { icon: "📣", name: "Маркетер" }, { icon: "🛍️", name: "Борлуулалтын менежер" }],
    desc: "Чи удирдах, итгүүлэх, шийдвэр гаргахдаа идэвхтэй байна! Бизнес, менежмент, маркетинг — чиний ертөнц.",
  },
  C: {
    name: "Зохион байгуулагч",
    emoji: "📋",
    color: "#06B6D4",
    careers: [{ icon: "💰", name: "Нягтлан бодогч" }, { icon: "🗂️", name: "Оффис менежер" }, { icon: "💻", name: "Дата админ" }],
    desc: "Чи дүрэм, тооцоо, дэг журам сахихдаа маш сайн байна! Санхүү, мэдээлэл удирдлага, администрацийн ажил — чиний тав тухтай орчин.",
  },
};

const LABELS = ["Маш дургүй", "Дургүй", "Саармаг", "Таалагддаг", "Маш таалагддаг"];
const LABEL_EMOJI = ["😣", "😕", "😐", "😊", "🤩"];
const TYPE_NAMES = { R: "Практик", I: "Судлаач", A: "Бүтээлч", S: "Нийгмийн", E: "Удирдагч", C: "Зохион" };

// ─── State ─────────────────────────────────────────────────
let current = 0;
let answers = {};
let followAnswers = {};
let topTypes = [];
let studentName = "";
let finalScores = {};
let topType = "";

// ─── Screen Management ─────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── Start ─────────────────────────────────────────────────
window.startTest = function () {
  const nameEl = document.getElementById("student-name");
  studentName = nameEl.value.trim() || "Нэргүй";
  current = 0;
  answers = {};
  followAnswers = {};
  showScreen("screen-main");
  renderQuestion();
};

// ─── Render Question ───────────────────────────────────────
function renderQuestion() {
  const q = QUESTIONS[current];
  document.getElementById("q-num").textContent = `${current + 1} / ${QUESTIONS.length}`;
  document.getElementById("progress-fill").style.width = `${Math.round((current / QUESTIONS.length) * 100)}%`;
  document.getElementById("q-emoji").textContent = q.emoji;
  document.getElementById("q-text").textContent = q.text;

  const row = document.getElementById("rating-row");
  row.innerHTML = "";
  for (let v = 1; v <= 5; v++) {
    const btn = document.createElement("button");
    btn.className = "rating-btn" + (answers[q.id] === v ? " selected" : "");
    btn.setAttribute("aria-label", LABELS[v - 1]);
    btn.innerHTML = `<span class="r-emoji">${LABEL_EMOJI[v - 1]}</span>`;
    btn.addEventListener("click", () => selectRating(q.id, v));
    row.appendChild(btn);
  }

  document.getElementById("btn-prev").disabled = current === 0;
  document.getElementById("btn-next").disabled = !answers[q.id];
}

function selectRating(qid, val) {
  answers[qid] = val;
  document.querySelectorAll(".rating-btn").forEach((b, i) => {
    b.classList.toggle("selected", i + 1 === val);
  });
  document.getElementById("btn-next").disabled = false;
}

// ─── Navigation ────────────────────────────────────────────
window.goNext = function () {
  if (!answers[QUESTIONS[current].id]) return;
  if (current < QUESTIONS.length - 1) {
    current++;
    renderQuestion();
  } else {
    computeTopTypes();
    showFollowUp();
  }
};

window.goBack = function () {
  if (current > 0) { current--; renderQuestion(); }
};

// ─── Compute top types ─────────────────────────────────────
function computeTopTypes() {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  QUESTIONS.forEach((q) => { if (answers[q.id]) scores[q.type] += answers[q.id]; });
  finalScores = scores;
  topTypes = Object.keys(scores).sort((a, b) => scores[b] - scores[a]).slice(0, 2);
  topType = topTypes[0];
}

// ─── Follow-up ─────────────────────────────────────────────
function showFollowUp() {
  const container = document.getElementById("follow-questions");
  container.innerHTML = "";
  topTypes.forEach((type) => {
    FOLLOW_UP[type].forEach((q, i) => {
      const key = type + "_" + i;
      const div = document.createElement("div");
      div.className = "follow-q";
      div.innerHTML = `
        <div class="follow-q-text">${TYPE_INFO[type].emoji} ${q}</div>
        <div class="follow-yn">
          <button class="yn-btn yes" data-key="${key}" data-val="yes">Тийм</button>
          <button class="yn-btn no"  data-key="${key}" data-val="no">Үгүй</button>
        </div>`;
      container.appendChild(div);
    });
  });

  container.querySelectorAll(".yn-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const val = btn.dataset.val;
      followAnswers[key] = val === "yes";
      const row = btn.closest(".follow-yn");
      row.querySelectorAll(".yn-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  document.getElementById("follow-sub").textContent =
    `${topTypes.map((t) => TYPE_INFO[t].name).join(" & ")} чиглэлийн нэмэлт асуулт`;
  showScreen("screen-follow");
}

// ─── Results ───────────────────────────────────────────────
window.showResults = function () {
  const info = TYPE_INFO[topType];

  document.getElementById("r-emoji").textContent = info.emoji;
  document.getElementById("r-title").textContent = info.name + "!";
  document.getElementById("r-badge").textContent = topType + " type";
  document.getElementById("r-desc").textContent = info.desc;

  // Score bars
  const barsDiv = document.getElementById("score-bars");
  barsDiv.innerHTML = "";
  const sorted = Object.keys(finalScores).sort((a, b) => finalScores[b] - finalScores[a]);
  sorted.forEach((t) => {
    const pct = Math.round((finalScores[t] / 30) * 100);
    barsDiv.innerHTML += `
      <div class="bar-row">
        <div class="bar-label">${TYPE_NAMES[t]}</div>
        <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:${TYPE_INFO[t].color}"></div></div>
        <div class="bar-score">${finalScores[t]}</div>
      </div>`;
  });

  // Career cards
  const grid = document.getElementById("career-grid");
  grid.innerHTML = "";
  info.careers.forEach((c) => {
    grid.innerHTML += `
      <div class="career-card">
        <div class="career-icon">${c.icon}</div>
        <div class="career-name">${c.name}</div>
      </div>`;
  });

  document.getElementById("save-status").textContent = "";
  showScreen("screen-result");
  setTimeout(launchConfetti, 400);
};

// ─── Save to Firebase ──────────────────────────────────────
window.saveResult = async function () {
  const statusEl = document.getElementById("save-status");
  statusEl.textContent = "Хадгалж байна...";
  statusEl.style.color = "#7B6CF6";

  try {
    await addDoc(collection(db, "results"), {
      name: studentName,
      topType: topType,
      typeName: TYPE_INFO[topType].name,
      scores: finalScores,
      answers: answers,
      followAnswers: followAnswers,
      createdAt: serverTimestamp(),
    });
    statusEl.textContent = "✅ Амжилттай хадгалагдлаа!";
    statusEl.style.color = "#22C55E";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "❌ Алдаа гарлаа. Дахин оролдоорой.";
    statusEl.style.color = "#EF4444";
  }
};

// ─── Load Leaderboard ──────────────────────────────────────
async function loadLeaderboard() {
  const listEl = document.getElementById("board-list");
  listEl.innerHTML = "Уншиж байна...";

  try {
    const q = query(collection(db, "results"), orderBy("createdAt", "desc"), limit(20));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      listEl.innerHTML = "<p style='text-align:center;color:#9090B0;font-weight:700;padding:2rem 0'>Одоохондоо мэдэгдэл алга.</p>";
      return;
    }
    listEl.innerHTML = "";
    snapshot.docs.forEach((doc, i) => {
      const d = doc.data();
      const rankClass = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
      const rankSymbol = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
      const info = TYPE_INFO[d.topType] || {};
      listEl.innerHTML += `
        <div class="board-item">
          <div class="board-rank ${rankClass}">${rankSymbol}</div>
          <div class="board-name">${escapeHtml(d.name)}</div>
          <div class="board-type">${info.emoji || ""} ${d.typeName || d.topType}</div>
        </div>`;
    });
  } catch (err) {
    console.error(err);
    listEl.innerHTML = "<p style='text-align:center;color:#EF4444;font-weight:700;padding:2rem 0'>Алдаа гарлаа.</p>";
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ─── Reset ─────────────────────────────────────────────────
window.resetTest = function () {
  current = 0;
  answers = {};
  followAnswers = {};
  topTypes = [];
  studentName = "";
  finalScores = {};
  topType = "";
  showScreen("screen-intro");
};

// ─── Confetti ──────────────────────────────────────────────
function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#7B6CF6", "#F472B6", "#34D399", "#FBBF24", "#60A5FA", "#F87171"];
  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    w: 8 + Math.random() * 8,
    h: 4 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 6,
    alpha: 1,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vy += 0.05;
      if (frame > 60) p.alpha -= 0.012;
    });
    frame++;
    if (frame < 150) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}
