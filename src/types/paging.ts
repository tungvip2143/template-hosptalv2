import { PaginationFilters as PaginationFiltersPnkx } from "@pnkx-lib/core";

export type PaginationFilters = PaginationFiltersPnkx;

export interface PagingParams {
  PageSize?: number; // Số lượng bản ghi trên mỗi trang
  PageIndex?: number; // Chỉ số trang hiện tại (bắt đầu từ
}
