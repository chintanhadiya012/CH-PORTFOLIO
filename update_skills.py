import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'(class="progress-fill[^"]*")\s+style="width:\s*([^"]+)"', r'\1 style="width: 0%;" data-width="\2"', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
