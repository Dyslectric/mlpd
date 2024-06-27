import { readFileSync } from "fs";
import mlpd from "./mlpd.js";
mlpd.attach("greet", (value) => `Hello ${value}!`);
mlpd.attach("vomit", (value) => value.toString());
mlpd.attach("tryme", () => "Yay you tried me! 😎");
mlpd.attach("div", () => "<div>");
mlpd.attach("/div", () => "</div>");
console.log(mlpd.process(readFileSync("./input.md").toString()));
//# sourceMappingURL=test.js.map