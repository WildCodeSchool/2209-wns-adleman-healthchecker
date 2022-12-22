import { test, expect } from "@playwright/test";
import database from "../../server/src/database";

test("can view form on homepage", async ({ page }) => {
  await database.initialize();

  await page.goto("/");
  await page.getByLabel("Saisir l'URL *").click();
  await page.getByLabel("Saisir l'URL *").fill("https://www.facebook.com");
  await page.getByTestId("form-button-test").click();
});
