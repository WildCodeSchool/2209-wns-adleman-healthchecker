import { test, expect } from "@playwright/test";
import database from "../../server/src/database";

test("can view form on homepage", async ({ page }) => {
  await database.initialize();

  await page.goto("/");

  await expect(page.getByTestId("form-URL")).toContainText(
    "Veuillez saisir une URL"
  );
});
