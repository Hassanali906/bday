/* =========================================================
   ✏️  EDIT ME — everything personal lives in this block
   ========================================================= */
const CONFIG = {
  name: "You",                       // her name (shown in the hero headline)
  // Replace the text below with your own words. Line breaks (\n) are kept.
  letter: "[WRITE YOUR PERSONAL MESSAGE HERE]",
  signature: "— [Your name]",        // handwritten-style signature
  // Photos: put files in ./images/ and edit paths/captions here.
  photos: [
    { src: "./images/photo1.jpg", caption: "caption one" },
    { src: "./images/photo2.jpg", caption: "caption two" },
    { src: "./images/photo3.jpg", caption: "caption three" },
    { src: "./images/photo4.jpg", caption: "caption four" },
    { src: "./images/photo5.jpg", caption: "caption five" },
    { src: "./images/photo6.jpg", caption: "caption six" }
  ],
  // Little messages shown when each card is tapped
  cardNotes: {
    spidey: "With great birthdays comes great cake.",
    coffee: "Today's special: one extra-good day.",
    fashion: "Main character outfit, unlocked.",
    guitar: "This year's song is going to be a good one.",
    aesthetic: "Collect the little moments. ✿"
  }
};
/* ===================== END EDIT BLOCK ===================== */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- Fill in personal content ---- */
$$("[data-bind=name]").forEach(e => (e.textContent = CONFIG.name));
$("#letterText").textContent = CONFIG.letter;
$("#letterText").style.whiteSpace = "pre-line";
$("#sig").textContent = CONFIG.signature;

/* ---- Floating background doodles ---- */
if (!reduced) {
  const glyphs = ["♡", "★", "✦", "♪", "☕", "✿"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.textContent = glyphs[i % glyphs.length];
    s.style.cssText = `left:${Math.random() * 100}%;font-size:${14 + Math.random() * 22}px;animation-duration:${18 + Math.random() * 20}s;animation-delay:-${Math.random() * 30}s`;
    $("#bg").appendChild(s);
  }
}

/* ---- Confetti (lightweight canvas) ---- */
const cv = $("#confetti"), ctx = cv.getContext("2d");
let bits = [], raf = 0;
const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
addEventListener("resize", resize); resize();
function confetti(n = 140) {
  if (reduced) return;
  const cols = ["#d62839", "#14213d", "#e8b4bc", "#6f4e37", "#c0c4cc", "#ffb703"];
  for (let i = 0; i < n; i++) bits.push({
    x: innerWidth / 2, y: innerHeight * 0.6,
    vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 4,
    s: 5 + Math.random() * 6, r: Math.random() * 6, c: cols[i % cols.length], life: 120 + Math.random() * 60
  });
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  bits = bits.filter(b => b.life-- > 0);
  bits.forEach(b => {
    b.vy += 0.3; b.x += b.vx; b.y += b.vy; b.r += 0.2;
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
    ctx.fillStyle = b.c; ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); ctx.restore();
  });
  raf = bits.length ? requestAnimationFrame(tick) : 0;
}
function floaters(glyphs = ["♡", "★", "✦"], n = 18) {
  if (reduced) return;
  for (let i = 0; i < n; i++) {
    const f = document.createElement("span");
    f.className = "float"; f.textContent = glyphs[i % glyphs.length];
    f.style.cssText = `left:${Math.random() * 100}%;font-size:${18 + Math.random() * 20}px;color:${i % 2 ? "#d62839" : "#e8b4bc"};animation-delay:${Math.random() * 1.2}s`;
    document.body.appendChild(f); setTimeout(() => f.remove(), 5500);
  }
}

/* ---- Hero: open gift, reveal experience ---- */
function openGift() {
  const g = $("#gift");
  if (g.classList.contains("open")) return;
  g.classList.add("open"); confetti(); floaters();
  setTimeout(() => {
    $("#experience").hidden = false;
    $("#cards").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, reduced ? 0 : 1100);
}
$("#gift").addEventListener("click", openGift);
$("#open").addEventListener("click", openGift);

/* ---- Section A: cards ---- */
$$(".card").forEach(c => {
  $(".pop", c).textContent = CONFIG.cardNotes[c.dataset.k];
  c.addEventListener("click", () => {
    c.classList.toggle("on");
    if (c.classList.contains("on")) floaters(["★", "♡"], 6);
  });
});

/* ---- Section B: gallery ---- */
const rot = [-3, 2, -1.5, 3, -2, 1.5];
CONFIG.photos.forEach((p, i) => {
  const fig = document.createElement("figure");
  fig.className = "polaroid"; fig.style.setProperty("--r", rot[i % rot.length] + "deg");
  fig.innerHTML = `<i class="tape"></i><button aria-label="Open photo: ${p.caption}"><span>photo goes here<br>(${p.src.split("/").pop()})</span><img src="${p.src}" alt="${p.caption}" loading="lazy"></button><p>${p.caption}</p>`;
  const img = $("img", fig);
  img.addEventListener("error", () => img.remove()); // keeps the placeholder visible
  $("button", fig).addEventListener("click", () => {
    if (!img.isConnected) return; // no real photo yet
    const lb = $("#lb"); $("img", lb).src = p.src; $("img", lb).alt = p.caption; $("p", lb).textContent = p.caption; lb.showModal();
  });
  $("#scrap").appendChild(fig);
});
const lb = $("#lb");
$(".x", lb).addEventListener("click", () => lb.close());
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$(".polaroid").forEach(p => io.observe(p));

/* ---- Section C: envelope ---- */
$("#env").addEventListener("click", e => {
  const env = e.currentTarget, open = env.classList.toggle("open");
  env.setAttribute("aria-expanded", open);
  $("#envHint").textContent = open ? "Tap again to close" : "Tap the envelope";
  if (open) floaters(["♡"], 6);
});

/* ---- Section D: cake ---- */
$("#wish").addEventListener("click", () => {
  $("#cakewrap").classList.add("lit");
  $("#wishmsg").classList.add("show");
  confetti(200); floaters(["♡", "★", "✦"], 24);
});
