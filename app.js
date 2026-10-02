// Set after the Stripe payment link is created (see STRIPE.md).
const PRO_PAYMENT_LINK_URL = "https://buy.stripe.com/eVqbJ3cuI8id0wYddpfrW31";

function computeFit(controller, role) {
  const totalSlots = controller.buttons + controller.axes + controller.hats;
  let remaining = totalSlots;
  const rows = [];

  for (const wantedCategory of CATEGORY_PRIORITY) {
    const entry = role.core_functions.find(function (f) { return f.category === wantedCategory; });
    const need = entry ? entry.count : 0;
    if (need === 0) continue;
    const covered = Math.min(need, Math.max(remaining, 0));
    const short = need - covered;
    remaining -= covered;
    rows.push({ category: wantedCategory, need: need, covered: covered, short: short });
  }

  const totalCovered = Math.min(totalSlots, role.total_core_functions);
  const totalShort = role.total_core_functions - totalCovered;

  return { totalSlots: totalSlots, totalCovered: totalCovered, totalShort: totalShort, rows: rows };
}

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

function renderSources(container, sources) {
  container.innerHTML = "";
  const label = el("span", "sources-label", "Sources: ");
  container.appendChild(label);
  sources.forEach(function (s, i) {
    const a = el("a", null, s.label);
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    container.appendChild(a);
    if (i < sources.length - 1) container.appendChild(document.createTextNode(" · "));
  });
}

function renderResult(controller, role) {
  const fit = computeFit(controller, role);

  document.getElementById("result-heading").textContent =
    controller.name + " + " + role.role_name;

  document.getElementById("controller-slots").textContent =
    controller.buttons + " buttons, " + controller.axes + " axes, " + controller.hats + " hats (" +
    fit.totalSlots + " total input slots, " + controller.layout + ")";

  document.getElementById("role-needs").textContent =
    role.total_core_functions + " core functions — example ships: " + role.example_ships.join(", ");

  const summary = document.getElementById("fit-summary");
  summary.className = "fit-summary " + (fit.totalShort > 0 ? "fit-short" : "fit-full");
  summary.textContent = fit.totalShort > 0
    ? "Covers " + fit.totalCovered + " of " + role.total_core_functions + " core functions — " + fit.totalShort + " left over to push to keyboard or a second controller."
    : "Covers all " + role.total_core_functions + " core functions on this controller alone.";

  const tbody = document.getElementById("category-rows");
  tbody.innerHTML = "";
  fit.rows.forEach(function (row) {
    const tr = document.createElement("tr");
    const tdCat = el("td", null, row.category);
    const tdNeed = el("td", null, String(row.need));
    const tdCovered = el("td", null, String(row.covered));
    const tdShort = el("td", null, row.short > 0 ? String(row.short) : "-");
    if (row.short > 0) tdShort.className = "short-cell";
    tr.appendChild(tdCat);
    tr.appendChild(tdNeed);
    tr.appendChild(tdCovered);
    tr.appendChild(tdShort);
    tbody.appendChild(tr);
  });

  const noteLines = fit.rows.filter(function (r) { return r.short > 0; }).map(function (r) {
    return r.category + ": " + r.need + " functions, " + r.covered + " slots left after higher-priority categories — push " + r.short + " to keyboard or a second controller.";
  });
  const noteBox = document.getElementById("shortfall-notes");
  noteBox.innerHTML = "";
  if (noteLines.length === 0) {
    noteBox.appendChild(el("p", null, "Every core function on this role has a physical slot on this controller."));
  } else {
    noteLines.forEach(function (line) {
      noteBox.appendChild(el("p", null, line));
    });
  }

  renderSources(document.getElementById("controller-sources"), controller.sources);
  renderSources(document.getElementById("role-sources"), role.sources);
}

function populateSelect(select, items, nameKey) {
  select.innerHTML = "";
  items.forEach(function (item) {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item[nameKey];
    select.appendChild(opt);
  });
}

function isPro(item) {
  return item.tier === "pro";
}

function updateUnlockUI(unlocked) {
  const unlockSection = document.getElementById("unlock-section");
  const proControllers = CONTROLLERS.filter(isPro).length;
  const proRoles = ROLES.filter(isPro).length;

  if (unlocked) {
    unlockSection.innerHTML = "";
    const p = el("p", "unlock-status", "Pro unlocked — all controllers and ship roles available.");
    unlockSection.appendChild(p);
    return;
  }

  unlockSection.innerHTML = "";
  const buyP = document.createElement("p");
  const buyLink = el("a", "btn-buy", "Unlock all " + (CONTROLLERS.length) + " controllers / " + (ROLES.length) + " ship roles — $9 one time");
  buyLink.href = PRO_PAYMENT_LINK_URL;
  buyLink.target = "_blank";
  buyLink.rel = "noopener noreferrer";
  buyP.appendChild(buyLink);
  buyP.appendChild(document.createTextNode(" (adds " + proControllers + " more controllers, " + proRoles + " more ship roles)"));
  unlockSection.appendChild(buyP);

  const form = document.createElement("form");
  form.className = "license-form";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Already purchased? Paste your license key";
  input.id = "license-input";
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Activate";
  const msg = el("span", "license-msg", "");
  form.appendChild(input);
  form.appendChild(submit);
  form.appendChild(msg);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    verifyLicense(input.value).then(function (res) {
      if (res.ok) {
        storeLicense(input.value);
        refreshTierAndRender();
      } else {
        msg.textContent = res.reason;
        msg.className = "license-msg license-error";
      }
    });
  });
  unlockSection.appendChild(form);
}

let unlockedState = false;

function visibleControllers() {
  return unlockedState ? CONTROLLERS : CONTROLLERS.filter(function (c) { return !isPro(c); });
}
function visibleRoles() {
  return unlockedState ? ROLES : ROLES.filter(function (r) { return !isPro(r); });
}

function refreshTierAndRender() {
  loadStoredLicense().then(function (license) {
    unlockedState = !!license;
    updateUnlockUI(unlockedState);

    const controllerSelect = document.getElementById("controller-select");
    const roleSelect = document.getElementById("role-select");
    const prevController = controllerSelect.value;
    const prevRole = roleSelect.value;

    populateSelect(controllerSelect, visibleControllers(), "name");
    populateSelect(roleSelect, visibleRoles(), "role_name");

    controllerSelect.value = visibleControllers().some(function (c) { return c.id === prevController; })
      ? prevController : "t-flight-hotas-4";
    roleSelect.value = visibleRoles().some(function (r) { return r.id === prevRole; })
      ? prevRole : "explorer-scanner";

    const controller = CONTROLLERS.find(function (c) { return c.id === controllerSelect.value; });
    const role = ROLES.find(function (r) { return r.id === roleSelect.value; });
    renderResult(controller, role);
  });
}

function init() {
  const controllerSelect = document.getElementById("controller-select");
  const roleSelect = document.getElementById("role-select");

  function update() {
    const controller = CONTROLLERS.find(function (c) { return c.id === controllerSelect.value; });
    const role = ROLES.find(function (r) { return r.id === roleSelect.value; });
    renderResult(controller, role);
  }

  controllerSelect.addEventListener("change", update);
  roleSelect.addEventListener("change", update);

  refreshTierAndRender();
}

document.addEventListener("DOMContentLoaded", init);
