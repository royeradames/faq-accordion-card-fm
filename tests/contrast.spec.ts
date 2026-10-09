import { expect, test, type Locator } from "@playwright/test";

async function contrast(locator: Locator, property: "color" | "outlineColor" = "color") {
  return locator.evaluate((element, property) => {
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
      if (!channels || channels.length !== 3) throw new Error(`Unsupported computed color ${color}`);
      const linear = channels.map(channel => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const card = element.closest(".faq-card");
    if (!card) throw new Error("No card surface");
    const color = getComputedStyle(element)[property];
    const background = getComputedStyle(card).backgroundColor;
    const foregroundLuminance = luminance(color);
    const backgroundLuminance = luminance(background);
    return { color, background, ratio: (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05) };
  }, property);
}

test("expanded answers and hovered questions keep normal text contrast", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const detail of await page.locator("details").all()) {
      if (await detail.getAttribute("open") === null) await detail.locator("summary").click();
      const answer = await contrast(detail.locator("p"));
      expect.soft(answer.ratio, `answer at ${width}: ${JSON.stringify(answer)}`).toBeGreaterThanOrEqual(4.5);
      await detail.locator("summary").hover();
      const hover = await contrast(detail.locator("summary"));
      expect.soft(hover.ratio, `hover at ${width}: ${JSON.stringify(hover)}`).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test("keyboard focus ring has sufficient contrast against its card", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const summary = page.locator("summary").first();
  await expect(summary).toBeFocused();
  await expect(summary).toHaveCSS("outline-style", "solid");
  const ring = await contrast(summary, "outlineColor");
  expect(ring.ratio, JSON.stringify(ring)).toBeGreaterThanOrEqual(3);
});
