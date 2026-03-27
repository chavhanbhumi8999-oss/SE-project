    // =========================================================
//  STUDENT PROJECT SHOWCASE — app.js
//  Features: Add/Edit/Delete, Search, Filter, Sort,
//            Grid/List view, Live links, LocalStorage,
//            Export CSV, Toast notifications
// =========================================================

// ---- DEFAULT SAMPLE DATA ----
const SAMPLE_PROJECTS = [
  {
    id: 1, name: "ShopEasy — E-Commerce", student: "Rahul Sharma",
    roll: "01", category: "Web Dev", desc: "A full-featured e-commerce platform with cart, payments and admin dashboard.",
    url: "https://example.com", github: "https://github.com",
    tech: ["React", "Node.js", "MongoDB"], status: "Live",
    emoji: "🛒", views: 142, createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 2, name: "ChatBot AI Assistant", student: "Priya Patel",
    roll: "02", category: "AI / ML", desc: "An intelligent chatbot powered by NLP and machine learning models.",
    url: "https://example.com", github: "https://github.com",
    tech: ["Python", "ML", "Flask"], status: "In Progress",
    emoji: "🤖", views: 98, createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 3, name: "FitTrack — Health App", student: "Ankit Kumar",
    roll: "03", category: "Mobile App", desc: "Mobile health tracker with workout plans, BMI calculator and nutrition log.",
    url: "https://example.com", github: "https://github.com",
    tech: ["Flutter", "Firebase"], status: "Live",
    emoji: "📱", views: 76, createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 4, name: "DataViz Dashboard", student: "Sneha Joshi",
    roll: "04", category: "Data Science", desc: "Interactive dashboard for visualizing complex datasets using D3.js.",
    url: "https://example.com", github: "https://github.com",
    tech: ["D3.js", "Python", "Pandas"], status: "Completed",
    emoji: "📊", views: 55, createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 5, name: "Portfolio Generator", student: "Meera Singh",
    roll: "05", category: "Design", desc: "Auto-generate beautiful portfolios from a simple JSON config file.",
    url: "https://example.com", github: "https://github.com",
    tech: ["Next.js", "Tailwind"], status: "Live",
    emoji: "🎨", views: 210, createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 6, name: "SecureVault App", student: "Rohan Das",
    roll: "06", category: "Web Dev", desc: "Blockchain-based secure document storage and verification platform.",
    url: "https://example.com", github: "https://github.com",
    tech: ["Blockchain", "Web3", "Solidity"], status: "In Progress",
    emoji: "🔐", views: 33, createdAt: Date.now()
  },
];

// ---- STATE ----
let projects = [];
let editingId = null;
let currentFilter = "all";
let searchQuery = "";
let sortMode = "name";
let isListView = false;

// ---- INIT ----
function init() {
  const saved = localStorage.getItem("showcase_projects");
  projects = saved ? JSON.parse(saved) : [...SAMPLE_PROJECTS];
  renderStats();
  renderChips();
  renderProjects();
  bindEvents();
}

function save() {
  localStorage.setItem("showcase_projects", JSON.stringify(projects));
}

// ---- STATS ----
function renderStats() {
  const totalProjects = projects.length;
  const liveCount = projects.filter(p => p.status === "Live").length;
  const students = new Set(projects.map(p => p.student)).size;
  const cats = new Set(projects.map(p => p.category)).size;

  document.getElementById("statsRow").innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total Projects</div>
      <div class="stat-value purple">${totalProjects}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Live Sites</div>
      <div class="stat-value green">${liveCount}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Students</div>
      <div class="stat-value amber">${students}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Categories</div>
      <div class="stat-value pink">${cats}</div>
    </div>
  `;
}

// ---- CHIPS ----
function renderChips() {
  const cats = ["all", ...new Set(projects.map(p => p.category))];
  document.getElementById("chipContainer").innerHTML = cats.map(c => `
    <button class="chip${c === currentFilter ? " active" : ""}" data-cat="${c}">
      ${c === "all" ? "All" : c}
    </button>
  `).join("");

  document.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.cat;
      renderChips();
      renderProjects();
      // sync sidebar
      document.querySelectorAll(".nav-item").forEach(n => {
        n.classList.toggle("active",
          (n.dataset.filter || "") === currentFilter ||
          (currentFilter === "all" && n.dataset.filter === "all")
        );
      });
    });
  });
}

// ---- COLOR MAPPING ----
const CAT_COLORS = {
  "Web Dev": 0, "AI / ML": 1, "Mobile App": 2,
  "Data Science": 3, "Design": 4, "Blockchain": 5, "Other": 6
};
const TAG_CLASSES = ["", "t1", "t2", "t3", "t1", "t2", "t3"];

function thumbClass(cat) {
  return `thumb-c${CAT_COLORS[cat] ?? 6}`;
}

function statusBadge(status) {
  if (status === "Live")
    return `<span class="status-badge status-live"><span class="live-dot"></span> Live</span>`;
  if (status === "In Progress")
    return `<span class="status-badge status-progress">⏳ In Progress</span>`;
  return `<span class="status-badge status-completed">✓ Completed</span>`;
}

// ---- RENDER PROJECTS ----
function renderProjects() {
  let list = [...projects];

  // filter
  if (currentFilter !== "all")
    list = list.filter(p => p.category === currentFilter);

  // search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.student.toLowerCase().includes(q) ||
      (p.tech || []).some(t => t.toLowerCase().includes(q)) ||
      (p.roll || "").includes(q)
    );
  }

  // sort
  if (sortMode === "name") list.sort((a,b) => a.name.localeCompare(b.name));
  else if (sortMode === "student") list.sort((a,b) => a.student.localeCompare(b.student));
  else if (sortMode === "views") list.sort((a,b) => (b.views||0) - (a.views||0));
  else if (sortMode === "newest") list.sort((a,b) => b.createdAt - a.createdAt);

  const grid = document.getElementById("projectGrid");
  const empty = document.getElementById("emptyState");

  if (list.length === 0) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  grid.innerHTML = list.map((p, i) => {
    const tClass = thumbClass(p.category);
    const tags = (p.tech || []).slice(0, 3).map((t, ti) =>
      `<span class="tag ${TAG_CLASSES[ti % 7]}">${t}</span>`
    ).join("");

    // List view simplified
    if (isListView) {
      return `
        <div class="project-card" data-id="${p.id}" style="animation-delay:${i*0.04}s">
          <div class="card-thumb ${tClass}">${p.emoji || "📁"}</div>
          <div class="card-body">
            <div>
              <div class="card-name">${p.name}</div>
              <div class="card-student">${p.student} · Roll ${p.roll || "—"}</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
              ${statusBadge(p.status)}
              <a class="open-btn" href="${p.url || "#"}" target="_blank" onclick="incrementViews(event,${p.id})">Open ↗</a>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="project-card" data-id="${p.id}" style="animation-delay:${i*0.04}s">
        <div class="card-thumb ${tClass}">
          ${p.emoji || "📁"}
          ${statusBadge(p.status)}
        </div>
        <div class="card-body">
          <div class="card-name">${p.name}</div>
          <div class="card-student">${p.student} · Roll ${p.roll || "—"}</div>
          <div class="card-tags">${tags}</div>
          <div class="card-footer">
            <a class="open-btn" href="${p.url || "#"}" target="_blank" onclick="incrementViews(event,${p.id})">Open Site ↗</a>
            <span class="card-views">👁 ${p.views || 0}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // card click → detail
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("open-btn") || e.target.closest(".open-btn")) return;
      openDetail(parseInt(card.dataset.id));
    });
  });
}

// ---- VIEW COUNTER ----
function incrementViews(event, id) {
  event.stopPropagation();
  const p = projects.find(x => x.id === id);
  if (p) { p.views = (p.views || 0) + 1; save(); renderProjects(); }
}
window.incrementViews = incrementViews;

// ---- DETAIL MODAL ----
function openDetail(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;

  document.getElementById("detailTitle").textContent = p.name;
  document.getElementById("detailBody").innerHTML = `
    <div class="detail-hero">
      <div class="detail-icon">${p.emoji || "📁"}</div>
      <div>
        <div class="detail-name">${p.name}</div>
        <div class="detail-student">${p.student} · Roll ${p.roll || "—"} · ${p.category}</div>
      </div>
    </div>
    ${row("Description", p.desc || "—")}
    ${row("Tech Stack", (p.tech || []).join(", ") || "—")}
    ${row("Status", p.status)}
    ${row("Live Site", p.url ? `<a class="detail-link" href="${p.url}" target="_blank">${p.url}</a>` : "—")}
    ${row("GitHub", p.github ? `<a class="detail-link" href="${p.github}" target="_blank">${p.github}</a>` : "—")}
    ${row("Views", p.views || 0)}
  `;

  const openLink = document.getElementById("detailOpenLink");
  if (p.url) { openLink.href = p.url; openLink.style.display = "inline-flex"; }
  else openLink.style.display = "none";

  document.getElementById("detailEditBtn").onclick = () => {
    closeDetailModal();
    openModal(p.id);
  };
  document.getElementById("detailDeleteBtn").onclick = () => {
    if (confirm(`Delete "${p.name}"?`)) {
      projects = projects.filter(x => x.id !== p.id);
      save(); renderStats(); renderChips(); renderProjects();
      closeDetailModal();
      showToast("Project deleted.");
    }
  };

  document.getElementById("detailOverlay").classList.add("open");
}

function row(label, value) {
  return `<div class="detail-row"><span class="detail-row-label">${label}</span><span>${value}</span></div>`;
}

function closeDetailModal() {
  document.getElementById("detailOverlay").classList.remove("open");
}

// ---- ADD / EDIT MODAL ----
function openModal(id = null) {
  editingId = id;
  const modal = document.getElementById("modalOverlay");
  document.getElementById("modalTitle").textContent = id ? "Edit Project" : "Add New Project";

  if (id) {
    const p = projects.find(x => x.id === id);
    document.getElementById("fName").value = p.name;
    document.getElementById("fStudent").value = p.student;
    document.getElementById("fRoll").value = p.roll || "";
    document.getElementById("fCategory").value = p.category;
    document.getElementById("fDesc").value = p.desc || "";
    document.getElementById("fUrl").value = p.url || "";
    document.getElementById("fGithub").value = p.github || "";
    document.getElementById("fTech").value = (p.tech || []).join(", ");
    document.getElementById("fStatus").value = p.status || "Live";
    document.getElementById("fEmoji").value = p.emoji || "";
  } else {
    ["fName","fStudent","fRoll","fDesc","fUrl","fGithub","fTech","fEmoji"].forEach(f =>
      document.getElementById(f).value = ""
    );
    document.getElementById("fCategory").value = "";
    document.getElementById("fStatus").value = "Live";
  }

  modal.classList.add("open");
  document.getElementById("fName").focus();
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  editingId = null;
}

function saveProject() {
  const name = document.getElementById("fName").value.trim();
  const student = document.getElementById("fStudent").value.trim();
  const category = document.getElementById("fCategory").value;

  if (!name || !student || !category) {
    showToast("Please fill required fields (Name, Student, Category).", true);
    return;
  }

  const data = {
    name,
    student,
    roll: document.getElementById("fRoll").value.trim(),
    category,
    desc: document.getElementById("fDesc").value.trim(),
    url: document.getElementById("fUrl").value.trim(),
    github: document.getElementById("fGithub").value.trim(),
    tech: document.getElementById("fTech").value.split(",").map(t => t.trim()).filter(Boolean),
    status: document.getElementById("fStatus").value,
    emoji: document.getElementById("fEmoji").value.trim() || "📁",
  };

  if (editingId) {
    const idx = projects.findIndex(x => x.id === editingId);
    projects[idx] = { ...projects[idx], ...data };
    showToast("Project updated!");
  } else {
    const newProject = {
      id: Date.now(),
      views: 0,
      createdAt: Date.now(),
      ...data
    };
    projects.unshift(newProject);
    showToast("Project added!");
  }

  save();
  renderStats();
  renderChips();
  renderProjects();
  closeModal();
}

// ---- EXPORT CSV ----
function exportCSV() {
  const headers = ["Name","Student","Roll","Category","Tech Stack","Status","Site URL","GitHub","Views"];
  const rows = projects.map(p => [
    `"${p.name}"`, `"${p.student}"`, p.roll || "",
    p.category, `"${(p.tech||[]).join(", ")}"`,
    p.status, p.url || "", p.github || "", p.views || 0
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "student_projects.csv";
  a.click();
  showToast("CSV exported!");
}

// ---- TOAST ----
function showToast(msg, isError = false) {
  const t = document.createElement("div");
  t.className = "toast" + (isError ? " error" : "");
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ---- BIND EVENTS ----
function bindEvents() {
  // Add buttons
  document.getElementById("addProjectBtn").addEventListener("click", () => openModal());
  document.getElementById("addProjectBtnTop").addEventListener("click", () => openModal());

  // Save / Cancel modal
  document.getElementById("saveBtn").addEventListener("click", saveProject);
  document.getElementById("cancelBtn").addEventListener("click", closeModal);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", e => {
    if (e.target === document.getElementById("modalOverlay")) closeModal();
  });

  // Detail modal close
  document.getElementById("detailClose").addEventListener("click", closeDetailModal);
  document.getElementById("detailOverlay").addEventListener("click", e => {
    if (e.target === document.getElementById("detailOverlay")) closeDetailModal();
  });

  // Search
  document.getElementById("searchInput").addEventListener("input", e => {
    searchQuery = e.target.value;
    renderProjects();
  });

  // Sort
  document.getElementById("sortSelect").addEventListener("change", e => {
    sortMode = e.target.value;
    renderProjects();
  });

  // View toggle
  document.getElementById("gridViewBtn").addEventListener("click", () => {
    isListView = false;
    document.getElementById("projectGrid").classList.remove("list-view");
    document.getElementById("gridViewBtn").classList.add("active");
    document.getElementById("listViewBtn").classList.remove("active");
    renderProjects();
  });
  document.getElementById("listViewBtn").addEventListener("click", () => {
    isListView = true;
    document.getElementById("projectGrid").classList.add("list-view");
    document.getElementById("listViewBtn").classList.add("active");
    document.getElementById("gridViewBtn").classList.remove("active");
    renderProjects();
  });

  // Sidebar nav filter
  document.querySelectorAll(".nav-item[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll(".nav-item[data-filter]").forEach(n => n.classList.remove("active"));
      btn.classList.add("active");
      renderChips();
      renderProjects();
      // close sidebar on mobile
      document.getElementById("sidebar").classList.remove("open");
    });
  });

  // Export
  document.getElementById("exportBtn").addEventListener("click", exportCSV);

  // Hamburger / mobile sidebar
  document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });
  document.getElementById("sidebarClose").addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("open");
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal();
      closeDetailModal();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      document.getElementById("searchInput").focus();
    }
  });
}

// ---- START ----
init();
