import { Window } from "./window";
window.onload = Window.onLoad;
// import * as monaco from "monaco-editor";
import "../assets/style.css";
// import "./index.slim";

// // @ts-ignore
// self.MonacoEnvironment = {
//   getWorkerUrl: function(moduleId, label) {
//     if (label === "json") {
//       return "./json.worker.bundle.js";
//     }
//     if (label === "css") {
//       return "./css.worker.bundle.js";
//     }
//     if (label === "html") {
//       return "./html.worker.bundle.js";
//     }
//     if (label === "typescript" || label === "javascript") {
//       return "./ts.worker.bundle.js";
//     }
//     return "./editor.worker.bundle.js";
//   }
// };

// window.onload = (ev) => {
//     console.log(document.getElementById("editor"));

//     monaco.editor.create(document.body, {
//         value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
//         language: "typescript"
//     });
// };