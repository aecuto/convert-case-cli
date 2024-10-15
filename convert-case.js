#!/usr/bin/env node

const args = require("args");
const fs = require("fs");
const path = require("path");
const { Case } = require("change-case-all");

args
  .option("file", "<config> Config file in JSON")
  .option("output", "<output> Output file in JSON")
  .option("help", "display help for command");

const flags = args.parse(process.argv, {
  version: false,
  help: false,
  name: "convert-case",
});

if (flags.h) {
  args.showHelp();
}

if (flags.f) {
  let obj;

  fs.readFile(path.resolve(flags.f), "utf8", function (err, data) {
    if (err) throw err;

    obj = JSON.parse(data);

    const newJson = convertCase(obj);

    fs.writeFile(
      path.resolve(flags.o || "output.json"),
      newJson,
      "utf8",
      function (err) {
        if (err) throw err;
      }
    );
  });
}

const convertCase = (obj) => {
  const newObj = obj.inputs.map((data) => {
    let text = "";
    const caseType = data.caseType || obj.defaultCaseType;
    const sensitive = data.sensitive || obj.defaultSensitive;

    if (caseType === "required" || sensitive === "required") {
      throw "default config is 'required'. Please check your json file";
    }

    switch (caseType) {
      case "camelCase":
        text = Case.camel(data.text);
        break;
      case "kebabCase":
        text = Case.kebab(data.text);
        break;
      case "snakeCase":
        text = Case.snake(data.text);
        break;
      default:
        break;
    }

    if (sensitive === "true") {
      text = "***";
    }

    return { text, caseType };
  });

  return JSON.stringify(newObj);
};
