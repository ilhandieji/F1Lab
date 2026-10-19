import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  driverPortraitUrl,
  resolveDriverPortraitUrl,
  selectDriverPortraitObjectKey,
} from "./driver-photos.ts";

const verstappen = [
  { seasonKey: "2026", objectKey: "drivers/max-verstappen/2026/portrait.webp" },
  { seasonKey: "2018", objectKey: "drivers/max-verstappen/2018/portrait.webp" },
  { seasonKey: "default", objectKey: "drivers/max-verstappen/default/portrait.webp" },
];

const originalBase = process.env.NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL;

afterEach(() => {
  if (originalBase === undefined) {
    delete process.env.NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL;
  } else {
    process.env.NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL = originalBase;
  }
});

describe("selectDriverPortraitObjectKey", () => {
  it("uses the exact season portrait when that year exists", () => {
    assert.equal(
      selectDriverPortraitObjectKey(verstappen, 2026),
      "drivers/max-verstappen/2026/portrait.webp",
    );
    assert.equal(
      selectDriverPortraitObjectKey(verstappen, 2018),
      "drivers/max-verstappen/2018/portrait.webp",
    );
  });

  it("uses the default portrait when the exact season is missing", () => {
    assert.equal(
      selectDriverPortraitObjectKey(verstappen, 2017),
      "drivers/max-verstappen/default/portrait.webp",
    );
  });

  it("does not use another season when neither the exact year nor default exists", () => {
    const seasonOnly = verstappen.filter((portrait) => portrait.seasonKey !== "default");
    assert.equal(selectDriverPortraitObjectKey(seasonOnly, 2017), null);
    assert.equal(
      selectDriverPortraitObjectKey(seasonOnly, 2018),
      "drivers/max-verstappen/2018/portrait.webp",
    );
  });

  it("keeps each year on its own object key when several portraits exist", () => {
    assert.notEqual(
      selectDriverPortraitObjectKey(verstappen, 2026),
      selectDriverPortraitObjectKey(verstappen, 2018),
    );
  });

  it("uses the only default portrait for any season", () => {
    const portraits = [{ seasonKey: "default", objectKey: "drivers/michael-schumacher/default/portrait.webp" }];
    assert.equal(
      selectDriverPortraitObjectKey(portraits, 2004),
      "drivers/michael-schumacher/default/portrait.webp",
    );
    assert.equal(
      selectDriverPortraitObjectKey(portraits, null),
      "drivers/michael-schumacher/default/portrait.webp",
    );
  });

  it("returns null when the driver has no portrait records", () => {
    assert.equal(selectDriverPortraitObjectKey([], 2026), null);
    assert.equal(selectDriverPortraitObjectKey([], null), null);
  });
});

describe("resolveDriverPortraitUrl", () => {
  it("combines season selection and public URL building", () => {
    process.env.NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL = "https://media.example";
    assert.equal(
      resolveDriverPortraitUrl(verstappen, 2026),
      "https://media.example/drivers/max-verstappen/2026/portrait.webp",
    );
    assert.equal(
      resolveDriverPortraitUrl(verstappen, 2017),
      "https://media.example/drivers/max-verstappen/default/portrait.webp",
    );
    assert.equal(resolveDriverPortraitUrl([], 2026), null);
  });
});

describe("driverPortraitUrl", () => {
  it("returns null when no portrait was selected, which keeps the abbreviation fallback", () => {
    process.env.NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL = "https://media.example";
    assert.equal(driverPortraitUrl(selectDriverPortraitObjectKey([], 2026)), null);
    assert.equal(driverPortraitUrl(null), null);
    assert.equal(driverPortraitUrl("   "), null);
  });

  it("joins the base URL and object key with a single slash", () => {
    process.env.NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL = "https://media.example/";
    assert.equal(
      driverPortraitUrl("/drivers/max-verstappen/2026/portrait.webp"),
      "https://media.example/drivers/max-verstappen/2026/portrait.webp",
    );
  });

  it("returns null when the base URL is unset", () => {
    delete process.env.NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL;
    assert.equal(driverPortraitUrl("drivers/max-verstappen/default/portrait.webp"), null);
  });
});
