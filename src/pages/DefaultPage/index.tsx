import { APP_CONFIG } from "@src/app.config";

const DefaultPage = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
          Seed Repo
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          {APP_CONFIG.displayName}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Repo này đã được scaffold theo khung chung của các HIS service hiện tại.
          Khi clone sang service mới, hãy đổi app config, route manifest, feature
          flags và các module federation exposes phù hợp với domain thực tế.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Remote Name
            </p>
            <p className="mt-2 font-mono text-sm text-slate-900">
              {APP_CONFIG.remoteName}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Default Route
            </p>
            <p className="mt-2 font-mono text-sm text-slate-900">
              {APP_CONFIG.defaultRoute}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Runtime Module
            </p>
            <p className="mt-2 font-mono text-sm text-slate-900">
              {APP_CONFIG.runtimeModule}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Base Path
            </p>
            <p className="mt-2 font-mono text-sm text-slate-900">
              {APP_CONFIG.basePath}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;
