import { test, expect } from "@playwright/test";
import { connectToDb, disconnectFromDb, resetDB } from "./dbHelpers";

test.beforeAll(connectToDb);
test.beforeEach(resetDB);
test.afterAll(disconnectFromDb);

test("can view title on homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId(`title`)).toContainText("Texte d'accueil");
});
