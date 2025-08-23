import { Series } from "../src/core/series";

describe("Series", () => {
  describe("basic structure", () => {
    it("should create a series", () => {
      const s = new Series([1, 2, 3]);
      expect(s.values).toEqual([1, 2, 3]);
      expect(s.length()).toBe(3);
    });

    it("should return head", () => {
      const s = new Series([1, 2, 3, 4, 5, 6]);
      expect(s.head(3).values).toEqual([1, 2, 3]);
    });

    it("should return tail", () => {
      const s = new Series([1, 2, 3, 4, 5, 6]);
      expect(s.tail(2).values).toEqual([5, 6]);
    });
  });

  describe("numerical methods", () => {
    const s = new Series([1, 2, 3, 4, 5]);

    it("should calculate sum", () => {
      expect(s.sum()).toBe(15);
    });

    it("should calculate max", () => {
      expect(s.max()).toBe(5);
    });

    it("should calculate min", () => {
      expect(s.min()).toBe(1);
    });

    it("should calculate mean", () => {
      expect(s.mean()).toBe(3);
    });

    it("should calculate median (odd length)", () => {
      expect(s.median()).toBe(3);
    });

    it("should calculate median (even length)", () => {
      const s2 = new Series([1, 2, 3, 4]);
      expect(s2.median()).toBe(2.5);
    });
  });

  describe("mode", () => {
    it("should calculate mode for numbers", () => {
      const s = new Series([1, 2, 2, 3, 3, 3, 4]);
      expect(s.mode()).toBe(3);
    });

    it("should calculate mode for strings", () => {
      const s = new Series(["apple", "banana", "apple", "cherry"]);
      expect(s.mode()).toBe("apple");
    });

    it("should return null for empty series", () => {
      const s = new Series([]);
      expect(s.mode()).toBeNull();
    });
  });

  describe("describe()", () => {
    it("should return statistical summary", () => {
      const s = new Series([1, 2, 3, 4, 5]);
      expect(s.describe()).toEqual({
        max: 5,
        min: 1,
        sum: 15,
        mean: 3,
        median: 3,
        mode: 1, // since all values are equally frequent, first one returned
      });
    });
  });
});
