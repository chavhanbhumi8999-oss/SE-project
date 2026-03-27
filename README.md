# 🎓 Student Project Showcase App

A beautiful, modern web app to manage and display all your students' projects — with live links, filtering, search, and more.

---

## 🚀 How to Use

### Step 1 — Open the App
Double-click `index.html` to open it in any browser.
No server needed. No installation. Works offline.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 Add Projects | Fill the form — name, student, link, tech stack, status |
| ✏️ Edit Projects | Click any card → Edit button |
| 🗑️ Delete Projects | Click any card → Delete button |
| 🔍 Search | Search by project name, student name, tech, or roll number |
| 🏷️ Filter by Category | Sidebar or chips — Web Dev, AI/ML, Mobile, Design, etc. |
| 📊 Sort | Sort by Name, Student, Views, or Newest |
| ⊞ Grid / List View | Toggle between beautiful grid and compact list |
| 🌐 Open Live Site | Click "Open Site" to open the student's live project |
| 👁 View Counter | Tracks how many times a project link is opened |
| 📥 Export CSV | Download all project data as a CSV file |
| 💾 Auto-save | All data saved in browser localStorage — no data lost on refresh |

---

## 📁 File Structure

```
student-projects-app/
│
├── index.html    ← Main app file (open this)
├── style.css     ← All styling (dark theme, animations)
├── app.js        ← All logic (CRUD, search, filter, export)
└── README.md     ← This file
```

---

## 📝 How to Add a Project

1. Click the **"＋ Add"** button (top right) or **"＋ Add Project"** in the sidebar
2. Fill in the form:
   - **Project Name** (required)
   - **Student Name** (required)
   - **Category** (required)
   - Live Site URL (optional — the clickable link)
   - GitHub URL (optional)
   - Tech Stack — comma separated (e.g. `React, Node.js, MongoDB`)
   - Status: Live / In Progress / Completed
   - Emoji for the project icon
3. Click **Save Project**

---

## 💡 Tips

- Press **Ctrl+K** (or Cmd+K on Mac) to focus the search bar quickly
- Press **Escape** to close any open modal
- Click a project card to see full details
- The app works on **mobile** too — tap the ☰ hamburger menu to open the sidebar
- **Export CSV** downloads all project info for sharing/printing

---

## 🔧 Customization

To add your own default categories, edit the `<select id="fCategory">` dropdown in `index.html`.

To change the app title or logo, edit the `.logo` div in `index.html`.

To change colors, edit the CSS variables at the top of `style.css`:
```css
:root {
  --accent:  #6C63FF;  /* Purple - primary color */
  --accent2: #FF6584;  /* Pink */
  --accent3: #43E97B;  /* Green - Live status */
  --bg:      #0F0E17;  /* Background */
}
```

---

## 📤 Sharing with Others

Since data is stored in **localStorage**, it stays on your computer only.

To share all projects with colleagues:
1. Click **"↓ Export CSV"** in the sidebar
2. Share the CSV file

Or, to host the app online:
- Upload all 3 files to **Netlify**, **GitHub Pages**, or any web hosting
- Everyone with the link can access it (but each user will have their own localStorage)

---

Made with ❤️ for classroom use.
