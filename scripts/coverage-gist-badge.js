/* eslint-disable @typescript-eslint/no-var-requires */
// import core from "@actions/core";
const core = require("@actions/core");
// import axios from "axios";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `token ${core.getInput("auth")}`
//   }
// };

const content = {
  schemaVersion: 1,
  label: core.getInput("label"),
  message: core.getInput("message"),
  color: "green"
};

const filename = core.getInput("filename");

const request = JSON.stringify({ files: { [filename]: { content: JSON.stringify(content) } } });

// await axios.post(
//   `https://gist.github.com/MadeleenRoestorff/${core.getInput("gistID")}/`,
//   request,
//   config
// );

console.log(request);
