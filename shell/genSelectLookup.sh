#!/bin/bash

module_name="$1"

# Viết hoa chữ cái đầu (PascalCase)
capitalized_module_name="$(echo "${module_name:0:1}" | tr '[:lower:]' '[:upper:]')${module_name:1}"
component_name="Select${capitalized_module_name}"
component_dir="src/components/CommonSelects"
MODULE_DIR="src/modules/$module_name"
HOOKS_DIR="$MODULE_DIR/hooks"
component_file="$component_dir/${component_name}.tsx"
index_file="$component_dir/index.ts"

# Tạo thư mục nếu chưa tồn tại
mkdir -p "$component_dir"

# Tạo file component
cat >"$component_file" <<EOF
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useController } from "react-hook-form";
import debounce from "lodash/debounce";
import { useInfinite${capitalized_module_name} } from "@src/modules/${module_name}/hooks/useInfinite${capitalized_module_name}";
import { useAfterOnChange } from "./hooks/useAfterOnChange";
import { InitialFiltersSearch, useFiltersHandler } from "@pnkx-lib/core";
import { IFilters${capitalized_module_name} } from "@src/pages/${capitalized_module_name}";
import { SelectOption } from "@src/types/common";

import {
  PnkxField,
  Select,
  SelectFieldProps,
  START_PAGE,
  START_PAGE_SIZE,
  TypeStatusTable,
} from "@pnkx-lib/ui";
import { Control } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { DEFAULT_NUMBER } from "@src/constants/common";

type IFilter = InitialFiltersSearch<IFilters${capitalized_module_name}>;

interface Props extends Omit<SelectFieldProps, "label"> {
  control: Control<any, any>;
  name: string;
  label?: string | boolean;
  placeholder?: string;
  filtersCondition?: Partial<IFilter>;
  classNameContainer?: string;
  isFullWidth?: boolean;
  defaultValue?: SelectOption;
  showName?: boolean;
  afterOnChange?: (value: any) => void;
}

const ${component_name} = (props: Props) => {
  const { t: trans } = useTranslation();

  const {
    control,
    name,
    label = trans("category:${module_name}"),
    placeholder = trans("action:select", { name: "category:${module_name}" }).toLowerCase(),
    filtersCondition,
    classNameContainer,
    isFullWidth,
    defaultValue,
    showName,
    mode,
    afterOnChange,
    ...restProps
  } = props;

  const {
    formState: { isDirty },
  } = useController({
    control,
    name,
  });

  //! Filters
  const initialFilters: IFilter = {
    page: START_PAGE,
    size: START_PAGE_SIZE,
    status: TypeStatusTable.ACTIVE,
  };

  const finalFilters = useMemo(() => {
    return {
      ...initialFilters,
      ...filtersCondition,
    };
  }, [filtersCondition]);

  const { filters, handleSearch, resetToInitialFilters } =
    useFiltersHandler<IFilters${capitalized_module_name}>(finalFilters);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfinite${capitalized_module_name}(filters);
    
  //! Functions
  const formattedOptions = useMemo(() => {
    const flatItems = data?.pages.flatMap((page) => page.items) || [];

    const options = flatItems.map((item) => ({
      // Update field names according to your module structure
      label: showName
        ? \`\${(item as any).name || trans("common:unknown")}\`
        : \`\${(item as any).code || "?"} - \${(item as any).name || trans("common:unknown")}\`,
      value: (item as any).id,
    }));

    if (defaultValue && !filters.keyword && !isDirty) {
      const defaultValueArray = Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue];
      // Tối ưu: Sử dụng Set để tăng hiệu suất lookup
      const existingValues = new Set(options.map(opt => opt.value));
      const missingDefaults = defaultValueArray.filter(
        (defaultOpt) => !existingValues.has(defaultOpt?.value)
      );

      if (missingDefaults.length > 0) {
        return [...missingDefaults, ...options];
      }
    }

    return options;
  }, [data, showName, trans, defaultValue, filters?.keyword, isDirty]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      if (
        target.scrollTop + target.offsetHeight >= target.scrollHeight - 20 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  const debounceSearch = useRef(
    debounce((value?: string) => {
      handleSearch({ ...filters, keyword: value ? value : undefined });
    }, DEFAULT_NUMBER.TIMEOUT_DEBOUNCE)
  ).current;

  const handleSearchInput = useCallback(
    (value: string) => {
      debounceSearch(value);
    },
    [debounceSearch]
  );

  const handleClear = useCallback(() => {
    debounceSearch(undefined);
  }, [debounceSearch]);

  const handleAfterOnChange = useAfterOnChange({
    mode,
    afterOnChange,
    formattedOptions,
  });

  //! useEffect
  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, []);

  return (
    <PnkxField
      control={control}
      name={name}
      component={Select}
      showSearch
      label={label as string}
      placeholder={placeholder}
      filterOption={false}
      onSearch={handleSearchInput}
      onClear={handleClear}
      loading={isLoading}
      onPopupScroll={handleScroll}
      onBlur={resetToInitialFilters}
      mode={mode}
      options={formattedOptions}
      popupMatchSelectWidth
      classNameContainer={twMerge(
        isFullWidth
          ? "full-width-select-common-container"
          : "not-full-width-select-common-container",
        classNameContainer
      )}
      allowClear
      afterOnChange={handleAfterOnChange}
      {...restProps}
    />
  );
};

export default ${component_name};
EOF

echo "✅ Đã tạo file: $component_file"

cat >"$HOOKS_DIR/useInfinite${capitalized_module_name}.ts" <<EOF
import { useInfiniteQuery } from "@tanstack/react-query";
import { InitialFiltersSearch } from "@pnkx-lib/core";
import { IFilters${capitalized_module_name} } from "@src/pages/${capitalized_module_name}";
import ${capitalized_module_name}Service from "../${module_name}Service";
import cachedKeys from "@src/constants/cachedKeys";
import { cloneDeep } from "lodash";
import { TypeStatusTable } from "@pnkx-lib/ui";
import { RequestGetListI${capitalized_module_name} } from "../${module_name}.interface";

type TFilters = InitialFiltersSearch<IFilters${capitalized_module_name}>;

const parseFilters = (filters: TFilters): RequestGetListI${capitalized_module_name} => {
  return cloneDeep({
    ...filters,
    keyword: filters?.keyword?.trim() || undefined,
    status:
      filters?.status === TypeStatusTable.ALL ? undefined : filters?.status,
  });
};

export const useInfinite${capitalized_module_name} = (filters: TFilters) => {
  return useInfiniteQuery({
    queryKey: [cachedKeys.${module_name}.get${capitalized_module_name}InfinityList, filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const filtersWithPage = { ...filters, page: pageParam };
      const response = await ${capitalized_module_name}Service.get${capitalized_module_name}(
        parseFilters(filtersWithPage)
      );
      const resData = response.data;
      return {
        items: resData.data.pageData,
        page: resData.data.pageInfo.page,
        totalPage: resData.data.pageInfo.totalPage,
      };
    },
        getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined;
    },
  });
};
EOF

# Đảm bảo import nằm ở đầu file
if ! grep -q "import $component_name from \"./$component_name\";" "$index_file"; then
  # Chèn import trước dòng const CommonSelects
  awk -v importLine="import $component_name from \"./$component_name\";" '
    BEGIN { inserted=0 }
    /const CommonSelects = {/ && !inserted {
      print importLine;
      inserted=1
    }
    { print }
  ' "$index_file" >"${index_file}.tmp" && mv "${index_file}.tmp" "$index_file"
fi

# Thêm vào object nếu chưa có
if grep -q "const CommonSelects = {" "$index_file"; then
  grep -q "  $component_name," "$index_file" ||
    sed -i '' "s/const CommonSelects = {/const CommonSelects = {\n  $component_name,/" "$index_file"
else
  echo -e "\nconst CommonSelects = {\n  $component_name,\n};\n\nexport default CommonSelects;" >>"$index_file"
fi

echo "✅ Đã cập nhật index.ts"
