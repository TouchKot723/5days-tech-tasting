import {
  checkResource,
  checkResources,
  parseCliArgs,
  parseResourceLines,
} from "./resource_checker.ts";

function assert(condition: unknown, message = "Assertion failed"): asserts condition {
  if (!condition) throw new Error(message);
}

function assertEquals<T>(actual: T, expected: T): void {
  assert(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`,
  );
}

Deno.test("parses command-line arguments", () => {
  assertEquals(parseCliArgs(["--input", "in.txt", "--output", "out.json"]), {
    input: "in.txt",
    output: "out.json",
  });
});

Deno.test("ignores comments and blank lines", () => {
  assertEquals(parseResourceLines("# docs\n\nhttps://example.com\n"), ["https://example.com"]);
});

Deno.test("reports an HTTP error without throwing", async () => {
  const result = await checkResource(
    "https://example.com/missing",
    () => Promise.resolve(new Response("", { status: 404 })),
  );
  assertEquals(result.ok, false);
  assertEquals(result.status, 404);
  assertEquals(result.error, "HTTP 404");
});

Deno.test("continues after a failed request", async () => {
  const fakeFetch = (input: string | URL | Request) => {
    const url = String(input);
    return url.endsWith("/bad")
      ? Promise.reject(new Error("offline"))
      : Promise.resolve(new Response("ok", { status: 200 }));
  };
  const results = await checkResources(
    ["https://example.com/good", "https://example.com/bad"],
    fakeFetch,
  );
  assertEquals(results.map((result) => result.ok), [true, false]);
});
