import { readFileSync } from "fs";
import mlpd from "./mlpd.js";

mlpd.attach("greet", (value: string) => `Hello ${value}!`);

mlpd.attach("vomit", (value) => (value as Object).toString());
mlpd.attach("tryme", () => "Yay you tried me! 😎");

mlpd.attach("div", () => "<div>");
mlpd.attach("/div", () => "</div>");

console.log(mlpd.process(readFileSync("./input.md").toString()));
