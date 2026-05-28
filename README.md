# HIS Service Seed

`template-hosptalv2` là repo seed để tạo các micro-frontend service mới trong hệ HIS.

Mục tiêu của template này là bám theo phần khung đang dùng chung ở các repo service runtime hiện tại:

- Vite + React + TypeScript
- `@pnkx-lib/core`, `@pnkx-lib/ui`, `@pnkx-lib/icon`
- Module Federation remote app
- `routeManifest` + `DefaultLayoutCommon`
- auth bootstrap + token sync/refresh
- runtime feature flags
- i18n local

## Các file cần đổi ngay sau khi clone

- `src/app.config.ts`
  - `displayName`
  - `standaloneMenuTitle`
  - `remoteName`
  - `runtimeModule`
  - `basePath`
  - `defaultRoute`
  - `devPort`
  - `previewPort`
- `src/router/routeManifest.tsx`
  - route thật của service
  - menu thật của service
- `vite.config.ts`
  - `exposes` nếu service cần export thêm module federation entry
- `src/features/flags/*`
  - runtime flags của service
- `pnkx-ui/packages/scripts/src/repo-registry.json` ở workspace root
  - thêm service mới vào registry trung tâm
  - sau đó chạy `pnkx-scripts service-registry validate`
  - có thể sinh nhanh `src/app.config.ts` bằng `pnkx-scripts service-registry app-config --repo <service-repo> --target <repo>/src/app.config.ts --write`
- nếu muốn bootstrap gần như tự động, ưu tiên dùng `pnkx-scripts new-service --repo <service-repo> --module <module> --write`
- nếu muốn ít nhập tham số nhất, dùng `pnkx-scripts new-service wizard`
- flow này sẽ tự `git init`, tạo branch theo branch hiện tại của workspace hoặc fallback `staging`, rồi tạo commit bootstrap đầu tiên

## Scripts chính

- `npm run go`
- `npm run dev:remote`
- `npm run dev:local`
- `npm run dev:hybrid`
- `npm run sync-locales`
- `npm run generate-feature-flag-keys`
- `npm run generate-feature-flag-manifest`
- `npm run sync-feature-flags`

## Lưu ý

- Template này chỉ giữ phần khung chung, không hardcode route/domain của một service cụ thể.
- Các remote dependency thực tế của service mới nên được thêm sau khi clone, không nhét sẵn vào seed.
