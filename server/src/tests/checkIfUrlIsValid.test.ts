import { UrlService } from "../services/UrlService";
import { describe, expect, test } from "@jest/globals";

describe("check if url writed by user is valid", () => {
  const UrlServices = new UrlService();
  test("good format Url return true", () => {
    expect(UrlServices.checkIfUrlIsValid("www.tata.fr")).toBe(true);
  });
  test("good format Url with protocol return true", () => {
    expect(UrlServices.checkIfUrlIsValid("http://www.tata.fr")).toBe(true);
  });
  test("good format Url with protocol secure return true", () => {
    expect(UrlServices.checkIfUrlIsValid("https://www.tata.fr")).toBe(true);
  });
  test("bad format Url with only one w return false", () => {
    expect(UrlServices.checkIfUrlIsValid("w.tata.fr")).toBe(false);
  });
});
