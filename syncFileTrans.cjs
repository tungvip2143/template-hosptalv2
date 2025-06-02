"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chokidar = require("chokidar");
var fs = require("fs-extra");
var sourceDir = "./src/locales/vi";
var destinationDir = "./src/locales/en";
var watcher = chokidar.watch(sourceDir, {
  persistent: true,
  ignoreInitial: true,
});
watcher.on("change", function (filePath) {
  var fileName = filePath.split("vi/")[1];
  var destPath = "".concat(destinationDir, "/").concat(fileName);
  fs.copy(filePath, destPath)
    .then(function () {
      return console.log(
        "File ".concat(fileName, " updated in ").concat(destinationDir)
      );
    })
    .catch(function (err) {
      return console.error("Error copying file: ".concat(err));
    });
});
watcher.on("add", function (filePath) {
  var fileName = filePath.split("vi/")[1];
  var destPath = "".concat(destinationDir, "/").concat(fileName);
  // Copy the new file from source to destination
  fs.copyFile(filePath, destPath)
    .then(function () {
      return console.log(
        "File ".concat(fileName, " added to ").concat(destinationDir)
      );
    })
    .catch(function (err) {
      return console.error("Error copying file: ".concat(err));
    });
});
watcher.on("unlink", function (filePath) {
  var fileName = filePath.split("vi/")[1];
  var sourceFilePath = "".concat(destinationDir, "/").concat(fileName);
  // Remove the corresponding file from source directory
  fs.unlink(sourceFilePath)
    .then(function () {
      return console.log(
        "File ".concat(fileName, " removed from ").concat(sourceDir)
      );
    })
    .catch(function (err) {
      return console.error("Error removing file: ".concat(err));
    });
});
console.log("Watching ".concat(sourceDir, " for changes..."));
