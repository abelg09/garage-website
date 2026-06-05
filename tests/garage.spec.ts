import { expect, test } from "@playwright/test";

async function navigateToWork(page: import("@playwright/test").Page) {
  const desktopWorkLink = page.locator(".desktop-nav a[href='#work']");

  if (await desktopWorkLink.isVisible()) {
    await desktopWorkLink.click();
    return;
  }

  await page.getByRole("button", { name: "Open menu" }).click();
  await page.locator(".mobile-nav a[href='#work']").click();
}

test("garage door opens and anchor navigation reaches work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("garage-door")).toBeVisible();
  await page.getByTestId("garage-door").click();
  await expect(page.getByRole("heading", { name: /the original startup room/i })).toBeVisible();

  await navigateToWork(page);
  await expect(page.locator("#work-title")).toBeInViewport();
});

test("work item expands inline", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("garage-door").click();
  await page.getByRole("button", { name: /grameen kulfi/i }).click();
  await expect(page.getByTestId("work-detail")).toContainText("Grameen Kulfi");
});

test("crew modal opens, cycles, and closes with keyboard", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("garage-door").click();
  await page.getByTestId("crew-card-0").click();
  await expect(page.getByTestId("crew-modal")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("crew-modal")).toContainText("Swati Bobde");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("crew-modal")).toBeHidden();
});

test("reduced motion still exposes hero content", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByTestId("garage-door").click();
  await expect(page.getByRole("heading", { name: /the original startup room/i })).toBeVisible();
  await context.close();
});

test("visual QA screenshots", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByTestId("garage-door").click();
  await expect(page.getByTestId("garage-door")).toBeHidden();

  for (const section of ["#about", "#work", "#clients", "#crew", "#services", "#contact"]) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
  }

  await page.screenshot({
    path: testInfo.outputPath(`garage-${testInfo.project.name}-home.png`),
    fullPage: true
  });
});
