import { beforeEach, describe, expect, it } from "vitest";
import { app, topics } from "../src/app";
import { escapeHtml } from "../src/view";

describe("topic board", () => {
  beforeEach(() => topics.splice(0, topics.length));

  it("escapes user input", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });

  it("adds a topic and returns the board", async () => {
    const response = await app.request("/topics", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "title=Learn+htmx",
    });
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Learn htmx");
    expect(topics).toHaveLength(1);
  });

  it("toggles an existing topic", async () => {
    topics.push({ id: 10, title: "Test", done: false });
    const response = await app.request("/topics/10/toggle", { method: "PATCH" });
    expect(response.status).toBe(200);
    expect(topics[0].done).toBe(true);
  });
});

