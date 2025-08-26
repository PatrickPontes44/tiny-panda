import { DataFrame } from "../src/core/dataframe";
import { Series } from "../src/core/series";

describe("DataFrame", () => {
  describe("Constructor", () => {
    it("should create a DataFrame from an array of objects", () => {
      const data = [{ a: 1, b: 2 }, { a: 3, b: 4 }];
      const df = new DataFrame(data);
      expect(df.columns["a"].values).toEqual([1, 3]);
      expect(df.columns["b"].values).toEqual([2, 4]);
    });

    it("should create a DataFrame from an object of arrays", () => {
      const data = { a: [1, 3], b: [2, 4] };
      const df = new DataFrame(data);
      expect(df.columns["a"].values).toEqual([1, 3]);
      expect(df.columns["b"].values).toEqual([2, 4]);
    });

    it("should throw an error for inconsistent keys in array of objects", () => {
      const data = [{ a: 1, b: 2 }, { a: 3, c: 4 }];
      expect(() => new DataFrame(data)).toThrow("DataFrame constructor: all objects must have the same keys.");
    });

    it("should throw an error for inconsistent lengths in object of arrays", () => {
      const data = { a: [1, 3], b: [2, 4, 6] };
      expect(() => new DataFrame(data)).toThrow("DataFrame constructor: all arrays must have the same length.");
    });
    
    it("should throw an error for empty input", () => {
        expect(() => new DataFrame([])).toThrow("DataFrame constructor: expected a non-empty array of objects.");
        expect(() => new DataFrame({})).toThrow("DataFrame constructor: object must have at least one key.");
    });
  });

  describe("Basic Properties and Accessors", () => {
    const df = new DataFrame({ a: [1, 2, 3], b: ["x", "y", "z"] });

    it("should return the correct shape", () => {
      expect(df.shape()).toEqual([3, 2]);
    });

    it("should return the correct length (number of rows)", () => {
      expect(df.length()).toBe(3);
    });

    it("should return the correct number of columns", () => {
      expect(df.numColumns()).toBe(2);
    });

    it("should return the correct column names", () => {
      expect(df.columnNames()).toEqual(["a", "b"]);
    });

    it("should allow column access via proxy", () => {
      const colA = (df as any).a;
      expect(colA).toBeInstanceOf(Series);
      expect(colA.values).toEqual([1, 2, 3]);
    });

    it("should be immutable", () => {
        expect(() => {
          (df as any).a = new Series([9, 8, 7]);
        }).toThrow("Direct assignment to Dataframe value is not allowed.");
    });
  });

  describe("head() and tail()", () => {
    const df = new DataFrame({
      a: [1, 2, 3, 4, 5, 6, 7],
      b: [..."abcdefg"],
    });

    it("should return the first n rows for head()", () => {
      const head = df.head(3);
      expect(head.shape()).toEqual([3, 2]);
      expect(head.columns["a"].values).toEqual([1, 2, 3]);
    });

    it("should return the last n rows for tail()", () => {
      const tail = df.tail(2);
      expect(tail.shape()).toEqual([2, 2]);
      expect(tail.columns["b"].values).toEqual(["f", "g"]);
    });
  });

  describe("Indexing: iloc() and loc()", () => {
    const df = new DataFrame({ name: ["A", "B", "C"], value: [10, 20, 30] });

    it("should retrieve a single value with iloc", () => {
      expect(df.iloc(1, 1)).toBe(20); // Row 1, Column 1
    });

    it("should retrieve an entire row with iloc", () => {
      expect(df.iloc(0)).toEqual({ name: "A", value: 10 });
    });

    it("should retrieve a single value with loc", () => {
      expect(df.loc(2, "name")).toBe("C"); // Row 2, Column "name"
    });

    it("should throw error for out-of-bounds loc index", () => {
        expect(() => df.loc(5, "name")).toThrow("Row index 5 out of range");
    });
  });

  describe("Statistical & Utility Methods", () => {
    const df = new DataFrame({
      A: [1, 2, 3, 4, 5],
      B: [10, 20, 20, 30, 30],
      C: ["foo", "bar", "foo", "baz", "bar"],
    });

    it("should calculate sum for all numeric columns", () => {
      const sums = df.sum() as Record<string, number | null>;
      expect(sums["A"]).toBe(15);
      expect(sums["B"]).toBe(110);
      expect(sums["C"]).toBeNull();
    });

    it("should calculate sum for a single column", () => {
      expect(df.sum("A")).toBe(15);
    });

    it("should calculate mean for all numeric columns", () => {
        const means = df.mean() as Record<string, number | null>;
        expect(means["A"]).toBe(3);
        expect(means["B"]).toBe(22);
        expect(means["C"]).toBeNull();
    });

    it("should return a description of all numeric columns", () => {
        const desc = df.describe() as Record<string, any>;
        expect(desc.max.A).toBe(5);
        expect(desc.min.B).toBe(10);
        expect(desc.median.A).toBe(3);
    });

    it("should return value counts for a specific column", () => {
        const counts = df.valueCounts("C") as Record<any, number>;
        expect(counts).toEqual({ foo: 2, bar: 2, baz: 1 });
    });

    it("should return unique values for a specific column", () => {
        const uniques = df.unique("C") as Series;
        expect(uniques.values).toEqual(["foo", "bar", "baz"]);
    });
  });
});
