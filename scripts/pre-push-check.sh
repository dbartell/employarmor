#!/bin/bash
# Pre-push check for EmployArmor — catches common build errors without running full Next.js build
# Usage: ./scripts/pre-push-check.sh

set -e
cd "$(dirname "$0")/.."

echo "🔍 Running pre-push checks..."

# 1. Import check
echo ""
echo "1️⃣  Checking imports..."
python3 << 'PYEOF'
import os, re, glob
src = "src"
files = glob.glob(f"{src}/**/*.ts", recursive=True) + glob.glob(f"{src}/**/*.tsx", recursive=True)
exports_map = {}
for f in files:
    with open(f) as fh:
        content = fh.read()
    named = set()
    for m in re.finditer(r'export\s+(?:const|let|var|function|class|interface|type|enum|async\s+function)\s+(\w+)', content):
        named.add(m.group(1))
    for m in re.finditer(r'export\s*\{([^}]+)\}', content):
        for name in m.group(1).split(','):
            name = name.strip().split(' as ')[0].strip()
            if name: named.add(name)
    exports_map[f] = named

def resolve_import(imp_path, from_file):
    if imp_path.startswith("@/"): imp_path = imp_path.replace("@/", src + "/", 1)
    elif imp_path.startswith("."): imp_path = os.path.normpath(os.path.join(os.path.dirname(from_file), imp_path))
    else: return None
    for ext in ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]:
        if imp_path + ext in exports_map: return imp_path + ext
    return None

errors = []
for f in files:
    with open(f) as fh:
        lines = fh.readlines()
    for i, line in enumerate(lines):
        m = re.match(r'import\s+\{([^}]+)\}\s+from\s+["\']([^"\']+)["\']', line)
        if m:
            names = [n.strip().split(' as ')[0].strip() for n in m.group(1).split(',')]
            resolved = resolve_import(m.group(2), f)
            if resolved and resolved in exports_map:
                for name in names:
                    if name and name.replace('type ','') not in exports_map[resolved]:
                        errors.append(f"{f}:{i+1} — '{name}' not in {m.group(2)}")
if errors:
    for e in errors: print(f"  ❌ {e}")
    print(f"\n  {len(errors)} broken import(s) found!")
    exit(1)
else:
    print("  ✅ All imports clean")
PYEOF

# 2. Brace balance on key files
echo ""
echo "2️⃣  Checking brace balance..."
python3 << 'PYEOF'
import glob
errors = []
for f in glob.glob("src/**/*.ts", recursive=True) + glob.glob("src/**/*.tsx", recursive=True):
    with open(f) as fh:
        content = fh.read()
    depth = sum(1 if c=='{' else -1 if c=='}' else 0 for c in content)
    if depth != 0:
        errors.append(f"  ❌ {f}: off by {depth}")
if errors:
    for e in errors: print(e)
    exit(1)
else:
    print("  ✅ All braces balanced")
PYEOF

# 3. Check for old brand names
echo ""
echo "3️⃣  Checking for old brand names..."
OLD_NAMES=$(grep -rn "AIHireLaw\|aihirelaw\|AI Hire Law\|HireShield\|hireshield" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "// EmployArmor" | head -5)
if [ -n "$OLD_NAMES" ]; then
    echo "  ❌ Old brand names found:"
    echo "$OLD_NAMES"
    exit 1
else
    echo "  ✅ No old brand names"
fi

echo ""
echo "✅ All pre-push checks passed!"
