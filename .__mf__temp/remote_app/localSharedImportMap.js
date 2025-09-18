
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    const importMap = {
      
        "@tanstack/react-query": async () => {
          let pkg = await import("__mf__virtual/remote_app__prebuild___mf_0_tanstack_mf_1_react_mf_2_query__prebuild__.js")
          return pkg
        }
      ,
        "react": async () => {
          let pkg = await import("__mf__virtual/remote_app__prebuild__react__prebuild__.js")
          return pkg
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/remote_app__prebuild__react_mf_2_dom__prebuild__.js")
          return pkg
        }
      ,
        "react-router": async () => {
          let pkg = await import("__mf__virtual/remote_app__prebuild__react_mf_2_router__prebuild__.js")
          return pkg
        }
      
    }
      const usedShared = {
      
          "@tanstack/react-query": {
            name: "@tanstack/react-query",
            version: "5.89.0",
            scope: ["default"],
            loaded: false,
            from: "remote_app",
            async get () {
              usedShared["@tanstack/react-query"].loaded = true
              const {"@tanstack/react-query": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^5.75.4"
            }
          }
        ,
          "react": {
            name: "react",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "remote_app",
            async get () {
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^18.3.1"
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "remote_app",
            async get () {
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^18.3.1"
            }
          }
        ,
          "react-router": {
            name: "react-router",
            version: "7.6.0",
            scope: ["default"],
            loaded: false,
            from: "remote_app",
            async get () {
              usedShared["react-router"].loaded = true
              const {"react-router": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^7.6.0"
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      