# 🚀 Chintan Hadiya | Interactive Portfolio & Web Applications System

An interactive, high-performance personal engineering portfolio platform featuring hardware-accelerated , live GitHub REST API integration, an interactive PowerShell terminal console, an integrated ATS Resume Analyzer, and a Python Flask backend.

---

 👤 About the Developer

- Name: Chintan Hadiya
- Degree: Bachelor of Technology (B.Tech) in Computer Engineering (2024 – 2028)
- Institution: IAR University
- Specialization: Cybersecurity & Network Systems
- GitHub: [@chintanhadiya012](https://github.com/chintanhadiya012)
- Contact Email: [chintanhadiya83@gmail.com](mailto:chintanhadiya83@gmail.com)
- Phone: +91 9725751439

---

✨ Key Features & System Modules

### 🌐 1. Hardware-Accelerated 3D Canvas
- Built with **Three.js** and WebGL.
- Features a dynamic particle mesh network with camera mouse-follow interaction, dynamic depth of field, and smooth frame rendering.

### 🎨 2. Premium Dark Glassmorphism Design System
- Engineered using pure **Vanilla CSS3** (zero external utility framework dependence like TailwindCSS).
- Integrated glowing HSL color palettes (Cyan, Purple, Pink, Orange accents), custom glowing cursor trails, micro-animations, and dynamic scroll reveal triggers.

### 🐙 3. Live GitHub API Integration
- Connects asynchronously to the official GitHub REST API endpoint (`https://api.github.com/users/chintanhadiya012`).
- Dynamically displays live profile statistics (public repository count, followers, avatar) and automatically populates live public repository cards with star counts, fork counts, and primary language tags.

### 💻 4. Interactive PowerShell Console Terminal
- Built-in interactive command shell allowing visitors to type system commands directly.
- **Available Commands**:
  - `help`: Lists all executable commands.
  - `skills`: Displays interactive progress bars for technical stacks.
  - `education`: Outputs academic background and Cybersecurity specialization metadata.
  - `projects`: Lists active project repositories.
  - `contact`: Outputs email and profile details.
  - `matrix`: Triggers a full-screen digital rain matrix animation overlay.
  - `analyze`: Runs a simulated ATS resume evaluation pass.
  - `clear`: Clears terminal buffer screens.

### 📄 5. ATS Resume Analyzer Engine (`analyzer.html`)
- Dedicated sub-application providing automated resume scoring against key engineering competencies.
- Evaluates candidate profiles across programming, web application engineering, graphic design, and system architecture.

### 🐍 6. Python Flask Backend (`app.py`)
- Python Flask application serving static assets and providing a `/api/contact` POST endpoint for email communications via SMTP.

---

## 📁 Repository Directory Structure

```
CH PORTFOLIO/
├── index.html           # Main 3D portfolio single-page application
├── style.css            # Comprehensive Vanilla CSS design system & tokens
├── script.js            # Core JavaScript engine (Three.js, Terminal, GitHub API, Modals)
├── analyzer.html        # Quantum ATS Resume Analyzer page
├── analyzer.css         # Styling for the ATS Analyzer module
├── analyzer.js          # Logic & score computation for the ATS Analyzer
├── app.py               # Python Flask web server & SMTP contact API
├── update_projects.py   # Python helper script for updating project card definitions
├── update_skills.py     # Python helper script for updating skill progress definitions
├── ch_resume.pdf        # Downloadable PDF resume document
├── profile.jpg          # Profile avatar media asset
└── scheme_dekho/        # Source directory for SchemeDekho project capstone
```

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism), JavaScript (ES6+), Three.js (r128), Vanilla Tilt, Lucide Icons.
- **Backend**: Python 3, Flask.
- **APIs**: GitHub REST API v3, SMTP Gmail Gateway.

---

## 🚦 Getting Started

### Option 1: Run via Python Flask Server (Recommended)

1. **Install Dependencies**:
   ```bash
   pip install flask
   ```

2. **Launch Server**:
   ```bash
   python app.py
   ```

3. **Open in Browser**:
   Navigate to `http://127.0.0.1:5000/` in your browser.

---

### Option 2: Static Opening

Simply double click `index.html` or open it directly in any modern browser.



