import { Series } from "../src/core/series";

describe("Series", () => {
  describe("Basic Structure and Accessors", () => {
    it("should create a new series and store values", () => {
      const s = new Series([1, "a", null]);
      expect(s.values).toEqual([1, "a", null]);
    });

    it("should allow index-based access to values via proxy", () => {
      const s = new Series([10, 20, 30]);
      // Note: This is a proxy access, not a direct property
      expect((s as any)[0]).toBe(10);
      expect((s as any)[1]).toBe(20);
      expect((s as any)[2]).toBe(30);
    });

    it("should return the correct length", () => {
      const s = new Series([1, 2, 3, 4]);
      expect(s.length()).toBe(4);
    });

    it("should be immutable", () => {
      const s = new Series([1, 2, 3]);
      expect(() => {
        (s as any)[0] = 100;
      }).toThrow("Direct assignment to Series values is not allowed.");
    });
  });

  describe("head() and tail()", () => {
    const s = new Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    it("should return the first n elements for head()", () => {
      const head = s.head(3);
      expect(head.values).toEqual([1, 2, 3]);
    });

    it("should return the last n elements for tail()", () => {
      const tail = s.tail(4);
      expect(tail.values).toEqual([7, 8, 9, 10]);
    });

    it("should use default value of 5 if n is not provided", () => {
        expect(s.head().values).toEqual([1, 2, 3, 4, 5]);
        expect(s.tail().values).toEqual([6, 7, 8, 9, 10]);
    });
  });

  describe("Descriptive Methods", () => {
    it("should return correct info", () => {
        const s = new Series([1, 2, 3]);
        const info = s.info();
        expect(info.length).toBe(3);
        expect(info.type).toBe("number");
        // A simple check, not for exact value
        expect(info.estimatedMemoryUsage).toBeDefined();
    });

    it("should handle info for an empty series", () => {
        const s = new Series([]);
        const info = s.info();
        expect(info.length).toBe(0);
        expect(info.type).toBe("undefined");
        expect(info.estimatedMemoryUsage).toBe("0.00 KB");
    });
  });

  describe("Statistical Methods", () => {
    const numericSeries = new Series([1, 2, 3, 4, 5]);
    const nonNumericSeries = new Series(["a", "b", "c"]);
    const emptySeries = new Series([]);

    it("should calculate sum correctly", () => {
      expect(numericSeries.sum()).toBe(15);
      expect(nonNumericSeries.sum()).toBeNull();
      expect(emptySeries.sum()).toBe(0);
    });

    it("should find max value correctly", () => {
      expect(numericSeries.max()).toBe(5);
      expect(nonNumericSeries.max()).toBeNull();
    });

    it("should find min value correctly", () => {
      expect(numericSeries.min()).toBe(1);
      expect(nonNumericSeries.min()).toBeNull();
    });

    it("should calculate mean correctly", () => {
      expect(numericSeries.mean()).toBe(3);
      expect(nonNumericSeries.mean()).toBeNull();
      expect(emptySeries.mean()).toBeNull();
    });

    it("should calculate median for odd-length series", () => {
      expect(numericSeries.median()).toBe(3);
    });

    it("should calculate median for even-length series", () => {
      const s = new Series([1, 2, 8, 10]);
      expect(s.median()).toBe(5);
    });

    it("should calculate mode correctly", () => {
      const s = new Series([1, 2, 2, 3, 4, 4, 4]);
      expect(s.mode()).toBe(4);
      const s2 = new Series(["apple", "banana", "apple"]);
      expect(s2.mode()).toBe("apple");
      expect(emptySeries.mode()).toBeNull();
    });

    it("should return a full description for numeric series", () => {
        const s = new Series([1, 2, 2, 3, 4, 5]);
        expect(s.describe()).toEqual({
            max: 5,
            min: 1,
            sum: 17,
            mean: 17 / 6,
            median: 2.5,
            mode: 2,
        });
    });
  });

  describe("Utility Methods", () => {
    it("should return unique values", () => {
      const s = new Series([1, "a", 2, "a", 1, 3]);
      expect(s.unique().values).toEqual([1, "a", 2, 3]);
    });

    it("should return correct value counts", () => {
      const s = new Series(["a", "b", "c", "a", "a", "d"]);
      const counts = s.valueCounts();
      expect(counts).toEqual({
        a: 3,
        b: 1,
        c: 1,
        d: 1,
      });
    });

     it("should return value counts in descending order by default", () => {
      const s = new Series(["b", "c", "a", "a", "a", "d"]);
      const counts = s.valueCounts();
      // Object.keys preserves insertion order for non-integer keys
      // The implementation sorts before creating the object, so this should be reliable.
      expect(Object.keys(counts)).toEqual(["a", "b", "c", "d"]);
    });

    it("should return value counts in original order if desc is false", () => {
      const s = new Series(["c", "b", "a", "a", "a"]);
      const counts = s.valueCounts(false);
       expect(Object.keys(counts)).toEqual(["c", "b", "a"]);
    });
  });
});
