/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "category/*" {
  // Đảm bảo rằng bạn khai báo kiểu dữ liệu cho các module từ remote
  const value: any; // Thay `any` bằng kiểu dữ liệu phù hợp nếu bạn biết chính xác kiểu
  export default value;
}

declare module "categoryModule/*" {
  const module: any;
  export default module;
}
declare module "receptionModule/*" {
  import * as React from "react";
  export interface ReceptionModuleProps {
    isSummaryBilling?: boolean;
    receptionId: string;
    setReceptionDetail: (data: unknown) => void;
    renderPatientDetailMode: React.ReactNode;
    statusPrescribedService?: number; // trạng thái công khám (trạng thái chỉ định dịch vụ)
  }

  const ReceptionModule: React.ComponentType<ReceptionModuleProps>;
  export default ReceptionModule;
}

declare module "receptionModule/DesignateServiceList" {
  import * as React from "react";
  export interface DesignateServiceListProps {
    receptionId: string[];
    roomExacId: string;
    conceptCode: ENUM_DESIGNATE_SERVICE_TYPE;
  }
  const DesignateServiceList: React.ComponentType<DesignateServiceListProps>;
  export default DesignateServiceList;
  export { DesignateServiceList };
}
declare module "systemModule/*" {
  const module: any;
  export default module;
}

declare module "receptionModule/getStatusPrescribedServicesBadge" {
  export function getStatusPrescribedServicesBadge(...args: any[]): any;
}

declare module "receptionModule/useFetchPatientReceivedDetail" {
  export function useFetchPatientReceivedDetail(receptionId: string): any;
}

declare module "receptionModule/registrationReceptionInterface" {
  export interface IResponsePatientDetail {
    // Define the interface properties here
    data: any; // Replace with actual type structure
  }
}
