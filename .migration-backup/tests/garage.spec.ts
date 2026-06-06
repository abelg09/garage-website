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

async function scrollHeroTo(page: import("@playwright/test").Page, multiplier: number) {
  await page.evaluate((amount) => {
    window.scrollTo(0, window.innerHeight * amount);
  }, multiplier);
  await page.waitForTimeout(500);
}

async function scrollHeroOpen(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>("[data-testid='hero-scroll']");
    if (!section) return;
    const stage = section.querySelector<HTMLElement>(".hero-stage");
    const stickyTop =
      Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;
    const stageHeight = stage?.offsetHeight ?? Math.max(1, window.innerHeight - stickyTop);
    const start = Math.max(0, section.offsetTop - stickyTop);
    const end = Math.max(start + 1, section.offsetTop + section.offsetHeight - stickyTop - stageHeight);
    window.scrollTo(0, start + (end - start) * 0.9);
  });
  await page.waitForTimeout(700);
}

async function heroCopyOpacity(page: import("@playwright/test").Page) {
  return page.getByTestId("hero-copy").evaluate((element) => Number(getComputedStyle(element).opacity));
}

test("garage facade starts closed and opens with scroll", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("garage-facade")).toBeVisible();
  await expect(page.getByTestId("garage-shutter")).toBeVisible();

  const initialShutter = await page.getByTestId("garage-shutter").boundingBox();
  const initialCameraTransform = await page
    .getByTestId("garage-camera")
    .evaluate((element) => getComputedStyle(element).transform);

  await scrollHeroTo(page, 1.55);

  const openedShutter = await page.getByTestId("garage-shutter").boundingBox();
  const movedCameraTransform = await page
    .getByTestId("garage-camera")
    .evaluate((element) => getComputedStyle(element).transform);

  expect(openedShutter?.y ?? 0).toBeLessThan((initialShutter?.y ?? 0) - 24);
  expect(movedCameraTransform).not.toBe(initialCameraTransform);

  await scrollHeroOpen(page);
  await expect.poll(() => heroCopyOpacity(page)).toBeGreaterThan(0.65);
  await expect(page.getByTestId("garage-origin-label")).toContainText(/where it all started/i);
  await expect(page.getByRole("heading", { name: /the original startup room/i })).toBeInViewport();

  await navigateToWork(page);
  await expect(page.locator("#work-title")).toBeInViewport();
});

test("work item expands inline", async ({ page }) => {
  await page.goto("/");
  await navigateToWork(page);
  await page.getByRole("button", { name: /grameen kulfi/i }).click();
  await expect(page.getByTestId("work-detail")).toContainText("Grameen Kulfi");
});

test("crew modal opens, cycles, and closes with keyboard", async ({ page }) => {
  await page.goto("/");
  await page.locator("#crew").scrollIntoViewIfNeeded();
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
  await expect(page.getByTestId("garage-facade")).toBeVisible();
  await expect.poll(() => heroCopyOpacity(page)).toBeGreaterThan(0.95);
  await expect(page.getByRole("heading", { name: /the original startup room/i })).toBeVisible();
  await context.close();
});

test("visual QA screenshots", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.screenshot({
    path: testInfo.outputPath(`garage-${testInfo.project.name}-hero-closed.png`),
    fullPage: false
  });

  await scrollHeroTo(page, 1.55);
  await page.screenshot({
    path: testInfo.outputPath(`garage-${testInfo.project.name}-hero-mid-open.png`),
    fullPage: false
  });

  await scrollHeroOpen(page);
  await expect.poll(() => heroCopyOpacity(page)).toBeGreaterThan(0.65);
  await page.screenshot({
    path: testInfo.outputPath(`garage-${testInfo.project.name}-hero-open.png`),
    fullPage: false
  });

  for (const section of ["#about", "#work", "#clients", "#crew", "#services", "#contact"]) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
  }

  await page.screenshot({
    path: testInfo.outputPath(`garage-${testInfo.project.name}-home.png`),
    fullPage: true
  });
});
