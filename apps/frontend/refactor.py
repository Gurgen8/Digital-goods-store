import os
import re

tokens_addition = """
  --color-surface-alt: #f2f4f7;
  --color-surface-hover: #e5e7eb;
  --color-surface-dark: #111111;
  --color-surface-dark-2: #0b0b0b;
  --color-surface-btn: #e4e7ec;
  --color-muted-2: #9aa1ae;
  --color-muted-3: #727b8e;
  --color-muted-4: #76829B;
  --color-text-secondary: #6B7280;
  --color-input-bg: #f1f3f5;
  --color-badge: #6EB83F;

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
  --color-accent-hover: #0F9D58;
"""

color_map = {
  "#ffffff": "var(--color-background)",
  "#fff": "var(--color-background)",
  "#f4f5f7": "var(--color-surface)",
  "#F4F5F7": "var(--color-surface)",
  "#1f2937": "var(--color-surface-2)",
  "#1F2937": "var(--color-surface-2)",
  "#14181d": "var(--color-text)",
  "#8a94a6": "var(--color-muted)",
  "#9ca3af": "var(--color-border)",
  "#000000": "var(--color-primary)",
  "#000": "var(--color-primary)",
  "#4c9a2a": "var(--color-accent)",
  "#f2f4f7": "var(--color-surface-alt)",
  "#e5e7eb": "var(--color-surface-hover)",
  "#111111": "var(--color-surface-dark)",
  "#0b0b0b": "var(--color-surface-dark-2)",
  "#e4e7ec": "var(--color-surface-btn)",
  "#9aa1ae": "var(--color-muted-2)",
  "#727b8e": "var(--color-muted-3)",
  "#76829B": "var(--color-muted-4)",
  "#6B7280": "var(--color-text-secondary)",
  "#f1f3f5": "var(--color-input-bg)",
  "#6EB83F": "var(--color-badge)",
  "#ef4444": "var(--color-error)",
  "#FF0000": "var(--color-error)",
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
  "rgba(79, 179, 90, 0.45)": "var(--color-accent-alpha-45)",
  "#0F9D58": "var(--color-accent-hover)"
}

def resolve_import(current_file, import_path):
    if not import_path.startswith("."):
        return import_path
    
    current_dir = os.path.dirname(current_file)
    abs_path = os.path.normpath(os.path.join(current_dir, import_path))
    # relative to src
    src_dir = os.path.abspath("src")
    if abs_path.startswith(src_dir):
        return "src/" + os.path.relpath(abs_path, src_dir).replace("\\", "/")
    return import_path

for root, dirs, files in os.walk("src"):
    for file in files:
        if file.endswith(".css") or file.endswith(".tsx") or file.endswith(".ts"):
            filepath = os.path.join(root, file)
            with open(filepath, "r") as f:
                content = f.read()
            
            # replace colors
            new_content = content
            for color, var in color_map.items():
                # case insensitive replacement for hex
                if color.startswith("#"):
                    new_content = re.sub(re.escape(color), var, new_content, flags=re.IGNORECASE)
                else:
                    # replace spaces optionally
                    new_content = new_content.replace(color, var)
            
            # replace imports in tsx/ts
            if file.endswith(".tsx") or file.endswith(".ts"):
                # matches import ... from "..."
                def import_replacer(m):
                    full_match = m.group(0)
                    import_path = m.group(2)
                    if import_path.startswith("../"):
                        new_path = resolve_import(filepath, import_path)
                        return full_match.replace('"' + import_path + '"', '"' + new_path + '"').replace("'" + import_path + "'", "'" + new_path + "'")
                    return full_match

                new_content = re.sub(r'(import\s+.*?(?:from\s+)?)(["\'])(.*?)\2', import_replacer, new_content)

            if new_content != content:
                with open(filepath, "w") as f:
                    f.write(new_content)

# Update tokens.css
with open("src/styles/tokens.css", "r") as f:
    tokens = f.read()
if "--color-error" not in tokens:
    tokens = tokens.replace("  --shadow-card:", tokens_addition + "\n  --shadow-card:")
    with open("src/styles/tokens.css", "w") as f:
        f.write(tokens)
print("Done")
