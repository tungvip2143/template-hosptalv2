/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Registry của các module imports để tránh hard code
 */
export const moduleImports: Record<string, () => Promise<any>> = {
  // systemModule: () => import("systemModule/locales"),
  receptionModule: () => import("receptionModule/locales"),
  categoryModule: () => import("categoryModule/locales"),
  // Thêm modules mới ở đây khi cần
  // newModule: () => import("newModule/locales"),
};

/**
 * Auto-register module nếu chưa có trong registry
 * @param moduleName - Tên module cần register
 */
export function autoRegisterModule(moduleName: string) {
  if (!moduleImports[moduleName]) {
    // Fallback: thử tạo dynamic import (có thể thất bại)
    moduleImports[moduleName] = () =>
      import(/* @vite-ignore */ `${moduleName}/locales`);
  }
}

/**
 * Helper function để register module mới một cách dễ dàng
 * @param moduleName - Tên module
 * @param importPath - Path để import (optional, default là `${moduleName}/locales`)
 */
export function registerModule(moduleName: string, importPath?: string) {
  const path = importPath || `${moduleName}/locales`;
  moduleImports[moduleName] = () => import(/* @vite-ignore */ path);
}
