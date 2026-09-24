/* Shared wireframe behaviour */
(function () {
  const LANG_KEY = "aib_lang";

  function getLang() {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "nb" || stored === "en") return stored;
    return document.documentElement.lang?.startsWith("en") ? "en" : "nb";
  }

  function setLang(lang) {
    const next = lang === "en" ? "en" : "nb";
    localStorage.setItem(LANG_KEY, next);
    document.documentElement.lang = next;
    document.querySelectorAll(".lang-switch__btn").forEach((btn) => {
      const active = btn.dataset.lang === next;
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  function ensureLangSwitch() {
    const actions = document.querySelector(".header-actions");
    if (!actions || actions.querySelector(".lang-switch")) return;

    const wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Språk / Language");
    wrap.innerHTML = `
      <button type="button" class="lang-switch__btn" data-lang="nb" aria-pressed="true">NO</button>
      <button type="button" class="lang-switch__btn" data-lang="en" aria-pressed="false">EN</button>
    `;
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-lang]");
      if (!btn) return;
      setLang(btn.dataset.lang);
    });

    const menuBtn = actions.querySelector("[data-menu-toggle]");
    if (menuBtn) actions.insertBefore(wrap, menuBtn);
    else actions.appendChild(wrap);

    setLang(getLang());
  }

  ensureLangSwitch();

  const menuBtn = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const backdrop = document.querySelector("[data-menu-backdrop]");
  const closeBtn = document.querySelector("[data-menu-close]");

  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("open", open);
    backdrop?.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeBtn?.focus();
    else menuBtn.focus();
  }

  menuBtn?.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
  });
  backdrop?.addEventListener("click", () => setMenu(false));
  closeBtn?.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  const header = document.querySelector(".site-header");
  window.addEventListener(
    "scroll",
    () => header?.classList.toggle("is-scrolled", window.scrollY > 8),
    { passive: true }
  );

  document.querySelectorAll(".fav").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const on = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", String(!on));
      btn.innerHTML = !on
        ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.2-4.6-9.5-8.2C.6 9.7 2.2 6 5.6 6c1.9 0 3.2 1.1 4 2.1C10.4 7.1 11.7 6 13.6 6c3.4 0 5 3.7 3.1 6.8C19.2 16.4 12 21 12 21z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7.2-4.6-9.5-8.2C.6 9.7 2.2 6 5.6 6c1.9 0 3.2 1.1 4 2.1C10.4 7.1 11.7 6 13.6 6c3.4 0 5 3.7 3.1 6.8C19.2 16.4 12 21 12 21z"/></svg>';
    });
  });
})();
