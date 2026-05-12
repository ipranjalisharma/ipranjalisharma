const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const savedTheme = localStorage.getItem("portfolio-theme");

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
};

applyTheme(savedTheme || "light");

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

const setActiveLink = () => {
  const current = sections
    .map((section) => ({
      id: section.id,
      distance: Math.abs(section.getBoundingClientRect().top - 130),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current?.id}`);
  });
};

const copyButton = document.querySelector("[data-copy]");
const copyLabel = copyButton?.querySelector("span");

copyButton?.addEventListener("click", async () => {
  const value = copyButton.dataset.copy;
  const originalText = copyLabel.textContent;

  try {
    await navigator.clipboard.writeText(value);
    copyLabel.textContent = "Copied";
  } catch {
    window.location.href = `mailto:${value}`;
  }

  window.setTimeout(() => {
    copyLabel.textContent = originalText;
  }, 1800);
});

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();
