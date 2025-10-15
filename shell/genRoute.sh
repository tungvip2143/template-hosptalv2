#!/bin/bash

module_name="$1"

# === Chuyển đổi các định dạng tên ===
capitalized_module_name="$(echo "${module_name:0:1}" | tr '[:lower:]' '[:upper:]')${module_name:1}"                                                # CategoryTest
UPPER_MODULE_NAME=$(echo "$module_name" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1_\2/g' | tr '[:lower:]' '[:upper:]')                                      # CATEGORY_TEST
kebab_module_name=$(echo "$module_name" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')                                       # category-test
formatted_name=$(echo "$module_name" | sed -E 's/([a-z0-9])([A-Z])/\1 \2/g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1') # Category Test

MENU_ROUTER_FILE="src/router/index.tsx"
ROUTER_CONST_FILE="src/router/components/route.ts"

# === Sử dụng import tĩnh thay vì lazy
IMPORT_LINE="const ${capitalized_module_name} = lazy(() => import(\"@src/pages/${capitalized_module_name}\"));"
ROUTE_ENTRY="              {\n                name: \"${formatted_name}\",\n                path: PUBLIC_ROUTER.${UPPER_MODULE_NAME}.LIST,\n                component: ${capitalized_module_name},\n                icon: <UnorderedListOutlined />,\n              },"

# === 1. Chèn lazy import NGAY TRƯỚC const menuRouter ===
awk -v import="$IMPORT_LINE" '
  /const menuRouter: MenuType\[\] *= *\[/ {
    print import
    print ""
    print
    next
  }
  { print }
' "$MENU_ROUTER_FILE" >"$MENU_ROUTER_FILE.tmp" && mv "$MENU_ROUTER_FILE.tmp" "$MENU_ROUTER_FILE"

# === 2. Chèn route vào children của "Danh mục" section
awk -v entry="$ROUTE_ENTRY" '
  BEGIN {
    total = 0;
    inCategorySection = 0;
    categoryChildrenStart = -1;
  }

  {
    lines[total++] = $0;
    
    # Tìm section "Danh mục"
    if ($0 ~ /name: *"Danh mục"/) {
      inCategorySection = 1;
    }
    
    # Nếu đang trong category section và gặp children, đây là target
    if (inCategorySection && $0 ~ /children: *\[/) {
      categoryChildrenStart = total - 1;
      inCategorySection = 0; # Reset để không match children khác
    }
  }

  END {
    inTarget = 0;
    bracket = 0;
    inserted = 0;

    for (i = 0; i < total; i++) {
      line = lines[i];

      if (i == categoryChildrenStart) {
        print line;
        inTarget = 1;
        bracket = 1;
        continue;
      }

      if (inTarget) {
        if (line ~ /\[/) bracket++;
        if (line ~ /\]/) bracket--;

        # Trước khi đóng ], chèn entry
        if (bracket == 0 && inserted == 0) {
          print entry;
          inserted = 1;
        }
      }

      print line;
    }
  }
' "$MENU_ROUTER_FILE" >"$MENU_ROUTER_FILE.tmp" && mv "$MENU_ROUTER_FILE.tmp" "$MENU_ROUTER_FILE"

# === 3. Thêm vào PUBLIC_ROUTER
awk -v key="${UPPER_MODULE_NAME}" -v kebab="${kebab_module_name}" '
  BEGIN { inside = 0; inserted = 0 }
  /export const PUBLIC_ROUTER *= *{/ { inside = 1 }
  inside && /^\}/ && !inserted {
    print "  " key ": {"
    print "    LIST: `" kebab "`,"
    print "  },"
    inserted = 1
  }
  { print }
' "$ROUTER_CONST_FILE" >"$ROUTER_CONST_FILE.tmp" && mv "$ROUTER_CONST_FILE.tmp" "$ROUTER_CONST_FILE"

echo "✅ Đã thêm '${formatted_name}' vào menuRouter và PUBLIC_ROUTER."
