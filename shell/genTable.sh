#!/bin/bash

module_name="$1"

# Viết hoa chữ cái đầu (PascalCase)
capitalized_module_name="$(echo "${module_name:0:1}" | tr '[:lower:]' '[:upper:]')${module_name:1}"

# Base path
PAGE_DIR="src/pages/${capitalized_module_name}"
COMPONENTS_DIR="$PAGE_DIR/components"

# Cấu trúc các component con
CELL_DIR="$COMPONENTS_DIR/CellAction${capitalized_module_name}"
FILTER_DIR="$COMPONENTS_DIR/Filters${capitalized_module_name}"
FILTER_COMPONENTS_DIR="$FILTER_DIR/components"
MODAL_DIR="$COMPONENTS_DIR/Modal${capitalized_module_name}"
MODAL_COMPONENTS_DIR="$MODAL_DIR/components"
CONSTANTS_DIR="$PAGE_DIR/constants"
UTILS_DIR="$PAGE_DIR/utils"

# Tạo thư mục
mkdir -p "$CELL_DIR" "$FILTER_COMPONENTS_DIR" "$MODAL_COMPONENTS_DIR" "$CONSTANTS_DIR" "$UTILS_DIR"

# Tạo index.tsx ở src/pages/<Module>/index.tsx với nội dung đầy đủ
cat >"$PAGE_DIR/index.tsx" <<EOF
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  START_PAGE,
  START_PAGE_SIZE,
  TableColumnsType,
  TypeStatusTable,
} from "@pnkx-lib/ui";
import { TableCategory } from "@src/components/Table";
import {
  InitialFiltersSearch,
  useFiltersHandler,
  useHandleBulkAction,
  useToggle,
} from "@pnkx-lib/core";
import { useGetList${capitalized_module_name} } from "@src/modules/${module_name}/hooks/useGetList${capitalized_module_name}";
import Filters${capitalized_module_name} from "./components/Filters${capitalized_module_name}";
import { PlusIcon } from "@pnkx-lib/icon";
import { useTranslation } from "react-i18next";
import { get${capitalized_module_name}Columns } from "./constants/column";
import { 
  I${capitalized_module_name},  ResponseUpdateStatusI${capitalized_module_name},
  RequestUpdateStatusI${capitalized_module_name} 
} from "@src/modules/${module_name}/${module_name}.interface";
import Modal${capitalized_module_name} from "./components/Modal${capitalized_module_name}";
import { useState } from "react";
import menuRouter from "@src/router";
import { useGetStatusSummary${capitalized_module_name} } from "@src/modules/${module_name}/hooks/useGetStatusSummary${capitalized_module_name}";

export interface IFilters${capitalized_module_name} {
  keyword?: string;
  status?: TypeStatusTable;
}

const ${capitalized_module_name} = () => {
//! State
  const { t: trans } = useTranslation();
  const [selectedRowData, setSelectedRowData] = useState<I${capitalized_module_name} | undefined>();

  const initialFilters: InitialFiltersSearch<IFilters${capitalized_module_name}> = {
    page: START_PAGE,
    size: START_PAGE_SIZE,
    status: TypeStatusTable.ALL,
    keyword: "",
  };

  const {
    filters,
    handleSearch,
    handleChangePage,
    changeRowlimit,
    handleRequestSort,
    rowsSelected,
    handleCheckBox,
    resetToInitialFilters,
    setRowsSelected,
  } = useFiltersHandler<IFilters${capitalized_module_name}>(initialFilters);

  //! Call API
    const { data: dataCount, isLoading: isLoadingDataCountStatus , refetch: refetchDataCount, } =
    useGetStatusSummary${capitalized_module_name}(filters);

  const { data, isLoading, refetch} = useGetList${capitalized_module_name}(filters);
  const listItems = data?.data?.data?.pageData;
  const totalItems = data?.data?.data?.pageInfo?.totalData;
  const isApproved = data?.data?.data?.isApproved;
  const listItemsConverted = useMemo(() => {
    return listItems?.map((item) => ({
      ...item,
            isApproved: isApproved,

    }));
  }, [listItems]);

  const { shouldRender, open, toggle } = useToggle();

//! Function
  const handleCreate = () => {
    setSelectedRowData(undefined);
    toggle();
  };

  const handleEdit = (record?: I${capitalized_module_name}) => {
    setSelectedRowData(record?.${module_name}Id);
    toggle();
  };

  const handleRefreshWithResetPage = () => {
    handleSearch(filters);
    refetch();
    refetchDataCount();
    handleCheckBox([]);
  };

  const initialColumn = get${capitalized_module_name}Columns({ trans, handleEdit, handleCheckBox });
  const [columns, setColumns] =
    useState<TableColumnsType<I${capitalized_module_name}>>(initialColumn);

  const renderHeadingSearch = () => (
    <Filters${capitalized_module_name}
      filters={filters}
      handleSearch={handleSearch}
      resetToInitialFilters={resetToInitialFilters}
    />
  );

  const renderRightHeadingContent = () => (
    <Button
      type="primary"
      variant="solid"
      shape="round"
      rootClassName="btn-add-new"
      icon={<PlusIcon />}
      onClick={handleCreate}
    >
      {trans("action:add", { name: "" })}
    </Button>
  );

  const bulkActionHandlers = useHandleBulkAction<
    ResponseUpdateStatusI${capitalized_module_name},
    RequestUpdateStatusI${capitalized_module_name}
  >(${module_name}Service.updateStatus${capitalized_module_name}, rowsSelected?.map(String), {
    onSuccess: () => {
      refetch();
      refetchDataCount();
      handleCheckBox([]);
    },
  });

//! Render
  return (
    <div className="table-wrapper">
      {shouldRender && (
        <Modal${capitalized_module_name}
          open={open}
          handleToggleModal={toggle}
          record={selectedRowData}
          onSuccess={handleRefreshWithResetPage}
        />
      )}
      <TableCategory<I${capitalized_module_name}>
        dataSource={listItems}
        columns={columns}
        loading={isLoading && isLoadingDataCountStatus}
        totalItems={totalItems}
        filters={filters}
        onChangePage={handleChangePage}
        onChangePageSize={changeRowlimit}
        onSort={handleRequestSort}
        rowsSelected={rowsSelected}
        onSelect={handleCheckBox}
        className="table-height"
        onDoubleClickRow={handleEdit}
        showSetting
        renderHeadingSearch={renderHeadingSearch}
        rightHeadingContent={renderRightHeadingContent()}
        menu={menuRouter}
        groupHeadingButtonItems={dataCount}
        setFilters={handleSearch}
        setColumns={setColumns}
        bulkActionHandlers={bulkActionHandlers}
        setRowsSelected={setRowsSelected}
        isApproved={isApproved}
      />
    </div>
  );
};

export default ${capitalized_module_name};
EOF

cat >"$CELL_DIR/index.tsx" <<EOF
import {
  ActionRowTable,
  BulkActions,
  TypeActionRowTable,
  TypeBulkActions,
} from "@pnkx-lib/ui";
import cachedKeys from "@src/constants/cachedKeys";
import {
  I${capitalized_module_name},
  RequestUpdateStatusI${capitalized_module_name},
  ResponseUpdateStatusI${capitalized_module_name},
} from "@src/modules/${module_name}/${module_name}.interface";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useHandleBulkAction } from "@pnkx-lib/core";
import ${module_name}Service from "@src/modules/${module_name}/${module_name}Service";

interface ICellActionsProps {
  record: I${capitalized_module_name};
  handleEdit?: () => void;
  handleCheckBox: (newSelectedRowKeys: React.Key[]) => void;
}

const CellActions = ({
  record,
  handleEdit,
  handleCheckBox,
}: ICellActionsProps) => {
  //! State
  const { t: trans } = useTranslation();

  const queryClient = useQueryClient();
  const refetchList = () =>
    queryClient.invalidateQueries({
      queryKey: [
        cachedKeys.${module_name}.get${capitalized_module_name}List,
        cachedKeys.${module_name}.get${capitalized_module_name}CountStatus,
      ],
    });

  //! Function
  const bulkActionHandlers = useHandleBulkAction<
    ResponseUpdateStatusI${capitalized_module_name},
    RequestUpdateStatusI${capitalized_module_name}
  >(
    ${module_name}Service.updateStatus${capitalized_module_name},
    [record.id],
    {
      onSuccess: () => {
        refetchList();
        handleCheckBox([]);
      },
    }
  );

  //! Function

  //! Render
  return (
    <div className="flex gap-2">
      <ActionRowTable
        type={TypeActionRowTable.EDIT}
        contentTooltip={trans("action:editRecord")}
        handleClick={handleEdit}
      />
      <ActionRowTable
        type={TypeActionRowTable.DELETE}
        contentTooltip={trans("action:removeRecord")}
        handleClick={bulkActionHandlers?.handleDelete}
      />
      <BulkActions
        typeBulkaction={TypeBulkActions.DROPLIST}
        status={record?.status}
        isApproved={record?.isApproved}
        {...bulkActionHandlers}
      />
    </div>
  );
};

export default CellActions;
EOF

cat >"$FILTER_DIR/index.tsx" <<EOF
import {
  PAGE_NUMBER,
  PAGE_SIZE,
  SearchFiltersForm,
  Typography,
} from "@pnkx-lib/ui";
import { omit } from "lodash";

import { IFilters${capitalized_module_name} } from "../..";
import RenderFilterFields  from "./components/RenderFilterFields";
import { hasFalsyFieldsObject } from "@src/utils/function";
import { useTranslation } from "react-i18next";
import { InitialFiltersSearch } from "@pnkx-lib/core";
import { IS_STATUS } from "@src/constants/table";

export type IValueSearch${capitalized_module_name} = {
  keyword: string | undefined;
  attributeType: string | null | undefined;
};

interface Props {
  filters: InitialFiltersSearch<IFilters${capitalized_module_name}>;
  handleSearch: (
    nextFilters: InitialFiltersSearch<IFilters${capitalized_module_name}>
  ) => void;
  resetToInitialFilters: () => void;
}

const Filters${capitalized_module_name} = (props: Props) => {
  //! State
  const { filters, handleSearch, resetToInitialFilters } = props;
  const { t: trans } = useTranslation();

  const initialValues: IValueSearch${capitalized_module_name} = {
    keyword: "",
    attributeType: null,
  };

  //! Render
  return (
    <>
      <Typography.Title level={2}>
        {trans("category:category", {
          name: trans("category:city").toLowerCase(),
        })}
      </Typography.Title>
      <SearchFiltersForm<IValueSearch${capitalized_module_name}>
        onSubmit={(values) => {
          handleSearch({
            ...filters,
            keyword: values?.keyword,
            attributeType: values?.attributeType,
          });
        }}
        initialValues={initialValues}
        classNamesContainer="flex"
        hideDefaultSubmit
        renderFilterFields={({ control, handleSubmit, reset }) => {
          return (
              <RenderFilterFields
                control={control}
                handleSubmit={handleSubmit}
                reset={reset}
                resetToInitialFilters={resetToInitialFilters}
                isNullFilter={hasFalsyFieldsObject(
                  omit(filters, [PAGE_NUMBER, PAGE_SIZE, IS_STATUS])
                )}
              />
          );
        }}
      />
    </>
  );
};

export default Filters${capitalized_module_name};
EOF

cat >"$FILTER_COMPONENTS_DIR/RenderFilterFields.tsx" <<EOF
import { Control, UseFormReset } from "node_modules/react-hook-form/dist/types";
import { twMerge } from "tailwind-merge";

import Timer from "@src/utils/timer";
import { Button, Input, PnkxField, Select } from "@pnkx-lib/ui";
import {
  AllowClearIcon,
  SearchIcon,
  TrashCanIcon,
} from "@src/components/IconCommon";
import { DisableRemoveIconColor, RemoveIconColor } from "@src/constants/color";
import useConstants from "@src/constants/useConstants";
import { useTranslation } from "react-i18next";
import { DEFAULT_NUMBER } from "@src/constants/common";
import { IValueSearch${capitalized_module_name} } from "..";
import React from "react";

interface RenderFilterFieldsProps {
  control: Control<IValueSearch${capitalized_module_name}>;
  handleSubmit?: React.FormEventHandler<IValueSearch${capitalized_module_name}>;
  resetToInitialFilters: () => void;
  reset?: UseFormReset<IValueSearch${capitalized_module_name}>;
  isNullFilter: boolean;
}

const RenderFilterFields = (props: RenderFilterFieldsProps) => {
  //! State
  const { control, handleSubmit, reset, resetToInitialFilters, isNullFilter } = props;
  const timer = new Timer();

  const { optionsAttributeType } = useConstants();
  const { t: trans } = useTranslation();

  //! Render
  return (
   <div className="table-header">
      <div className="containerRenderFilterFields">
        <div className="bigColRenderFilterField">
            <PnkxField
              iconStartInput={<SearchIcon />}
              allowClear={{
                clearIcon: (
                 <div className="allowClearIcon">
                    <AllowClearIcon  />
                  </div>
                ),
              }}
             className="inputSearchKey"
              component={Input}
              name="keyword"
              control={control}
              type="search"
              placeholder={trans("${module_name}:keySearchCitiesAndAbbreviations")}
              afterOnChange={() => {
                timer.debounce((e) => {
                  if (handleSubmit) {
                    handleSubmit(e);
                  }
                }, DEFAULT_NUMBER.TIMEOUT_DEBOUNCE);
              }}
            />
        </div>
  
        <div className="colRenderFilterField">
            <PnkxField
            classNameContainer="inputSearchOption"
            component={Select}
            name="attributeType"
            control={control}
            options={optionsAttributeType}
            placeholder={trans("${module_name}:keySearchCountriesName")}
            afterOnChange={() => {
              timer.debounce((e) => {
                if (handleSubmit) {
                  handleSubmit(e);
                }
              }, DEFAULT_NUMBER.TIMEOUT_DEBOUNCE);
            }}
          />
        </div>
  
      <div className="colRenderFilterButtonField_offset1">
        <Button
          onClick={() => {
            resetToInitialFilters();
            if (reset) {
              reset();
            }
          }}
          disabled={isNullFilter}
          className={twMerge(
            isNullFilter
              ? "customContainButtonIcon_isNullFilter"
              : "customContainButtonIcon_notNullFilter",
            "customContainButtonIcon"
          )}
          icon={<TrashCanIcon color={isNullFilter ? DisableRemoveIconColor : RemoveIconColor} />}
        >
          {trans("action:removeFilter")}
        </Button>
      </div>
      </div>
   </div>
  );
};

export default React.memo(RenderFilterFields);
EOF

cat >"$MODAL_DIR/index.tsx" <<EOF
import { Modal } from "@pnkx-lib/ui";
import { useResetInfiniteSelectToFirstPage } from "@src/hooks/useResetInfiniteSelectToFirstPage";
import ContentModal${capitalized_module_name} from "./components/ContentModal${capitalized_module_name}";
import { useTranslation } from "react-i18next";
import { I${capitalized_module_name} } from "@src/modules/${module_name}/${module_name}.interface";

interface IModal${capitalized_module_name}Props {
  open: boolean;
  handleToggleModal: () => void;
  id?: TypeId;
  onSuccess?: () => void;
}

const Modal${capitalized_module_name} = ({
  open,
  handleToggleModal,
  id,
  onSuccess,
}: IModal${capitalized_module_name}Props) => {
  //! State
  const { t: trans } = useTranslation();
  const isEdit = !!id;

  //! Function
  const renderTitleModal = () => {
    if (isEdit) {
      return trans("action:edit", { name: trans("${module_name}:${module_name}") });
    }
    return trans("action:add", { name: trans("${module_name}:${module_name}") });
  };

  // Reset infinite select về page đầu tiên khi modal đóng (giữ cache page 1)
  useResetInfiniteSelectToFirstPage(open);

  //! Render
  return (
    <Modal
      open={open}
      title={renderTitleModal()}
      onCancel={handleToggleModal}
      footer={null}
    >
      <ContentModal${capitalized_module_name}
        handleToggleModal={handleToggleModal}
        id={id}
        onSuccess={onSuccess}
      />
    </Modal>
  );
};

export default Modal${capitalized_module_name};
EOF

cat >"$UTILS_DIR/validation.ts" <<EOF
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  validateCategoryCode,
  validateCategoryName,
} from "@src/constants/validate";
import * as yup from "yup";
import { TTranslate } from "@src/types/common";

export const createValidationSchema = (
  trans: TTranslate
): yup.ObjectSchema<any> => {
  return yup.object({
    ${module_name}Code: validateCategoryCode(trans, "category${capitalized_module_name}:${module_name}Code"),
    ${module_name}Name: validateCategoryName(trans, "category${capitalized_module_name}:${module_name}Name"),
    note: yup.string().trim().notRequired(),
  });
};
EOF

cat >"$CONSTANTS_DIR/fieldLabelMapping.ts" <<EOF
/**
 * Field Label Mapping for ${capitalized_module_name} Module
 * Maps form field names to their display labels for better error messages
 */

import { FieldLabelMap } from "@pnkx-lib/core";
import { TTranslate } from "@src/types/common";

/**
 * Create field label mapping for ${capitalized_module_name} form
 * @param trans - Translation function from useTranslation
 * @returns Field label mapping for ${capitalized_module_name} form
 */
export const create${capitalized_module_name}FieldLabels = (
  trans: TTranslate
): FieldLabelMap => ({
  ${module_name}Code: trans("${module_name}:${module_name}Code"),
  ${module_name}Name: trans("${module_name}:${module_name}Name"),
  status: trans("common:status"),
});
EOF

cat >"$MODAL_COMPONENTS_DIR/ContentModal${capitalized_module_name}.tsx" <<EOF
import { Button, Input, PnkxField, Select } from "@pnkx-lib/ui";
import CategoryEditStatus from "@src/components/common/CategoryEditStatus";
import ${capitalized_module_name}Model from "@src/modules/${module_name}/${module_name}.model";
import { I${capitalized_module_name} } from "@src/modules/${module_name}/${module_name}.interface";
import { useCreate${capitalized_module_name} } from "@src/modules/${module_name}/hooks/useCreate${capitalized_module_name}";
import { useUpdate${capitalized_module_name} } from "@src/modules/${module_name}/hooks/useUpdate${capitalized_module_name}";
import { useGet${capitalized_module_name}Detail } from "@src/modules/${module_name}/hooks/useGet${capitalized_module_name}Detail";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { createValidationSchema } from "../../../utils/validation";
import { CATEGORY_VALIDATION_RULES } from "@src/constants/validate";
import useConstants from "@src/constants/useConstants";
import { create${capitalized_module_name}FieldLabels } from "../../../constants/fieldLabelMapping";
import { FormSetErrorFunction, useErrorHandler } from "@pnkx-lib/core";
import { handlePreventDefaultSubmit } from "@src/utils/function";

export interface IValueForm${capitalized_module_name} {
  ${module_name}Code: string;
  ${module_name}Name: string;
  status?: number | string;
}

interface Props {
  handleToggleModal: () => void;
  id?: TypeId;
  onSuccess?: () => void;
}

const ContentModal${capitalized_module_name} = ({ handleToggleModal, record, onSuccess }: Props) => {
  //! State
  const { t: trans } = useTranslation();
  const { optionsStatusCategory } = useConstants();
  const queryClient = useQueryClient();

  const schema = createValidationSchema(trans);
  const isEditMode = Boolean(id);

  const {
    data: detailResponse,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    refetch: refetchDetail,
    isFetching: isFetchingDetail,
  } = useGet${capitalized_module_name}Detail(id as TypeId);

  const detailRecord = detailResponse?.data?.data as
    | I${capitalized_module_name}
    | undefined;

  const initialValues = useMemo(
    () =>
      ${capitalized_module_name}Model.parseInitialValues(
        isEditMode ? detailRecord : undefined
      ),
    [detailRecord, isEditMode]
  );

  const fieldLabelMap = create${capitalized_module_name}FieldLabels(trans);

  const { control, handleSubmit, setError , formState:{isSubmitting}} = useForm<IValueForm${capitalized_module_name}>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (detailRecord) {
      reset(${capitalized_module_name}Model.parseInitialValues(detailRecord));
    }
  }, [detailRecord, isEditMode, reset]);

  const { showSuccess, handleApiErrorWithForm } = useErrorHandler();

  const refetchCountStatus = () =>
    queryClient.invalidateQueries({
      queryKey: [
        cachedKeys.${module_name}.get${capitalized_module_name}CountStatus,
      ],
    });

  //! Call API
  const { mutateAsync: create${capitalized_module_name} } = useCreate${capitalized_module_name}({
    onSuccess: (data) => {
      const status = data?.data?.data?.code;
      onSuccess?.();
      refetchCountStatus();
      showSuccess(status);
      handleToggleModal();
    },
    onError: (error) => {
      handleApiErrorWithForm(
        error,
        setError as FormSetErrorFunction,
        fieldLabelMap
      );
    },
  });

  const { mutateAsync: update${capitalized_module_name} } = useUpdate${capitalized_module_name}({
    onSuccess: (data) => {
      const status = data?.data?.data?.code;
      onSuccess?.();
      showSuccess(status);
      handleToggleModal();
    },
    onError: (error) => {
      handleApiErrorWithForm(
        error,
        setError as FormSetErrorFunction,
        fieldLabelMap
      );
    },
  });

  //! Function
  const onSubmit = async(data: IValueForm${capitalized_module_name}) => {
    if (isEditMode) {
      if (!detailRecord?.${module_name}Id) {
        return;
      }
      const payloadUpdate = ${capitalized_module_name}Model.parseBodyToUpdate(
        data,
        detailRecord?.${module_name}Id
      );
      await update${capitalized_module_name}(payloadUpdate);
      return
    } 
    const payloadCreate = ${capitalized_module_name}Model.parseBodyToCreate(data);
    await create${capitalized_module_name}(payloadCreate);
  };

  const isEdit = isEditMode && Boolean(detailRecord);

  //! Render
  if (isEditMode && (isLoadingDetail || isErrorDetail || !detailRecord)) {
    return (
      <CategoryEditStatus
        isLoadingDetail={isLoadingDetail}
        isErrorDetail={isErrorDetail}
        isFetchingDetail={isFetchingDetail}
        detailRecord={detailRecord}
        refetchDetail={refetchDetail}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-modal-category-container"
    onKeyDown={handlePreventDefaultSubmit}>
      <div className="content-modal two-column-content-modal">
          <PnkxField
          label={fieldLabelMap.${module_name}Code}
          required
          control={control}
          name="${module_name}Code"
          component={Input}
          placeholder={trans("action:enter", {
            name: fieldLabelMap.${module_name}Code.toLowerCase(),
          })}
          disabled={isEdit}
          contentTooltip={trans("validate:validateInvalidFormatCategoryCode", {
            characters: CATEGORY_VALIDATION_RULES.CODE.MAX_LENGTH,
          })}
        />
        
        <PnkxField
          label={fieldLabelMap.${module_name}Name}
          required
          control={control}
          name="${module_name}Name"
          component={Input}
          placeholder={trans("action:enter", {
            name: fieldLabelMap.${module_name}Name.toLowerCase(),
          })}
          contentTooltip={trans("validate:validateMaximunCategoryName", {
            characters: CATEGORY_VALIDATION_RULES.NAME.MAX_LENGTH,
          })}
        />

        {isEdit && (
          <PnkxField
            label={fieldLabelMap.status}
            disabled
            control={control}
            name="status"
            component={Select}
            options={optionsStatusCategory}
          />
        )}
      </div>
      <div className="form-footer">
        <Button type="default" shape="round" onClick={handleToggleModal}>
          {trans("action:cancel")}
        </Button>
        <Button type="primary" shape="round" htmlType="submit" loading={isSubmitting}>
          {trans("action:save")}
        </Button>
      </div>
    </form>
  );
};

export default ContentModal${capitalized_module_name};
EOF

cat >"$CONSTANTS_DIR/column.tsx" <<EOF
import { CategoryStatus, TableColumnsType } from "@pnkx-lib/ui";
import { I${capitalized_module_name} } from "@src/modules/${module_name}/${module_name}.interface";
import CellActions from "../components/CellAction${capitalized_module_name}";
import { TTranslate } from "@src/types/common";

interface Props {
  trans: TTranslate;
  handleEdit: (record?: I${capitalized_module_name}) => void;
  handleCheckBox: (rowIds: React.Key[]) => void;
}

export const get${capitalized_module_name}Columns = (
  props: Props
): TableColumnsType<I${capitalized_module_name}> => {
  const { trans, handleEdit } = props;

  return [
    {
      title: trans("${module_name}:citiesCode"),
      dataIndex: "cities_code",
      key: "cities_code",
      
    },
    {
      title: trans("${module_name}:citiesName"),
      dataIndex: "cities_name",
      key: "cities_name",
      
    },
    {
      title: trans("${module_name}:countriesName"),
      dataIndex: "countries_name",
      key: "countries_name",
    },
    {
      title: trans("${module_name}:abbreviations"),
      dataIndex: "abbreviations",
      key: "abbreviations",
    },
    {
      title: trans("common:status"),
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        return <CategoryStatus status={record?.is_status} />;
      },
    },
    {        title: trans("common:action"),
      render: (_, record) => {
        return (
          <CellActions 
            record={record} 
            handleEdit={() => handleEdit(record)}
            handleCheckBox={props.handleCheckBox}
          />
        );
      },
    },
  ];
};
EOF

touch "$UTILS_DIR/index.ts"

echo "✅ Đã tạo table '$capitalized_module_name'."
