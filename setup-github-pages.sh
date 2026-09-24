#!/usr/bin/env bash
# Oppretter repo på din GitHub-konto og aktiverer GitHub Pages.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

GH_BIN="$ROOT/.tools/gh"
if [[ ! -x "$GH_BIN" ]]; then
  echo "Laster ned GitHub CLI…"
  mkdir -p "$ROOT/.tools"
  VER=2.67.0
  ARCH=macOS_arm64
  TMP="$(mktemp -d)"
  curl -sL "https://github.com/cli/cli/releases/download/v${VER}/gh_${VER}_${ARCH}.zip" -o "$TMP/gh.zip"
  unzip -qo "$TMP/gh.zip" -d "$TMP"
  cp "$TMP/gh_${VER}_${ARCH}/bin/gh" "$GH_BIN"
  chmod +x "$GH_BIN"
  rm -rf "$TMP"
fi

if ! "$GH_BIN" auth status >/dev/null 2>&1; then
  echo "Logg inn på GitHub (nettleser åpnes)…"
  "$GH_BIN" auth login --hostname github.com --git-protocol https --web
fi

USER="$("$GH_BIN" api user -q .login)"
REPO_NAME="${1:-aktiv-i-barnehagen-wireframe}"

echo "Bruker: $USER"
echo "Repo:   $USER/$REPO_NAME"

if [[ -d .git && ! -f .git/HEAD ]]; then
  echo "Fjerner ødelagt .git-mappe…"
  rm -rf .git
fi

if [[ ! -d .git ]]; then
  git init -b main
fi

if [[ ! -f .git/HEAD ]]; then
  echo "Kunne ikke opprette git-repo. Kjør manuelt: rm -rf .git && git init -b main"
  exit 1
fi

grep -q '^\.tools/' .gitignore 2>/dev/null || printf '%s\n' '.tools/' '.DS_Store' >> .gitignore

git add -A
if git diff --cached --quiet 2>/dev/null && git rev-parse HEAD >/dev/null 2>&1; then
  echo "Ingen nye endringer å committe."
else
  git commit -m "Initial commit: Aktiv i barnehagen 2.0 wireframe" || true
fi

if "$GH_BIN" repo view "$USER/$REPO_NAME" >/dev/null 2>&1; then
  echo "Repo finnes allerede — pusher…"
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$USER/$REPO_NAME.git"
  git push -u origin main
else
  "$GH_BIN" repo create "$REPO_NAME" --public --source=. --remote=origin --push \
    --description "Wireframe-prototype: Aktiv i barnehagen 2.0"
fi

# Aktiver GitHub Pages fra main / root
"$GH_BIN" api -X POST "repos/$USER/$REPO_NAME/pages" \
  -f "build_type=legacy" \
  -f "source[branch]=main" \
  -f "source[path]=/" \
  2>/dev/null || \
"$GH_BIN" api -X PUT "repos/$USER/$REPO_NAME/pages" \
  -f "build_type=legacy" \
  -f "source[branch]=main" \
  -f "source[path]=/" \
  2>/dev/null || true

# Fallback: GitHub UI settings via API (newer)
"$GH_BIN" api -X PUT "repos/$USER/$REPO_NAME/pages" \
  --input - <<EOF 2>/dev/null || true
{"build_type":"legacy","source":{"branch":"main","path":"/"}}
EOF

echo ""
echo "Ferdig. Sider kan ta 1–2 minutter."
echo "Repo:  https://github.com/$USER/$REPO_NAME"
echo "Pages: https://$USER.github.io/$REPO_NAME/"
echo ""
echo "Hvis Pages ikke er aktiv ennå: Settings → Pages → Branch: main / root → Save"
