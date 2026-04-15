import { test, expect } from "@playwright/test";

test("main page has heading", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(
    page.getByRole("heading", { name: "Lightning Delivery" }).toBeVisible(),
  );
});

test("main page has password inputs", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByLabel("Jelszó")).toBeVisible();
  await expect(page.getByLabel("Jelszó megerősítése")).toBeVisible();

  await expect(page.locator("button", { name: "Regisztráció" })).toBeVisible();
});

test("should first", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.locator("input[name='password']").fill("password123");
  await page.locator("input[name='confirmPassword']").fill("password123");

  await page.locator("button", { name: "Bejelentkezés" }).click();

  await expect(
    page
      .getByRole("heading", { name: "Üdvözlünk a Lightning Delivery-ben!" })
      .toBeVisible(),
  );
});
