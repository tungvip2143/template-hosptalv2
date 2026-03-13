/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorCode } from "@pnkx-lib/core";
import { AxiosResponse } from "axios";

export type PromiseResponseBase<T> = Promise<AxiosResponse<T>>;

export interface ResponseDataCallback<T> {
  code: string;
  data: T;
  error: any;
  message: string;
  requestId: string;
  success: boolean;
}
export interface Metadata {
  totalData: number;
  totalPage: number;
  page: number;
  size: number;
}
export interface ResponseList<T> {
  pageData: T[];
  pageInfo: Metadata;
  isApproved: boolean;
}
export interface ResponseListData<T> {
  items: T[];
  metadata: Metadata;
}

export interface SelectOption {
  label: string;
  value: any;
}
export interface ResponseCreateCommon<T> {
  code: ErrorCode; // e.g., "M_DC0012"
  message: string;
  data: T;
}

export type TypeId = string | number;

export interface IStatusSummary {
  statusAdminSystem: number;
  total_statusAdminSystem: number;
}

export type TTranslate = (
  key: string,
  options?: Record<string, unknown>
) => string;

export interface IStatusSummaryResponse {
  data: {
    totalElements: number;
    statusDetailResponseList: IStatusSummary[];
  };
}
