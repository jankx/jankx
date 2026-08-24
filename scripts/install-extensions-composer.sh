#!/bin/bash
# Install composer dependencies for all Jankx extensions and active child themes.
# Skips extensions where vendor/ already exists.
# Usage: bash scripts/install-extensions-composer.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(dirname "$SCRIPT_DIR")"
WP_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

installed=0
skipped=0
failed=0

install_extension() {
    local dir="$1"
    local name
    name="$(basename "$dir")"

    if [ ! -f "$dir/composer.json" ]; then
        return
    fi

    if [ -d "$dir/vendor" ]; then
        echo -e "${YELLOW}[skip]${NC} $name (vendor/ exists)"
        skipped=$((skipped + 1))
        return
    fi

    echo -e "${GREEN}[install]${NC} $name ..."
    if (cd "$dir" && composer install --prefer-dist --no-dev --no-interaction 2>&1); then
        installed=$((installed + 1))
    else
        echo -e "${RED}[failed]${NC} $name"
        failed=$((failed + 1))
    fi
}

# --- Parent theme extensions ---
echo "=== Parent theme: jankx ==="
if [ -d "$THEME_DIR/extensions" ]; then
    for ext_dir in "$THEME_DIR"/extensions/*/; do
        [ -d "$ext_dir" ] || continue
        install_extension "${ext_dir%/}"
    done
fi

# --- Child themes (Template: jankx) ---
THEMES_DIR="$WP_ROOT/wp-content/themes"
for child_dir in "$THEMES_DIR"/*/; do
    [ -d "$child_dir" ] || continue
    child_dir="${child_dir%/}"

    # Skip the parent theme itself
    [ "$child_dir" = "$THEME_DIR" ] && continue

    # Check if it's a jankx child theme:
    #  - style.css with "Template: jankx", OR
    #  - has extensions/ directory (even without style.css/functions.php)
    is_child=false
    if [ -f "$child_dir/style.css" ] && grep -q "Template: jankx" "$child_dir/style.css" 2>/dev/null; then
        is_child=true
    elif [ -d "$child_dir/extensions" ]; then
        is_child=true
    fi

    if [ "$is_child" = true ]; then
        child_name="$(basename "$child_dir")"
        echo ""
        echo "=== Child theme: $child_name ==="
        if [ -d "$child_dir/extensions" ]; then
            for ext_dir in "$child_dir"/extensions/*/; do
                [ -d "$ext_dir" ] || continue
                install_extension "${ext_dir%/}"
            done
        else
            echo "(no extensions/ directory)"
        fi
    fi
done

# --- Summary ---
echo ""
echo "==============================="
echo -e "Installed: ${GREEN}${installed}${NC}"
echo -e "Skipped:   ${YELLOW}${skipped}${NC}"
echo -e "Failed:    ${RED}${failed}${NC}"
echo "==============================="

exit $failed
