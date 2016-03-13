"use strict";

const semver = require("semver"),
  fs = require("fs-extra");

const packageJsonDir = __dirname + "/../package.json";
const packageJson = fs.readJsonSync(packageJsonDir);

const newVersion = semver.inc(packageJson.version, "minor");

packageJson.version = newVersion;
fs.writeJsonSync(packageJsonDir, packageJson);