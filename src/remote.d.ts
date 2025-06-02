/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "category/*" {
  // Đảm bảo rằng bạn khai báo kiểu dữ liệu cho các module từ remote
  const value: any; // Thay `any` bằng kiểu dữ liệu phù hợp nếu bạn biết chính xác kiểu
  export default value;
}
