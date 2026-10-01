// ===== Helpers =====
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const NAV_H = 64;

function scrollToSection(id) {
  const el = $(id);
  if (!el) return;
  const top =
    id === "#home"
      ? 0
      : el.getBoundingClientRect().top + window.scrollY - NAV_H + 1;
  window.scrollTo({ top, behavior: "smooth" });
}

// ===== Navigation + hamburger menu =====
const navLinks = $("#navLinks");
const menuBtn = $("#menuBtn");

function closeMenu() {
  navLinks.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}
$$("[data-scroll]").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToSection(a.getAttribute("href"));
    closeMenu();
  }),
);
menuBtn.addEventListener("click", () => {
  menuBtn.setAttribute("aria-expanded", navLinks.classList.toggle("open"));
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// Hero buttons
$$("[data-target]").forEach((b) =>
  b.addEventListener("click", () => scrollToSection(b.dataset.target)),
);

// ===== Highlight current nav link (only HOME / VIDEO / ABOUT exist) =====
const map = {
  home: "#home",
  video: "#video",
  issue: "#video",
  about: "#about",
};
const sections = $$("main section[id]");
const links = $$(".nav-links a");
function onScroll() {
  let current = "home";
  sections.forEach((s) => {
    if (scrollY >= s.offsetTop - NAV_H - 160) current = s.id;
  });
  links.forEach((l) =>
    l.classList.toggle("active", l.getAttribute("href") === map[current]),
  );
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Reveal on scroll =====
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    });
  },
  { threshold: 0.15 },
);
$$(".reveal").forEach((el) => io.observe(el));

// ===== Video: placeholder + live status =====
const vid = $("#vid");
const vStatus = $("#vStatus");
vid.addEventListener("loadeddata", () => {
  $("#placeholder").style.display = "none";
});
vid.addEventListener("play", () => (vStatus.textContent = "PLAYING"));
vid.addEventListener(
  "pause",
  () => (vStatus.textContent = vid.ended ? "COMPLETE" : "PAUSED"),
);
vid.addEventListener("ended", () => (vStatus.textContent = "COMPLETE"));
$("#bigPlay").addEventListener("click", () => vid.play().catch(() => {}));
