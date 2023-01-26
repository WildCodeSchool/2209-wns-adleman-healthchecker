import { UrlService } from "../services/UrlService";
import { describe, expect, test } from "@jest/globals";

describe("check if url writed by user is valid", () => {
  const UrlServices = new UrlService();
  test("good format Url return true", () => {
    expect(UrlServices.checkIfUrlIsValid("www.tata.fr")).toBe(true);
  });
});
