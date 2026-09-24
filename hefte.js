/* Aktivitetshefte — sessionStorage (uten innlogging) */
(function () {
  const KEY = "aib_hefte";
  const MAX = 20;

  /** Wireframe-katalog: id → innhold til liste/print */
  const CATALOG = {
    froskefangst: {
      id: "froskefangst",
      title: "Froskefangst",
      duration: "15 min",
      space: "Stor plass",
      image: "assets/photos/klatre-i-traer.jpg",
      purpose:
        "Barna leker i høy intensitet når de hopper dype froskehopp enten for å unngå å bli tatt eller når de fanger frosker.",
      steps: [
        "Avgrens lekeområdet.",
        "Barna er frosker og fordeler seg på lekeområdet.",
        "Velg ett eller flere barn som er jegere.",
        "Froskene forflytter seg med froskehopp og unngår å bli fanget.",
        "Froskene som blir tatt blir til jegere.",
      ],
      equipment: "Ingen krav til utstyr.",
    },
    "hold-omradet-rent": {
      id: "hold-omradet-rent",
      title: "Hold området rent",
      duration: "15 min",
      space: "Stor plass",
      image: "assets/photos/balansere.jpg",
      purpose: "Samarbeid og høy intensitet når barna holder området «rent».",
      steps: ["Del inn i lag.", "Rydd/「rens」området etter avtale.", "Bytt roller underveis."],
      equipment: "Kjegler eller merker.",
    },
    "den-flittige-bie": {
      id: "den-flittige-bie",
      title: "Den flittige bie",
      duration: "15 min",
      space: "Stor plass",
      image: "assets/photos/lop-sisten.jpg",
      purpose: "Løping og rollelek inspirert av bier.",
      steps: ["Avgrens blomsterenger.", "Bier samler «nektar».", "Bytt blomster underveis."],
      equipment: "Ingen / markører.",
    },
    stafett: {
      id: "stafett",
      title: "Stafett",
      duration: "15 min",
      space: "Stor plass",
      image: "assets/photos/saapebobler.jpg",
      purpose: "Lagvis løping og samarbeid.",
      steps: ["Sett opp strekninger.", "Overlever stafettpinne.", "Feire laginnsatsen."],
      equipment: "Stafettpinner eller myke gjenstander.",
    },
    "lop-og-hent": {
      id: "lop-og-hent",
      title: "Løp og hent",
      duration: "15 min",
      space: "Stor plass",
      image: "assets/photos/villsvin-lop.jpg",
      purpose: "Hurtighet og reaksjon når barna henter gjenstander.",
      steps: ["Plasser gjenstander.", "Gi signal.", "Hent og returner."],
      equipment: "Små gjenstander / kjegler.",
    },
    kjeglevelt: {
      id: "kjeglevelt",
      title: "Kjeglevelt",
      duration: "15 min",
      space: "Stor plass",
      image: "assets/photos/dyr-skog.jpg",
      purpose: "Ballferdigheter og samarbeid rundt kjegler.",
      steps: ["Sett opp kjegler.", "Velte / reise kjegler.", "Bytt roller."],
      equipment: "Kjegler og ball.",
    },
    naturbingo: {
      id: "naturbingo",
      title: "Naturbingo",
      duration: "15 min",
      space: "Stor plass",
      image: "assets/photos/loepelek-bakke.jpg",
      purpose: "Utforskning ute med bingo-oppgaver.",
      steps: ["Del ut bingokort.", "Finn elementer i naturen.", "Samle gruppen og del."],
      equipment: "Bingokort / papir.",
    },
    tresisten: {
      id: "tresisten",
      title: "Tresisten",
      duration: "15 min",
      space: "Stor plass",
      image: "assets/photos/lop-sisten.jpg",
      purpose: "Løp og fang rundt trær / merker.",
      steps: ["Velg «trær».", "Start sisten.", "Bytt fangere."],
      equipment: "Ingen / markører.",
    },
    "lego-taarn": {
      id: "lego-taarn",
      title: "Lego-tårn",
      duration: "15 min",
      space: "Liten plass",
      image: "assets/photos/balansere.jpg",
      purpose: "Finmotorikk og samarbeid om å bygge høyest.",
      steps: ["Del ut klosser.", "Bygg på tid eller rolig.", "Sammenlign og bygg videre."],
      equipment: "Lego / klosser.",
    },
  };

  function read() {
    try {
      const raw = JSON.parse(sessionStorage.getItem(KEY) || "[]");
      return Array.isArray(raw) ? raw.filter((id) => CATALOG[id]) : [];
    } catch {
      return [];
    }
  }

  function write(ids) {
    sessionStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("aib:hefte-change", { detail: { ids } }));
  }

  window.AibHefte = {
    MAX,
    catalog: CATALOG,

    list() {
      return read();
    },

    items() {
      return read().map((id) => CATALOG[id]).filter(Boolean);
    },

    count() {
      return read().length;
    },

    has(id) {
      return read().includes(id);
    },

    toggle(id) {
      if (!CATALOG[id]) return false;
      const ids = read();
      const i = ids.indexOf(id);
      if (i >= 0) {
        ids.splice(i, 1);
        write(ids);
        return false;
      }
      if (ids.length >= MAX) {
        alert("Hefte er fullt (maks " + MAX + " aktiviteter). Fjern noen før du legger til flere.");
        return false;
      }
      ids.push(id);
      write(ids);
      return true;
    },

    remove(id) {
      write(read().filter((x) => x !== id));
    },

    move(id, dir) {
      const ids = read();
      const i = ids.indexOf(id);
      if (i < 0) return;
      const j = i + dir;
      if (j < 0 || j >= ids.length) return;
      [ids[i], ids[j]] = [ids[j], ids[i]];
      write(ids);
    },

    clear() {
      write([]);
    },

    slugFromTitle(title) {
      const map = {
        Froskefangst: "froskefangst",
        "Hold området rent": "hold-omradet-rent",
        "Den flittige bie": "den-flittige-bie",
        Stafett: "stafett",
        "Løp og hent": "lop-og-hent",
        Kjeglevelt: "kjeglevelt",
        Naturbingo: "naturbingo",
        Tresisten: "tresisten",
        "Lego-tårn": "lego-taarn",
      };
      return map[title] || null;
    },
  };
})();
