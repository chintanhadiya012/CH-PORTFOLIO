import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define project data
projects = [
    {
        "id": "p-card-schemedekho",
        "title": "SchemeDekho",
        "desc": "A smart portal to check eligibility for government schemes dynamically using Python Flask backend and demographic filters.",
        "tags": "Python (Flask) &bull; HTML/CSS &bull; Decision Trees",
        "dur": "2 Months",
        "img": "https://placehold.co/600x400/1a1a2e/06b6d4?text=SchemeDekho",
        "cat": "WEB APPLICATION"
    },
    {
        "id": "p-card-portfolio",
        "title": "Portfolio Website",
        "desc": "A high-performance personal engineering portfolio featuring interactive Three.js 3D background canvas, live GitHub integration, ATS Resume Analyzer, and a simulated terminal console.",
        "tags": "JavaScript &bull; Three.js &bull; HTML/CSS &bull; Flask API",
        "dur": "1 Month",
        "img": "https://placehold.co/600x400/1a1a2e/8b5cf6?text=3D+Portfolio",
        "cat": "3D WEB PORTFOLIO"
    }
]

for p in projects:
    regex = r'(<div class="project-card-item[^"]*"[^>]*id="' + p['id'] + r'">).*?(</div>\s*</div>)'
    
    new_html = f'''\\1
                        <div class="project-image-slot" style="padding: 0;">
                            <img src="{p['img']}" alt="{p['title']}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: opacity 0.3s;">
                            <div class="project-label font-code" style="z-index: 2;">{p['cat']}</div>
                        </div>
                        <div class="project-content-slot">
                            <h3 class="project-card-title">{p['title']}</h3>
                            <p class="project-card-summary">{p['desc']}<br><br><span class="font-code text-cyan" style="font-size: 11px;">Duration: {p['dur']}</span></p>
                            <p class="font-code text-muted" style="font-size: 12px; margin-bottom: 20px;">{p['tags']}</p>
                            <div style="display: flex; gap: 10px; margin-top: auto;">
                                <a href="#" class="btn btn-primary btn-sm" style="flex: 1; text-align: center; padding: 8px;">Live Demo</a>
                                <a href="#" class="btn btn-secondary-outline btn-sm" style="flex: 1; text-align: center; padding: 8px;">GitHub</a>
                            </div>
                        </div>
                    </div>'''
    content = re.sub(regex, new_html, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated project cards")
