import yaml from "js-yaml";

export type MlProcHook = (
  value: string | Object | any[] | undefined | void,
) => string;

const hooks: Map<string, MlProcHook> = new Map<string, MlProcHook>();

function attach(key: string, hook: MlProcHook) {
  hooks.set(key, hook);
}

function getYamlSubstring(
  position: number,
  input: string,
): { start: number; end: number } | undefined {
  let openerIndex = input.indexOf("#[", position);

  // no more yaml blocks
  if (openerIndex == -1) {
    return undefined;
  }

  const start = openerIndex + 2;
  let end = start;
  let stack = 0;

  Array.from(input.substring(start)).every((char, index) => {
    if (char == "[" && input.at(index - 1) != "\\") stack++;
    if (char == "]" && input.at(index - 1) != "\\") {
      if (stack > 0) stack--;
      else {
        end = start + index;
        return false;
      }
    }

    return true;
  });

  if (end == start) {
    console.log(
      `There's supposed to be a closing bracket somewhere after character index ${start - 1}.`,
    );

    return undefined;
  }

  return { start, end };
}

const process = (input: string) => {
  let searchIndex = 0;
  let yamlRange = getYamlSubstring(searchIndex, input);
  let output = "";

  while (yamlRange) {
    output += input.substring(searchIndex, yamlRange.start - 2);

    const yamlObj = yaml.load(
      input.substring(yamlRange.start, yamlRange.end).trim(),
    );

    if (typeof yamlObj == "string") {
      const hook = hooks.get(yamlObj);
      output += hook ? hook() : "";
    } else if (typeof yamlObj == "object") {
      Object.entries(yamlObj).forEach(([key, value]) => {
        const hook = hooks.get(key);
        output += hook ? hook(value) : "";
      });
    }

    searchIndex = yamlRange.end + 1;
    yamlRange = getYamlSubstring(searchIndex, input);
  }

  output += input.substring(searchIndex);

  return output;
};

const mlpd = {
  attach,
  process,
};

export default mlpd;
