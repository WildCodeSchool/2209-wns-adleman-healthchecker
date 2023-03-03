import { test, expect } from "@playwright/test";
import { connectToDb, disconnectFromDb, resetDB } from "./dbHelpers";

test.beforeAll(connectToDb);
test.beforeEach(resetDB);
test.afterAll(disconnectFromDb);

test("addUrl", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId(`form-home-input`).fill("www.toto.fr");
  await page.getByTestId(`form-home-btn`).click();
  await expect(page.getByTestId(`home-urlList`)).toContainText("www.toto.fr");
});
