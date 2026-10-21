import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { localeHref } from "./locale-href.ts";

describe("localeHref", () => {
  it("keeps English season URLs unprefixed and copies the query", () => {
    assert.equal(localeHref("en", "/grid/2025", "tab=activity"), "/grid/2025?tab=activity");
  });

  it("prefixes the same season page for Persian", () => {
    assert.equal(localeHref("fa", "/grid/2025", "tab=activity"), "/fa/grid/2025?tab=activity");
  });

  it("maps the Persian home to /fa and the English home to /", () => {
    assert.equal(localeHref("fa", "/"), "/fa");
    assert.equal(localeHref("en", "/"), "/");
    assert.equal(localeHref("en", "/fa"), "/");
  });

  it("strips a Persian prefix and keeps driver query params", () => {
    assert.equal(
      localeHref("en", "/fa/driver/max-verstappen", "season=2024&tab=races"),
      "/driver/max-verstappen?season=2024&tab=races",
    );
  });

  it("adds the Persian prefix to a driver page and keeps the hash", () => {
    assert.equal(
      localeHref("fa", "/driver/max-verstappen", "?season=2024&tab=races", "#results"),
      "/fa/driver/max-verstappen?season=2024&tab=races#results",
    );
  });

  it("falls back to the locale home when the path is empty", () => {
    assert.equal(localeHref("en", "   "), "/");
    assert.equal(localeHref("fa", ""), "/fa");
  });
});
