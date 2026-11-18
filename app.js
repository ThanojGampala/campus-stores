(() => {
  const storageKey = "campus-stores.shift.v1";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      at: 15.75,
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      at: 19.5,
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      at: 33,
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  // Hours since Friday midnight, on the same scale as each shift's `at`.
  const returnTimes = {
    "Fri 8 pm": 20,
    "Sat 9 am": 33,
    "Sat 10 am": 34,
    "Sat noon": 36,
  };
  // The sample shift's Friday is the coming Friday, so the date picker shows real dates.
  const friday = new Date();
  friday.setHours(0, 0, 0, 0);
  friday.setDate(friday.getDate() + ((5 - friday.getDay() + 7) % 7));
  const maxDays = 14;
  const dateAt = (at) => {
    const d = new Date(friday);
    d.setDate(d.getDate() + Math.floor(at / 24));
    return d;
  };
  const isoDate = (d) =>
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0");
  const dayLabel = (at, weekday = "short") =>
    dateAt(at).toLocaleDateString("en-GB", {
      weekday,
      day: "numeric",
      month: "short",
    });
  const clockLabel = (at) => {
    const h = Math.floor(at % 24);
    const m = Math.round((at % 1) * 60);
    return (
      dayLabel(at) +
      ", " +
      (h % 12 || 12) +
      ":" +
      String(m).padStart(2, "0") +
      (h < 12 ? " am" : " pm")
    );
  };
  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];
  const original = () => ({
    version: 1,
    tab: "Requests",
    phase: 0,
    selected: "",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        back: false,
      },
    ],
    notes: [],
    editing: false,
    onlyOpen: true,
    query: "",
    open: null,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const getLoan = (num) => s.loans.find((l) => l.num === Number(num));
  const now = () => shifts[s.phase].at;
  const holder = (l) => (l.held ? l.held.who : l.who);
  const expectedAt = (l) => (l.held ? l.held.at : returnTimes[l.due]);
  const expectedLabel = (l) => (l.held ? clockLabel(l.held.at) : l.due);
  const timing = (l) => {
    const t = expectedAt(l);
    return t < now() ? "late" : t === now() ? "now" : "later";
  };
  const cleanName = (x) => {
    const n = String(x || "")
      .trim()
      .replace(/\s+/g, " ");
    return people.find((p) => p.toLowerCase() === n.toLowerCase()) || n;
  };
  const nameInput = (name, value) =>
    '<input name="' +
    name +
    '" list="known-people" required minlength="2" maxlength="40" autocomplete="off" value="' +
    esc(value) +
    '" />';
  const unitName = (a) => a.id + " · " + a.type;
  const whereIs = (a) =>
    a.repair
      ? "in repair (" + a.bin + ")"
      : out(a.id)
        ? "out with " + holder(out(a.id))
        : "on shelf " + a.bin;
  const compact = (x) =>
    String(x)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list, selected) =>
    list
      .map(
        ([v, t]) =>
          '<option value="' +
          esc(v) +
          '"' +
          (v === selected ? " selected" : "") +
          ">" +
          esc(t) +
          "</option>",
      )
      .join("");
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, good = false) =>
    '<span class="tag' + (good ? " good" : "") + '">' + esc(t) + "</span>";
  function itemStatus(r, type) {
    const loans = s.loans.filter(
      (l) => l.req === r.id && getAsset(l.asset).type === type,
    );
    const l = loans.find((x) => !x.back) || loans[loans.length - 1];
    if (!l) return "not issued yet";
    if (!l.back)
      return l.asset + " out with " + holder(l) + ", back by " + expectedLabel(l);
    return (
      l.asset +
      " back" +
      (l.backAt === undefined ? "" : " " + shifts[l.backAt].time)
    );
  }
  function requestSummary(r) {
    const loans = s.loans.filter((l) => l.req === r.id);
    if (!loans.length) return "Not issued yet";
    const open = loans.filter((l) => !l.back).length;
    return open ? open + " of " + r.items.length + " out" : "All back";
  }
  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · 3 approved forms",
    );
    if (s.selected) {
      const r = getReq(s.selected);
      html +=
        btn("Back to list", "close") +
        '<div class="record"><small>' +
        r.id +
        " · Approved</small><h3>" +
        r.event +
        "</h3><p>" +
        r.club +
        " · Filed by " +
        r.owner +
        "</p><p><b>Return by</b> " +
        r.due +
        "</p><p><b>Approved equipment</b></p><ul>" +
        r.items
          .map(
            (x) =>
              "<li>" + x + " <small>· " + esc(itemStatus(r, x)) + "</small></li>",
          )
          .join("") +
        "</ul><p>" +
        r.note +
        "</p></div>";
    } else
      html += requests
        .map((r) =>
          row(
            r.event,
            r.id + " · " + r.club + " · " + requestSummary(r),
            btn("View form", "request", r.id),
          ),
        )
        .join("");
    return html;
  }
  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const l = out(a.id);
      const status = a.repair ? "In repair" : l ? "On loan" : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        unitName(a),
        a.model + " · " + a.bin + (l ? " · with " + holder(l) : ""),
        badge(status, status === "On shelf"),
      );
    }
    return html;
  }
  function checkinPanel(l, a) {
    const twins = assets.filter((x) => x.type === a.type && x.id !== a.id);
    return (
      '<form class="panel full" data-checkin="' +
      l.num +
      '"><p><b>Check the label on the item.</b> This slip is for ' +
      esc(a.id + " · " + a.model) +
      ".</p>" +
      (twins.length
        ? '<p class="muted">Looks the same: ' +
          twins
            .map((x) => esc(x.id + " · " + x.model + ", " + whereIs(x)))
            .join("; ") +
          ".</p>"
        : "") +
      '<div class="form"><label><span>Brought in by</span>' +
      nameInput("from", holder(l)) +
      '</label></div><div class="buttons"><button type="submit" class="primary">Check in ' +
      esc(a.id) +
      "</button>" +
      btn("Cancel", "panel-close") +
      "</div></form>"
    );
  }
  function heldPanel(l, a) {
    const at = l.held ? l.held.at : undefined;
    const time =
      at === undefined
        ? ""
        : String(Math.floor(at % 24)).padStart(2, "0") +
          ":" +
          String(Math.round((at % 1) * 60)).padStart(2, "0");
    return (
      '<form class="panel full" data-held="' +
      l.num +
      '"><div class="form"><label><span>Who has ' +
      esc(a.id) +
      " now?</span>" +
      nameInput("who", l.held ? l.held.who : "") +
      '</label><label><span>Coming back</span><span class="when"><input type="date" name="date" required aria-label="Date" min="' +
      isoDate(dateAt(now())) +
      '" max="' +
      isoDate(dateAt((maxDays - 1) * 24)) +
      '" value="' +
      (at === undefined ? "" : isoDate(dateAt(at))) +
      '" /><input type="time" name="time" required aria-label="Time" value="' +
      time +
      '" /></span></label></div><p class="muted">Type any name. People the desk knows are suggested. The slip stays open in ' +
      esc(l.who) +
      "’s name, and the next shift sees this on the slip and in the desk book.</p>" +
      '<div class="buttons"><button type="submit" class="primary">Save for next shift</button>' +
      btn("Cancel", "panel-close") +
      "</div></form>"
    );
  }
  function slip(l, panel) {
    const a = getAsset(l.asset);
    const r = getReq(l.req);
    const when = l.back ? "" : timing(l);
    const tag = l.back
      ? badge("Returned")
      : when === "late"
        ? '<span class="tag warn">Late</span>'
        : when === "now"
          ? '<span class="tag now">Due now</span>'
          : "";
    const where = l.back
      ? "Back" +
        (l.backAt === undefined ? "" : " " + shifts[l.backAt].time) +
        (l.backFrom ? " from " + l.backFrom : "")
      : l.held
        ? "With " +
          l.held.who +
          " · coming back " +
          clockLabel(l.held.at) +
          (l.held.at === returnTimes[l.due] ? "" : " · was due " + l.due)
        : "Due " + l.due;
    const actions =
      l.back || panel
        ? ""
        : btn("Check in", "checkin-start", String(l.num)) +
          btn("Not back yet", "held-start", String(l.num));
    return (
      '<div class="row slip"><div><strong>' +
      esc(unitName(a)) +
      "</strong> " +
      tag +
      "<small>L-" +
      l.num +
      " · " +
      esc(r.club) +
      " (" +
      r.id +
      ") · Issued to " +
      esc(l.who) +
      '</small><small class="where">' +
      esc(where) +
      '</small></div><div class="actions">' +
      actions +
      "</div>" +
      (panel === "checkin" ? checkinPanel(l, a) : "") +
      (panel === "held" ? heldPanel(l, a) : "") +
      "</div>"
    );
  }
  function slipList() {
    const term = compact(s.query);
    const matches = (l) => {
      const a = getAsset(l.asset);
      const r = getReq(l.req);
      return compact(
        [
          l.asset,
          a.type,
          a.model,
          l.who,
          l.held ? l.held.who : "",
          l.backFrom || "",
          r.club,
          r.id,
          "L-" + l.num,
        ].join(" "),
      ).includes(term);
    };
    const shown = s.loans.filter(
      (l) => (!s.onlyOpen || !l.back) && (!term || matches(l)),
    );
    if (s.onlyOpen)
      shown.sort((x, y) => expectedAt(x) - expectedAt(y) || y.num - x.num);
    else shown.reverse();
    const openShown = shown.filter((l) => !l.back);
    // null lets a single search match open itself; false means the desk closed it.
    const panel =
      s.open === null
        ? term && openShown.length === 1
          ? { num: openShown[0].num, mode: "checkin" }
          : null
        : s.open;
    const spare = term
      ? assets.filter(
          (a) =>
            !out(a.id) && compact([a.id, a.type, a.model].join(" ")).includes(term),
        )
      : [];
    let html = "";
    if (!shown.length)
      html += term
        ? '<p class="hint">No slip matches “' + esc(s.query.trim()) + "”.</p>"
        : "<p>No outstanding slips.</p>";
    html += shown
      .map((l) => slip(l, panel && panel.num === l.num ? panel.mode : ""))
      .join("");
    html += spare
      .map(
        (a) =>
          '<p class="hint">' +
          esc(
            unitName(a) +
              " (" +
              a.model +
              ")" +
              (a.repair
                ? " is in repair (" + a.bin + ")."
                : " is not on any open slip. Home shelf: " + a.bin + "."),
          ) +
          "</p>",
      )
      .join("");
    return html;
  }
  function register() {
    let html = head(
      "Loan register",
      "One slip per physical unit",
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      const select = (label, key, options) =>
        "<label><span>" +
        label +
        '</span><select name="' +
        key +
        '" required><option value="">Select…</option>' +
        opts(options) +
        "</select></label>";
      return (
        html +
        '<form data-issue><div class="form">' +
        select(
          "Approved request",
          "req",
          requests.map((r) => [r.id, r.id + " · " + r.club]),
        ) +
        select(
          "Unit leaving the desk",
          "asset",
          available.map((a) => [a.id, unitName(a)]),
        ) +
        select(
          "Collected by",
          "who",
          people.map((p) => [p, p]),
        ) +
        select(
          "Return by",
          "due",
          Object.keys(returnTimes).map((d) => [d, d]),
        ) +
        '</div><button type="submit" class="primary">Save issue slip</button></form>'
      );
    }
    html +=
      '<label class="counter"><span>At the counter</span><input type="search" data-lookup autocomplete="off" spellcheck="false" placeholder="Label on the item or a name, e.g. AD-12 or Leela" value="' +
      esc(s.query) +
      '" /></label><div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      '</div><div data-slips aria-live="polite">' +
      slipList() +
      '</div><datalist id="known-people">' +
      opts(people.map((p) => [p, p])) +
      "</datalist>";
    return html;
  }
  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const n of s.notes)
      entries.push([
        shifts[n.phase].time,
        n.from ? "Loan register · slip " + n.from : "Counter handover",
        n.text,
      ]);
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>'
    );
  }
  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };
  function navNote(page) {
    if (page !== "Loan register") return "";
    const due = s.loans.filter((l) => !l.back && timing(l) !== "later");
    const late = due.filter((l) => timing(l) === "late").length;
    if (!due.length) return "";
    return (
      '<small class="navnote' +
      (late ? " warn" : "") +
      '">' +
      (late ? late + " late" : due.length + " due now") +
      "</small>"
    );
  }
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent =
      dayLabel(phase.at, "long") + " · " + phase.time.split(" · ")[1];
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg><span>' +
          n +
          navNote(n) +
          "</span></button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    q("[data-status]").textContent = s.notice;
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        s.open = null;
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        s.editing = false;
        s.query = "";
        s.open = null;
        break;
      case "close":
        s.selected = "";
        break;
      case "request":
        s.selected = v;
        break;
      case "new":
        s.editing = true;
        break;
      case "cancel":
        s.editing = false;
        break;
      case "scope":
        s.onlyOpen = v === "0";
        s.open = null;
        break;
      case "checkin-start":
        s.open = { num: Number(v), mode: "checkin" };
        break;
      case "held-start":
        s.open = { num: Number(v), mode: "held" };
        break;
      case "panel-close":
        s.open = false;
        break;
    }
    commit();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
  });
  root.addEventListener("input", (e) => {
    const held = e.target.closest("[data-held]");
    if (held) held.elements.time.setCustomValidity("");
    if (!e.target.matches("[data-lookup]")) return;
    s.query = e.target.value;
    s.open = null;
    q("[data-slips]").innerHTML = slipList();
  });
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (f.matches("[data-held]")) {
      const l = getLoan(f.dataset.held);
      const who = cleanName(form.get("who"));
      const [y, mo, d] = String(form.get("date")).split("-").map(Number);
      const day = Math.round((new Date(y, mo - 1, d) - friday) / 864e5);
      const [h, m] = String(form.get("time")).split(":").map(Number);
      if (
        !l ||
        l.back ||
        who.length < 2 ||
        !(day >= 0 && day < maxDays) ||
        !Number.isInteger(h) ||
        !Number.isInteger(m)
      )
        return;
      const at = day * 24 + h + m / 60;
      if (at <= now()) {
        f.elements.time.setCustomValidity(
          "Pick a time after " + shifts[s.phase].time + ".",
        );
        f.elements.time.reportValidity();
        return;
      }
      const a = getAsset(l.asset);
      const r = getReq(l.req);
      l.held = { who, at };
      s.notes.push({
        phase: s.phase,
        from: "L-" + l.num,
        text:
          unitName(a) +
          " (" +
          r.club +
          ") is with " +
          who +
          ". Coming back " +
          clockLabel(at) +
          ". The slip stays open in " +
          l.who +
          "’s name." +
          (people.includes(who)
            ? ""
            : " " + who + " is not on the desk’s list yet."),
      });
      s.open = null;
      commit(
        "Saved on slip L-" +
          l.num +
          ": " +
          a.id +
          " is with " +
          who +
          ", coming back " +
          clockLabel(at) +
          ".",
      );
      return;
    }
    if (f.matches("[data-checkin]")) {
      const l = getLoan(f.dataset.checkin);
      const from = cleanName(form.get("from"));
      if (!l || l.back || from.length < 2) return;
      l.back = true;
      l.backAt = s.phase;
      l.backFrom = from;
      const r = getReq(l.req);
      const left = s.loans.filter((x) => x.req === l.req && !x.back);
      s.query = "";
      s.open = null;
      commit(
        l.asset +
          " checked in from " +
          from +
          ". Slip L-" +
          l.num +
          " closed. " +
          r.club +
          " (" +
          r.id +
          "): " +
          (left.length
            ? "still out: " +
              left
                .map((x) => x.asset + (x.held ? " (with " + x.held.who + ")" : ""))
                .join(", ") +
              "."
            : "everything is back."),
      );
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const unit = getAsset(asset),
      r = getReq(req);
    if (!r || !unit || unit.repair || out(asset) || !people.includes(who))
      return;
    if (!r.items.includes(unit.type)) {
      q("[data-status]").textContent =
        "This equipment type is outside the approved request. Choose an approved unit.";
      return;
    }
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    ) {
      q("[data-status]").textContent =
        "The approved quantity of this equipment type is already on loan.";
      return;
    }
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({ num, req, asset, who, due, back: false });
    s.editing = false;
    commit("Issued " + asset + " to " + who + " on slip L-" + num + ".");
  });
  function restore(d) {
    if (
      !d ||
      d.version !== 1 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) =>
          n &&
          shifts[n.phase] &&
          typeof n.text === "string" &&
          (n.from === undefined || typeof n.from === "string"),
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l &&
          getReq(l.req) &&
          getAsset(l.asset) &&
          Number.isInteger(l.num) &&
          (l.held === undefined ||
            (l.held &&
              typeof l.held.who === "string" &&
              l.held.who.trim() !== "" &&
              Number.isFinite(l.held.at) &&
              l.held.at >= 0 &&
              l.held.at < maxDays * 24)) &&
          (l.backAt === undefined || !!shifts[l.backAt]) &&
          (l.backFrom === undefined || typeof l.backFrom === "string"),
      )
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l, held: l.held && { ...l.held } })),
      notes: d.notes.map((n) => ({ ...n })),
      query: "",
      open: null,
    };
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep the fresh shift when storage is unavailable or the saved data is invalid.
  }
})();
