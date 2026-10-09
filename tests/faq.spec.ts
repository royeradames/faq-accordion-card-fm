import { expect, test, type Page } from "@playwright/test";

const questions = [
  "How many team members can I invite?",
  "What is the maximum file upload size?",
  "How do I reset my password?",
  "Can I cancel my subscription?",
  "Do you provide additional support?",
];
const item = (page: Page, question: string) => page.locator("details").filter({ has: page.locator("summary", { hasText: question }) });
const isOpen = (page: Page, question: string) => item(page, question).evaluate(element => (element as HTMLDetailsElement).open);

test("renders the FAQ title, five supplied questions and the design's open item", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("FAQ accordion card | Royer Adames");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "FAQ" })).toBeVisible();
  await expect(page.locator("summary")).toHaveText(questions);
  expect(await isOpen(page, questions[1])).toBe(true);
  await expect(page.getByText("No more than 2GB. All files in your account must fit your allotted storage space.")).toBeVisible();
  await expect(page.getByText("Yes! Send us a message and we’ll process your request no questions asked.")).toBeHidden();
  for (const image of await page.locator("img:visible").all()) {
    expect(await image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
  }
});

test("opens one answer at a time by mouse, with the design's open and hover states", async ({ page }) => {
  await page.goto("/");
  const first = item(page, questions[0]).locator("summary");
  await first.hover();
  await expect(first).toHaveCSS("color", "rgb(186, 76, 42)");
  await first.click();
  expect(await isOpen(page, questions[0])).toBe(true);
  expect(await isOpen(page, questions[1])).toBe(false);
  await page.mouse.move(0, 0);
  await expect(first).toHaveCSS("color", "rgb(30, 31, 54)");
  await expect(first).toHaveCSS("font-weight", "700");
  await expect(first.locator(".arrow")).toHaveCSS("transform", "matrix(-1, 0, 0, -1, 0, 0)");
  await expect(item(page, questions[1]).locator("summary")).toHaveCSS("font-weight", "400");
  await first.click();
  expect(await isOpen(page, questions[0])).toBe(false);
  await expect(page.locator("details[open]")).toHaveCount(0);
});

test("works by keyboard: Tab reaches each question, Enter and Space toggle in place", async ({ page }) => {
  await page.goto("/");
  for (const question of questions) {
    await page.keyboard.press("Tab");
    await expect(item(page, question).locator("summary")).toBeFocused();
  }
  const last = item(page, questions[4]).locator("summary");
  await expect(last).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  expect(await isOpen(page, questions[4])).toBe(true);
  expect(await isOpen(page, questions[1])).toBe(false);
  await expect(page.getByText("Chat and email support is available 24/7. Phone lines are open during normal business hours.")).toBeVisible();
  await page.keyboard.press("Space");
  expect(await isOpen(page, questions[4])).toBe(false);
  await expect(last).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Space");
  expect(await isOpen(page, questions[3])).toBe(true);
});

test("follows the mobile and desktop frames, with the box breaking out of the desktop card", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 1131 });
  await page.goto("/");
  const card = page.locator(".faq-card");
  const mobileCard = await card.boundingBox();
  const woman = await page.locator(".woman-mobile").boundingBox();
  expect(mobileCard!.width).toBeCloseTo(327, 0);
  expect(woman!.width).toBeCloseTo(237, 0);
  expect(mobileCard!.y - woman!.y).toBeCloseTo(108, 0);
  expect(woman!.x - mobileCard!.x).toBeCloseTo(45, 0);
  await expect(page.locator(".box")).toBeHidden();
  await expect(page.locator("h1")).toHaveCSS("text-align", "center");

  await page.setViewportSize({ width: 1440, height: 800 });
  const desktopCard = await card.boundingBox();
  expect(desktopCard!.width).toBeCloseTo(920, 0);
  expect(desktopCard!.height).toBeGreaterThanOrEqual(509);
  const box = await page.locator(".box").boundingBox();
  expect(box!.x).toBeLessThan(desktopCard!.x);
  await expect(page.locator(".art")).toHaveCSS("overflow", "hidden");
  const desktopWoman = await page.locator(".woman-desktop").boundingBox();
  expect(desktopWoman!.x - desktopCard!.x).toBeCloseTo(-84, 0);
  const title = await page.locator("h1").boundingBox();
  expect(title!.x - desktopCard!.x).toBeCloseTo(475, 0);
  expect((await page.locator(".accordion").boundingBox())!.width).toBeCloseTo(350, 0);
});

test("fits from 320 to 1440 with no overflow, 16px text and 44px targets", async ({ page }) => {
  for (const width of [320, 375, 400, 640, 768, 1024, 1120, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const box = page.locator(".box");
    if (await box.isVisible()) expect((await box.boundingBox())!.x).toBeGreaterThanOrEqual(0);
    const smallText = await page.locator("h1, summary, details p, footer, footer a").evaluateAll(elements =>
      elements.filter(element => element.getClientRects().length > 0 && parseFloat(getComputedStyle(element).fontSize) < 16).map(element => element.textContent));
    expect(smallText).toEqual([]);
    for (const control of await page.locator("a, summary").all()) {
      expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }
  }
  await page.setViewportSize({ width: 400, height: 700 });
  // The gradient belongs to the page, not the viewport: it must cover the bottom of a page taller than the screen.
  expect(await page.evaluate(() => document.body.getBoundingClientRect().height >= document.documentElement.scrollHeight - 1)).toBe(true);
  await expect(page.locator("body")).toHaveCSS("background-attachment", "scroll");
  await page.setViewportSize({ width: 640, height: 900 });
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("declares one site name in the footer, og:site_name and WebSite JSON-LD", async ({ page }) => {
  await page.goto("/");
  const visible = await page.locator("footer .site-name").textContent();
  expect(visible).toBe("FAQ accordion card");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", visible!);
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: visible, url: "https://faq-accordion-card-fm.royeradames.com/" });
});

test("the accordion works with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:4537/");
    await item(page, questions[2]).locator("summary").click();
    await expect(page.getByText("Click “Forgot password” from the login page or “Change password” from your profile page. A reset link will be emailed to you.")).toBeVisible();
    expect(await isOpen(page, questions[1])).toBe(false);
  } finally {
    await context.close();
  }
});
