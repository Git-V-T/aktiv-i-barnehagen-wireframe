/* Nytt forskningsprosjekt — unik kode per barnehage + Plausible prosjekt_id (ikke i URL) */
(function () {
  const KEY = "aib_prosjekt";

  /**
   * Wireframe: unik tilgangskode per barnehage (Strapi).
   * Tilgangskode ≠ prosjekt_id. Barnehagenavn sendes aldri til Plausible.
   * Offline Excel: prosjekt_id → barnehagenavn.
   */
  const VALID = {
    solhaugen26: {
      accessCode: "solhaugen26",
      prosjekt_id: "0234558",
      barnehage: "Solhaugen barnehage",
      prosjekt: "Nytt forskningsprosjekt",
    },
    bjorkelunden26: {
      accessCode: "bjorkelunden26",
      prosjekt_id: "0234559",
      barnehage: "Bjørkelunden barnehage",
      prosjekt: "Nytt forskningsprosjekt",
    },
    furulia26: {
      accessCode: "furulia26",
      prosjekt_id: "0234560",
      barnehage: "Furulia barnehage",
      prosjekt: "Nytt forskningsprosjekt",
    },
  };

  function plausible(...args) {
    window.plausible =
      window.plausible ||
      function () {
        (window.plausible.q = window.plausible.q || []).push(arguments);
      };
    window.plausible.apply(null, args);
  }

  function findByProsjektId(id) {
    return Object.values(VALID).find((v) => v.prosjekt_id === id) || null;
  }

  window.AibProsjekt = {
    get() {
      try {
        const raw = JSON.parse(sessionStorage.getItem(KEY) || "null");
        if (!raw?.prosjekt_id) return null;
        // Oppdater navn/barnehage fra gjeldende katalog (unngår stale session-tekst)
        const hit = findByProsjektId(raw.prosjekt_id);
        if (hit) {
          const fresh = {
            prosjekt_id: hit.prosjekt_id,
            barnehage: hit.barnehage,
            name: hit.prosjekt,
            at: raw.at || Date.now(),
          };
          if (raw.name !== fresh.name || raw.barnehage !== fresh.barnehage) {
            sessionStorage.setItem(KEY, JSON.stringify(fresh));
          }
          return fresh;
        }
        return raw;
      } catch {
        return null;
      }
    },

    login(code) {
      const hit = VALID[String(code || "").trim().toLowerCase()];
      if (!hit) return false;
      const session = {
        prosjekt_id: hit.prosjekt_id,
        barnehage: hit.barnehage,
        name: hit.prosjekt,
        at: Date.now(),
      };
      sessionStorage.setItem(KEY, JSON.stringify(session));
      // Kun pseudonym ID til analytics — ikke barnehagenavn
      plausible("Prosjekt login", { props: { prosjekt_id: hit.prosjekt_id } });
      return true;
    },

    logout() {
      const s = this.get();
      if (s?.prosjekt_id) {
        plausible("Prosjekt logout", { props: { prosjekt_id: s.prosjekt_id } });
      }
      sessionStorage.removeItem(KEY);
    },

    require(loginHref = "prosjekt-login.html") {
      if (!this.get()) {
        const next = encodeURIComponent(location.pathname.split("/").pop() || "prosjekt.html");
        location.href = `${loginHref}?next=${next}`;
        return false;
      }
      return true;
    },

    /** Sidevisning: samme URL for alle, barnehage skilles via Plausible props */
    trackPage() {
      const s = this.get();
      if (!s?.prosjekt_id) return;
      plausible("pageview", { props: { prosjekt_id: s.prosjekt_id } });
    },
  };
})();
