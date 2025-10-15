#!/bin/bash

module_name="$1"

# Đường dẫn thư mục
VI_LOCALE="src/locales/vi"
EN_LOCALE="src/locales/en"

# Tạo file JSON nếu chưa có
touch "$VI_LOCALE/${module_name}.json"
touch "$EN_LOCALE/${module_name}.json"

# Thêm nội dung rỗng vào file
echo "{}" >"$VI_LOCALE/${module_name}.json"
echo "{}" >"$EN_LOCALE/${module_name}.json"

# Hàm thêm dòng import và key vào object locale (macOS compatible)
append_locale() {
  locale_file="$1/index.ts"
  import_line="import $module_name from \"./${module_name}.json\";"
  locale_entry="  $module_name,"

  # Kiểm tra nếu import chưa tồn tại thì thêm vào dòng cuối import
  if ! grep -qF "$import_line" "$locale_file"; then
    last_import_line=$(grep -n "^import " "$locale_file" | tail -n1 | cut -d: -f1)
    if [ -n "$last_import_line" ]; then
      sed -i '' "${last_import_line}a\\
$import_line
" "$locale_file"
    fi
  fi

  # Thêm vào object locale nếu chưa có
  if ! grep -qF "$locale_entry" "$locale_file"; then
    sed -i '' "/const locale = {/,/};/ s/};/$locale_entry\\
};/" "$locale_file"
  fi
}

# Gọi hàm cho cả vi và en
append_locale "$VI_LOCALE"
append_locale "$EN_LOCALE"

echo "✅ Đã tạo và cập nhật thành công $module_name.json vào cả vi và en."
