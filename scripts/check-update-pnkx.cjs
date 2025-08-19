#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

async function checkAndUpdatePnkx() {
  try {
    console.log("🔍 Checking for PNKX library updates...");

    const packages = ["@pnkx-lib/ui", "@pnkx-lib/core", "@pnkx-lib/icon"];
    const toUpdate = [];

    for (const pkg of packages) {
      // Get current version from package.json
      const packageJsonPath = path.resolve(__dirname, "..", "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const currentVersion =
        packageJson.dependencies[pkg]?.replace("^", "") || "not found";

      // Get latest version from registry
      const latestOutput = execSync(`npm view ${pkg} version`, {
        encoding: "utf8",
        stdio: "pipe",
      });
      const latestVersion = latestOutput.trim();

      console.log(`📦 ${pkg}: ${currentVersion} → ${latestVersion}`);

      if (currentVersion !== latestVersion) {
        toUpdate.push(pkg);
      }
    }

    if (toUpdate.length > 0) {
      console.log("🔄 Updating:", toUpdate.join(", "));

      for (const pkg of toUpdate) {
        execSync(`npm install --save ${pkg}@latest`, {
          stdio: "inherit",
          cwd: path.resolve(__dirname, ".."),
        });
      }

      console.log("✅ PNKX libraries updated successfully!");
    } else {
      console.log("✅ PNKX libraries are already up to date");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run if called directly
if (require.main === module) {
  checkAndUpdatePnkx().catch(console.error);
}

module.exports = { checkAndUpdatePnkx };
