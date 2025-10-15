#!/bin/bash

# Regex cho camelCase: bắt đầu bằng chữ thường, có ít nhất một chữ hoa sau đó
pattern='^[a-z]+([A-Z][a-z0-9]*)+$'

while true; do
  read -p "Nhập tên module (định dạng camelCase, ví dụ: categoryTest): " module_name

  if [[ $module_name =~ $pattern ]]; then
    break
  else
    echo "❌ Tên module không hợp lệ. Vui lòng nhập theo định dạng camelCase:"
    echo "    - Bắt đầu bằng chữ cái thường"
    echo "    - Có ít nhất một chữ cái in hoa ở giữa (ví dụ: categoryTest, myNewModule)"
    echo "    - Không chứa dấu cách, dấu gạch dưới, hoặc ký tự đặc biệt"
    echo ""
  fi
done

# Viết hoa chữ cái đầu (capitalize)
capitalized_module_name="$(echo "${module_name:0:1}" | tr '[:lower:]' '[:upper:]')${module_name:1}"

# Viết hoa toàn bộ tên module (snake_case)
snake_case=$(echo "$capitalized_module_name" | sed 's/\([A-Z]\)/_\1/g' | tr '[:lower:]' '[:upper:]' | sed 's/^_//')

# Tạo module_path: bỏ tiền tố như 'category', rồi lowercase phần còn lại
module_path=$(echo "categoryTest" | sed -E 's/^(category|master|config|ref)//' | tr '[:upper:]' '[:lower:]')

# Đường dẫn đến file apiUrl.ts
API_URL_FILE="src/constants/apiUrl.ts"

# Nếu endpoint đã tồn tại → hủy script
if grep -q "export const ${snake_case} =" "$API_URL_FILE"; then
  echo "❌ Endpoint '${snake_case}' đã tồn tại trong $API_URL_FILE. Hủy toàn bộ quá trình tạo module."
  exit 1
fi

# Tạo đường dẫn
MODULE_DIR="src/modules/$module_name"
HOOKS_DIR="$MODULE_DIR/hooks"

# Tạo thư mục chính và thư mục hooks
mkdir -p "$HOOKS_DIR"

# Ghi nội dung vào file service
cat >"$MODULE_DIR/${module_name}Service.ts" <<EOF
import { PromiseResponseBase } from "@src/types/common";
import { httpService } from "@src/services/httpService";
import queryString from "query-string";
import { ${snake_case} } from "@src/constants/apiUrl";
import {
  RequestCreateI${capitalized_module_name},
  RequestUpdateStatusI${capitalized_module_name},
  RequestGetDetailI${capitalized_module_name},
  RequestGetListI${capitalized_module_name},
  RequestUpdateI${capitalized_module_name},
  ResponseCreateI${capitalized_module_name},
  ResponseGetDetailI${capitalized_module_name},
  ResponseGetListI${capitalized_module_name},
  ResponseUpdateI${capitalized_module_name},
  ResponseGetCountStatus${capitalized_module_name}
} from "./${module_name}.interface";

// Gửi request để lấy danh sách với bộ lọc
const get${capitalized_module_name} = (
  params: RequestGetListI${capitalized_module_name}
): PromiseResponseBase<ResponseGetListI${capitalized_module_name}> => {
  const query = queryString.stringify(params);
  return httpService.get(\`\${${snake_case}.GET_LIST}?\${query}\`);
};

// Gửi request để lấy chi tiết theo ID
const get${capitalized_module_name}Detail = ({
  id,
}: RequestGetDetailI${capitalized_module_name}): PromiseResponseBase<ResponseGetDetailI${capitalized_module_name}> => {
  return httpService.get(${snake_case}.GET_DETAIL(id));
};

// Gửi request để tạo mới
const create${capitalized_module_name} = (
  body: RequestCreateI${capitalized_module_name}
): PromiseResponseBase<ResponseCreateI${capitalized_module_name}> => {
  return httpService.post(${snake_case}.CREATE, body);
};

// Gửi request để cập nhật
const update${capitalized_module_name} = (
  body: RequestUpdateI${capitalized_module_name}
): PromiseResponseBase<ResponseUpdateI${capitalized_module_name}> => {
  return httpService.put(${snake_case}.UPDATE, body);
};

// Gửi request để cập nhật trạng thái (xoá mềm, v.v.)
const updateStatus${capitalized_module_name} = (
  body: RequestUpdateStatusI${capitalized_module_name}
): PromiseResponseBase<ResponseUpdateStatusI${capitalized_module_name}> => {
  return httpService.put(${snake_case}.UPDATE_STATUS, body);
};

// Gửi request để lấy số lượng trạng thái của thuộc tính danh mục
const getCountStatus${capitalized_module_name} =
  (params: RequestGetListI${capitalized_module_name}): PromiseResponseBase<ResponseGetCountStatus${capitalized_module_name}> => {
  const query = queryString.stringify(params);
  return httpService.get(\`\${${snake_case}.GET_COUNT_STATUS}?\${query}\`);
  }

export default {
  get${capitalized_module_name},
  get${capitalized_module_name}Detail,
  create${capitalized_module_name},
  update${capitalized_module_name},
  updateStatus${capitalized_module_name},
  getCountStatus${capitalized_module_name},
};
EOF

# Tạo nội dung cho interface
cat >"$MODULE_DIR/${module_name}.interface.ts" <<EOF
import {
  IStatusSummaryResponse,
  ResponseCreateCommon,
  ResponseDataCommon,
  ResponseList,
  TypeId,
} from "@src/types/common";
import { PaginationFilters } from "@src/types/paging";

export interface I${capitalized_module_name} {
  is_status: number;
}

export type RequestGetListI${capitalized_module_name} = PaginationFilters & {};
export type ResponseGetListI${capitalized_module_name} = ResponseDataCommon<
  ResponseList<I${capitalized_module_name}>
>;

export type RequestGetDetailI${capitalized_module_name} = { id: TypeId };
export type ResponseGetDetailI${capitalized_module_name} = ResponseDataCommon<I${capitalized_module_name}>;

export type RequestCreateI${capitalized_module_name} = {
  id: TypeId;
};
export type ResponseCreateI${capitalized_module_name} = ResponseDataCommon<
  ResponseCreateCommon<I${capitalized_module_name}>
>; 

export type RequestUpdateI${capitalized_module_name} = RequestCreateI${capitalized_module_name} & {
  id: TypeId;
};
export type ResponseUpdateI${capitalized_module_name} = ResponseDataCommon<
  ResponseCreateCommon<I${capitalized_module_name}>
>; 

export type RequestUpdateStatusI${capitalized_module_name} = {
  listId: TypeId[];
  action: string;
};

export type ResponseUpdateStatusI${capitalized_module_name} = ResponseDataCommon<
  ResponseCreateCommon<void>
>;

export type ResponseGetCountStatus${capitalized_module_name} = ResponseDataCommon<
  IStatusSummaryResponse
>;

EOF

# Ghi nội dung vào file model
cat >"$MODULE_DIR/${module_name}.model.ts" <<EOF
import { IValueForm${capitalized_module_name} } from "@src/pages/${capitalized_module_name}/components/Modal${capitalized_module_name}/components/ContentModal${capitalized_module_name}";
import {
  I${capitalized_module_name},
  RequestCreateI${capitalized_module_name},
  RequestUpdateI${capitalized_module_name},
} from "./${module_name}.interface";
import { omit } from "lodash";
import { TypeId } from "@src/types/common";

class ${capitalized_module_name}Model {
  static parseInitialValues(item?: I${capitalized_module_name}) {
    const result = { ...item };
    return result as IValueForm${capitalized_module_name};
  }

  static parseBodyToCreate(value: IValueForm${capitalized_module_name}) {
    const result = { ...value };
    return result as RequestCreateI${capitalized_module_name};
  }

  static parseBodyToUpdate(value: IValueForm${capitalized_module_name}, id: TypeId) {
    const updatePayload = omit(this.parseBodyToCreate(value), []);
    const result = {
      ...updatePayload,
      id: id,
    };

    return result as RequestUpdateI${capitalized_module_name};
  }
}

export default ${capitalized_module_name}Model;
EOF

cat >"$HOOKS_DIR/useGetDetail${capitalized_module_name}.ts" <<EOF
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { useQuery, UndefinedInitialDataOptions } from "@tanstack/react-query";
import ${capitalized_module_name}Service from "../${module_name}Service";
import cachedKeys from "@src/constants/cachedKeys";
import { TypeId } from "@src/types/common";
import { ResponseGetDetailI${capitalized_module_name} } from "../${module_name}.interface";

// Gửi request để lấy chi tiết theo ID
export const useGet${capitalized_module_name}Detail = (
  id: TypeId,
  options?: UndefinedInitialDataOptions<any, any, any, any>
) => {
  return useQuery<AxiosResponse<ResponseGetDetailI${capitalized_module_name}>>({
    queryKey: [cachedKeys.${module_name}.get${capitalized_module_name}Detail, id],
    queryFn: async () => {
      const res = await ${capitalized_module_name}Service.get${capitalized_module_name}Detail({ id as TypeId });
      return res;
    },
    enabled: !!id,
    ...options,
  });
};
EOF

cat >"$HOOKS_DIR/useGetList${capitalized_module_name}.ts" <<EOF
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InitialFiltersSearch } from "@pnkx-lib/core";
import { IFilters${capitalized_module_name} } from "@src/pages/${capitalized_module_name}";
import { useQuery, UndefinedInitialDataOptions } from "@tanstack/react-query";
import ${capitalized_module_name}Service from "../${module_name}Service";
import cachedKeys from "@src/constants/cachedKeys";
import { cloneDeep } from "lodash";
import {
  RequestGetListI${capitalized_module_name},
  ResponseGetListI${capitalized_module_name},
} from "../${module_name}.interface";
import { AxiosResponse } from "axios";
import { TypeStatusTable } from "@pnkx-lib/ui";

type TFilters = InitialFiltersSearch<IFilters${capitalized_module_name}>;

// Chuyển đổi bộ lọc
const parseFilters = (filters: TFilters): RequestGetListI${capitalized_module_name} => {
  return cloneDeep({
    ...filters,
    
    status:
      filters?.status === TypeStatusTable.ALL ? undefined : filters?.status,
  });
};

// Gửi request để lấy danh sách với bộ lọc
export const useGetList${capitalized_module_name} = (
  filters: TFilters,
  options?: UndefinedInitialDataOptions<any, any, any, any>
) => {
  const nextFilters = parseFilters(filters);
  return useQuery<AxiosResponse<ResponseGetListI${capitalized_module_name}>>({
    queryKey: [cachedKeys.${module_name}.get${capitalized_module_name}List, { ...filters }],
    queryFn: async () => {
      const res = await ${capitalized_module_name}Service.get${capitalized_module_name}(nextFilters);
      return res;
    },
    ...options,
  });
};
EOF

cat >"$HOOKS_DIR/useCreate${capitalized_module_name}.ts" <<EOF
import { AxiosResponse } from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import ${capitalized_module_name}Service from "../${module_name}Service";
import cachedKeys from "@src/constants/cachedKeys";
import {
  RequestCreateI${capitalized_module_name},
  ResponseCreateI${capitalized_module_name},
} from "../${module_name}.interface";

// Gửi request để tạo mới
export const useCreate${capitalized_module_name} = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseCreateI${capitalized_module_name}>,
    Error,
    RequestCreateI${capitalized_module_name}
  >
) =>
  useMutation({
    mutationKey: [cachedKeys.${module_name}.create${capitalized_module_name}],
    mutationFn: (payload) => ${capitalized_module_name}Service.create${capitalized_module_name}(payload),
    ...options,
  });
EOF

cat >"$HOOKS_DIR/useUpdate${capitalized_module_name}.ts" <<EOF
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import ${capitalized_module_name}Service from "../${module_name}Service";
import type {
  RequestUpdateI${capitalized_module_name},
  ResponseUpdateI${capitalized_module_name},
} from "../${module_name}.interface";
import type { AxiosResponse } from "axios";
import cachedKeys from "@src/constants/cachedKeys";

// Gửi request để cập nhật theo ID
export const useUpdate${capitalized_module_name} = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseUpdateI${capitalized_module_name}>,
    Error,
    RequestUpdateI${capitalized_module_name}
  >
) =>
  useMutation({
    mutationKey: [cachedKeys.${module_name}.update${capitalized_module_name}],
    mutationFn: (payload) => ${capitalized_module_name}Service.update${capitalized_module_name}(payload),
    ...options,
  });
EOF

cat >"$HOOKS_DIR/useUpdateStatus${capitalized_module_name}.ts" <<EOF
import { AxiosResponse } from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import ${capitalized_module_name}Service from "../${module_name}Service";
import cachedKeys from "@src/constants/cachedKeys";
import { RequestUpdateStatusI${capitalized_module_name} } from "../${module_name}.interface";

// Gửi request để thay đổi trạng thái của một hoặc nhiều
export const useUpdateStatus${capitalized_module_name} = (
  options?: UseMutationOptions<
    AxiosResponse<void>,
    Error,
    RequestUpdateStatusI${capitalized_module_name}
  >
) =>
  useMutation({
    mutationKey: [cachedKeys.${module_name}.updateStatus${capitalized_module_name}],
    mutationFn: (id) => ${capitalized_module_name}Service.updateStatus${capitalized_module_name}(id),
    ...options,
  });
EOF

cat >"$HOOKS_DIR/useGetStatusSummary${capitalized_module_name}.ts" <<EOF
import { useQuery } from "@tanstack/react-query";
import cachedKeys from "@src/constants/cachedKeys";
import { IStatusSummaryResponse } from "@src/types/common";
import { useStatusLabels } from "@src/hooks/useStatusLabels";
import { TypeStatusTable } from "@pnkx-lib/ui";
import ${capitalized_module_name}Service from "../${module_name}Service";
import { InitialFiltersSearch } from "@pnkx-lib/core";
import { IFilters${capitalized_module_name} } from "@src/pages/${capitalized_module_name}";
import { RequestGetListI${capitalized_module_name} } from "../${module_name}Service.interface";
import { cloneDeep } from "lodash";

// Hook trả về danh sách đã gộp label + quantity + is_status, không cần truyền filters

type TFilters = InitialFiltersSearch<IFilters${capitalized_module_name}>;

// Chuyển đổi bộ lọc cho api count-status
const parseFilters = (filters: TFilters): RequestGetListI${capitalized_module_name} => {
  return omit(
    filters,
    ...COMMON_FILTER_FIELDS_COUNT_STATUS
  ) as RequestGetListI${capitalized_module_name};
};

export const useGetStatusSummary${capitalized_module_name} = (filters: TFilters) => {
  const statusLabels = useStatusLabels();
  const nextFilters = parseFilters(filters);
  return useQuery({
    queryKey: [
      cachedKeys.${module_name}.get${capitalized_module_name}CountStatus,
      { ...filters },
    ],
    queryFn: async () => {
      const res = await ${capitalized_module_name}Service.getCountStatus${capitalized_module_name}(
        nextFilters
      );
      return res?.data?.data;
    },
    select: (data: IStatusSummaryResponse) => {
      const quantityMap = new Map(
        data?.data?.statusDetailResponseList?.map((item) => [
          item?.status,
          item?.totalStatus,
        ])
      );
      return statusLabels.map((item) => {
        const isAll = String(item.status) === String(TypeStatusTable.ALL);
        return {
          ...item,
          quantity: isAll
            ? data?.data?.totalElements || 0
            : quantityMap.get(Number(item?.status)) || 0,
        };
      });
    },
  });
};
EOF

# Kiểm tra nếu file tồn tại thì append nội dung mới
if [ -f "$API_URL_FILE" ]; then
  cat <<EOF >>"$API_URL_FILE"

export const ${snake_case} = {
  GET_LIST: \`\${BASE_CATEGORY_URL}/${module_path}/search\`,
  GET_DETAIL: (id: TypeId) => \`\${BASE_URL}/\${id}\`,
  CREATE: \`\${BASE_CATEGORY_URL}/${module_path}\`,
  UPDATE: \`\${BASE_CATEGORY_URL}/${module_path}\`,
  UPDATE_STATUS: \`\${BASE_CATEGORY_URL}/${module_path}/update-status\`,
  GET_COUNT_STATUS: \`\${BASE_CATEGORY_URL}/${module_path}/count-status\`,
};
EOF

  echo "✅ Đã thêm '${snake_case}' vào $API_URL_FILE"
else
  echo "❌ Không tìm thấy file $API_URL_FILE"
fi

# Đường dẫn file cachedKeys
CACHED_KEYS_FILE="src/constants/cachedKeys.ts"

# Nếu file chưa tồn tại thì dừng
if [ ! -f "$CACHED_KEYS_FILE" ]; then
  echo "❌ File $CACHED_KEYS_FILE chưa tồn tại. Không cập nhật."
  exit 1
fi

# Xoá dòng "} as const;" để chèn thêm nội dung
sed -i '' '/} as const;/d' "$CACHED_KEYS_FILE"

# Ghi thêm khối key mới vào cuối
cat >>"$CACHED_KEYS_FILE" <<EOF
  ${module_name}: {
    create${capitalized_module_name}: "create${capitalized_module_name}",
    updateStatus${capitalized_module_name}: "updateStatus${capitalized_module_name}",
    update${capitalized_module_name}: "update${capitalized_module_name}",
    get${capitalized_module_name}Detail: "get${capitalized_module_name}Detail",
    get${capitalized_module_name}List: "get${capitalized_module_name}List",
    get${capitalized_module_name}InfinityList: "get${capitalized_module_name}InfinityList",
    get${capitalized_module_name}CountStatus: "get${capitalized_module_name}CountStatus",
  },
} as const;
EOF

bash ./shell/genTable.sh "$module_name"
bash ./shell/genRoute.sh "$module_name"
bash ./shell/genLocale.sh "$module_name"
bash ./shell/genSelectLookup.sh "$module_name"
