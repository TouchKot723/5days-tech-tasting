import { checkResources, parseCliArgs, parseResourceLines } from "./resource_checker.ts";

try {
  const options = parseCliArgs(Deno.args);
  const source = await Deno.readTextFile(options.input);
  const urls = parseResourceLines(source);
  if (urls.length === 0) throw new Error("The input file contains no URLs");

  const results = await checkResources(urls);
  await Deno.writeTextFile(options.output, `${JSON.stringify(results, null, 2)}\n`);
  const passed = results.filter((result) => result.ok).length;
  console.log(`${passed}/${results.length} resources are reachable. Report: ${options.output}`);
  if (passed !== results.length) Deno.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  Deno.exitCode = 1;
}
