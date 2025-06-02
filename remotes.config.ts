/* eslint-disable @typescript-eslint/no-explicit-any */

const remoteNames = ["category"];

export const getRemotes = (
  mode: string,
  env: Record<string, string>
): Record<string, any> => {
  const isProd = mode === "production";

  const domain = env.VITE_CATEGORY_MODULE;

  const remotes: Record<string, any> = {};

  remoteNames.forEach((name, index) => {
    const port = 8001 + index;
    const entryFile = `remoteEntry.js`;
    const url = isProd
      ? `${domain}/${name}/${entryFile}`
      : `${domain}:${port}/${entryFile}`;

    remotes[name] = {
      type: "module",
      name,
      entry: url,
    };
  });
  return remotes;
};
