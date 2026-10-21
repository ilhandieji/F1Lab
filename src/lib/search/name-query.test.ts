import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compareByNameQuery, nameQueryRank, searchTokens } from "./name-query.ts";

const jos = {
  name: "Jos Verstappen",
  fullName: "Johannes Franciscus Verstappen",
  firstName: "Johannes",
  lastName: "Verstappen",
  abbreviation: "VES",
  championshipWins: 0,
};

const max = {
  name: "Max Verstappen",
  fullName: "Max Emilian Verstappen",
  firstName: "Max",
  lastName: "Verstappen",
  abbreviation: "VER",
  championshipWins: 4,
};

describe("searchTokens", () => {
  it("splits a short name into words", () => {
    assert.deepEqual(searchTokens("  jos   verstappen "), ["jos", "verstappen"]);
  });
});

describe("nameQueryRank", () => {
  it("prefers the common name over a legal name that does not contain the typed phrase", () => {
    assert.equal(nameQueryRank(jos, "jos verstappen"), 350);
    assert.ok(nameQueryRank(jos, "jos verstappen") > nameQueryRank(max, "jos verstappen"));
  });

  it("ranks words split across the short first name and last name", () => {
    const abbreviated = {
      ...jos,
      name: "J. Verstappen",
      firstName: "Jos",
    };
    assert.equal(nameQueryRank(abbreviated, "jos verstappen"), 250);
  });

  it("ranks an exact driver code above a higher-title name prefix", () => {
    const prefix = {
      name: "Verstappen Fan",
      fullName: "Verstappen Fan",
      firstName: "Verstappen",
      lastName: "Fan",
      abbreviation: "HAM",
      championshipWins: 7,
    };
    assert.equal(nameQueryRank(max, "ver"), 400);
    assert.equal(nameQueryRank(prefix, "ver"), 220);
    assert.ok(nameQueryRank(max, "ver") > nameQueryRank(prefix, "ver"));
  });
});

describe("compareByNameQuery", () => {
  it("uses championships only after the name rank ties", () => {
    const otherVer = { ...max, name: "Other Ver", fullName: "Other Ver", championshipWins: 1 };
    const ranked = [otherVer, max].sort(compareByNameQuery("ver"));
    assert.equal(ranked[0]?.name, "Max Verstappen");
  });

  it("puts jos verstappen ahead of the higher-title verstappen", () => {
    const ranked = [max, jos].sort(compareByNameQuery("jos verstappen"));
    assert.equal(ranked[0]?.name, "Jos Verstappen");
  });

  it("puts the common name jos ahead of a legal name that only begins with jos", () => {
    const joseph = {
      name: "Gilles Villeneuve",
      fullName: "Joseph Gilles Henri Villeneuve",
      firstName: "Gilles",
      lastName: "Villeneuve",
      abbreviation: "VIL",
      championshipWins: 0,
    };
    const ranked = [joseph, jos].sort(compareByNameQuery("jos"));
    assert.equal(ranked[0]?.name, "Jos Verstappen");
  });
});
