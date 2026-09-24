/* Shared wireframe behaviour + hefte */
(function () {
  const LANG_KEY = "aib_lang";

  const HEFTE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg>';

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

  function updateHefteBadge() {
    const n = window.AibHefte ? AibHefte.count() : 0;
    document.querySelectorAll("[data-hefte-count]").forEach((el) => {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
    document.querySelectorAll("[data-hefte-toggle]").forEach((btn) => {
      const id = btn.dataset.hefteId || btn.closest("[data-hefte-id]")?.dataset.hefteId;
      if (!id || !window.AibHefte) return;
      const on = AibHefte.has(id);
      btn.setAttribute("aria-pressed", String(on));
      btn.classList.toggle("is-in-hefte", on);
      const label = on ? "Fjern fra hefte" : "Legg i hefte";
      btn.setAttribute("aria-label", label);
      const text = btn.querySelector(".hefte-btn__text");
      if (text) text.textContent = on ? "I heftet" : "Legg i hefte";
    });
  }

  function ensureHefteHeader() {
    const actions = document.querySelector(".header-actions");
    if (!actions) return;

    // Remove old Favoritter controls
    actions.querySelectorAll(".icon-btn").forEach((btn) => {
      const label = (btn.querySelector(".label")?.textContent || "").trim();
      if (/^favoritt/i.test(label)) btn.remove();
    });

    if (actions.querySelector("[data-hefte-nav]")) {
      updateHefteBadge();
      return;
    }

    const link = document.createElement("a");
    link.className = "icon-btn icon-btn--hefte";
    link.href = "hefte.html";
    link.setAttribute("data-hefte-nav", "");
    link.innerHTML =
      HEFTE_ICON +
      '<span class="label">Hefte</span><span class="hefte-badge" data-hefte-count hidden>0</span>';

    const menuBtn = actions.querySelector("[data-menu-toggle]");
    if (menuBtn) actions.insertBefore(link, menuBtn);
    else actions.appendChild(link);

    updateHefteBadge();
  }

  function wireHefteToggles() {
    document.querySelectorAll("[data-hefte-toggle]").forEach((btn) => {
      if (btn.dataset.hefteWired) return;
      btn.dataset.hefteWired = "1";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id =
          btn.dataset.hefteId ||
          btn.closest("[data-hefte-id]")?.dataset.hefteId ||
          (window.AibHefte && btn.closest(".activity-card")
            ? AibHefte.slugFromTitle(btn.closest(".activity-card").querySelector(".title")?.textContent?.trim())
            : null);
        if (!id || !window.AibHefte) return;
        AibHefte.toggle(id);
        updateHefteBadge();
      });
    });
  }

  /** Convert leftover .fav buttons into hefte toggles */
  function upgradeFavButtons() {
    document.querySelectorAll("button.fav, .fav").forEach((btn) => {
      if (btn.dataset.hefteToggle != null || btn.hasAttribute("data-hefte-toggle")) return;
      const card = btn.closest(".activity-card");
      const title = card?.querySelector(".title")?.textContent?.trim();
      const id =
        card?.dataset.hefteId ||
        (window.AibHefte && title ? AibHefte.slugFromTitle(title) : null) ||
        "froskefangst";
      if (card && !card.dataset.hefteId) card.dataset.hefteId = id;
      btn.classList.remove("fav");
      btn.classList.add("hefte-btn");
      btn.setAttribute("data-hefte-toggle", "");
      btn.dataset.hefteId = id;
      btn.type = "button";
      btn.innerHTML =
        HEFTE_ICON.replace('aria-hidden="true"', 'aria-hidden="true" class="hefte-btn__icon"');
      btn.setAttribute("aria-label", "Legg i hefte");
      btn.setAttribute("aria-pressed", "false");
      btn.title = "Legg i hefte";
    });
  }

  ensureLangSwitch();
  ensureHefteHeader();
  upgradeFavButtons();
  wireHefteToggles();
  updateHefteBadge();

  window.addEventListener("aib:hefte-change", updateHefteBadge);

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
})();
