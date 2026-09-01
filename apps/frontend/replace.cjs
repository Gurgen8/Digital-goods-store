const fs = require('fs');
const path = require('path');

const tokensAddition = `
  --color-surface-alt: #f2f4f7;
  --color-surface-hover: #e5e7eb;
  --color-surface-dark: #111111;
  --color-surface-dark-2: #0b0b0b;
  --color-surface-btn: #e4e7ec;
  --color-surface-3: #f1f2f4;
  --color-surface-4: #f3f5f9;
  --color-surface-5: #f8f9fa;
  --color-muted-2: #9aa1ae;
  --color-muted-3: #727b8e;
  --color-muted-4: #76829b;
  --color-text-secondary: #6b7280;
  --color-input-bg: #f1f3f5;
  --color-badge: #6eb83f;
  --color-error: #ef4444;
  --color-error-bg: rgba(255, 0, 0, 0.04);
  --color-error-border: rgba(255, 0, 0, 0.2);
  --color-promo-bg: rgba(38, 139, 243, 0.1);
  --color-black-alpha-06: rgba(0, 0, 0, 0.06);
  --color-black-alpha-08: rgba(0, 0, 0, 0.08);
  --color-black-alpha-10: rgba(0, 0, 0, 0.1);
  --color-black-alpha-30: rgba(0, 0, 0, 0.3);
  --color-white-alpha-10: rgba(255, 255, 255, 0.1);
  --color-white-alpha-18: rgba(255, 255, 255, 0.18);
  --color-white-alpha-20: rgba(255, 255, 255, 0.2);
  --color-white-alpha-22: rgba(255, 255, 255, 0.22);
  --color-white-alpha-35: rgba(255, 255, 255, 0.35);
  --color-white-alpha-72: rgba(255, 255, 255, 0.72);
  --color-white-alpha-95: rgba(255, 255, 255, 0.95);
  --color-accent-alpha-08: rgba(79, 179, 90, 0.08);
  --color-accent-alpha-30: rgba(79, 179, 90, 0.3);
  --color-accent-alpha-45: rgba(79, 179, 90, 0.45);
  --color-accent-hover: #0f9d58;
  --color-brand-mc-1: #eb001b;
  --color-brand-mc-2: #f79e1b;
  --color-brand-tg: #54a9ff;
  --color-brand-vk: #1a1f71;
`;

const colorMap = {
  "#ffffff": "var(--color-background)",
  "#fff": "var(--color-background)",
  "#000000": "var(--color-primary)",
  "#000": "var(--color-primary)",
  "#f4f5f7": "var(--color-surface)",
  "#1f2937": "var(--color-surface-2)",
  "#14181d": "var(--color-text)",
  "#8a94a6": "var(--color-muted)",
  "#9ca3af": "var(--color-border)",
  "#4c9a2a": "var(--color-accent)",
  "#f2f4f7": "var(--color-surface-alt)",
  "#e5e7eb": "var(--color-surface-hover)",
  "#111111": "var(--color-surface-dark)",
  "#0b0b0b": "var(--color-surface-dark-2)",
  "#e4e7ec": "var(--color-surface-btn)",
  "#f1f2f4": "var(--color-surface-3)",
  "#f3f5f9": "var(--color-surface-4)",
  "#f8f9fa": "var(--color-surface-5)",
  "#9aa1ae": "var(--color-muted-2)",
  "#727b8e": "var(--color-muted-3)",
  "#76829b": "var(--color-muted-4)",
  "#6b7280": "var(--color-text-secondary)",
  "#f1f3f5": "var(--color-input-bg)",
  "#6eb83f": "var(--color-badge)",
  "#ef4444": "var(--color-error)",
  "#ff0000": "var(--color-error)",
  "#eb001b": "var(--color-brand-mc-1)",
  "#f79e1b": "var(--color-brand-mc-2)",
  "#54a9ff": "var(--color-brand-tg)",
  "#1a1f71": "var(--color-brand-vk)",
  "#0f9d58": "var(--color-accent-hover)",
  "rgba(255, 0, 0, 0.04)": "var(--color-error-bg)",
  "rgba(255, 0, 0, 0.2)": "var(--color-error-border)",
  "rgba(38, 139, 243, 0.1)": "var(--color-promo-bg)",
  "rgba(0, 0, 0, 0.06)": "var(--color-black-alpha-06)",
  "rgba(0, 0, 0, 0.08)": "var(--color-black-alpha-08)",
  "rgba(0, 0, 0, 0.1)": "var(--color-black-alpha-10)",
  "rgba(0, 0, 0, 0.3)": "var(--color-black-alpha-30)",
  "rgba(255, 255, 255, 0.1)": "var(--color-white-alpha-10)",
  "rgba(255, 255, 255, 0.18)": "var(--color-white-alpha-18)",
  "rgba(255, 255, 255, 0.2)": "var(--color-white-alpha-20)",
  "rgba(255, 255, 255, 0.22)": "var(--color-white-alpha-22)",
  "rgba(255, 255, 255, 0.35)": "var(--color-white-alpha-35)",
  "rgba(255, 255, 255, 0.72)": "var(--color-white-alpha-72)",
  "rgba(255, 255, 255, 0.95)": "var(--color-white-alpha-95)",
  "rgba(79, 179, 90, 0.08)": "var(--color-accent-alpha-08)",
  "rgba(79, 179, 90, 0.3)": "var(--color-accent-alpha-30)",
  "rgba(79, 179, 90, 0.45)": "var(--color-accent-alpha-45)"
};

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.css') || file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;

    for (const [color, variable] of Object.entries(colorMap)) {
        if (color.startsWith('#')) {
            const regex = new RegExp(color + '\\b', 'ig');
            newContent = newContent.replace(regex, variable);
        } else {
            // escape parentheses
            const escapedColor = color.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(escapedColor, 'gi');
            newContent = newContent.replace(regex, variable);
        }
    }

    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
    }
}

let tokens = fs.readFileSync('src/styles/tokens.css', 'utf8');
if (!tokens.includes('--color-brand-mc-1')) {
    tokens = tokens.replace('  --shadow-card:', tokensAddition + '\n  --shadow-card:');
    fs.writeFileSync('src/styles/tokens.css', tokens, 'utf8');
}
console.log('Done');
