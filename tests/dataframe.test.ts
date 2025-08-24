import { DataFrame } from "../src/core/dataframe";
import { Series } from "../src/core/series";

describe("DataFrame", () => {
  describe("constructor", () => {
    it("should create from array of objects", () => {
      const df = new DataFrame([{ a: 1, b: 2 }, { a: 3, b: 4 }]);
      expect(df.shape()).toEqual([2, 2]);
      expect(df.columnNames()).toEqual(["a", "b"]);
      expect(df.columns.a).toBeInstanceOf(Series);
    });

    it("should create from object of arrays", () => {
      const df = new DataFrame({ a: [1, 3], b: [2, 4] });
      expect(df.shape()).toEqual([2, 2]);
      expect(df.columnNames()).toEqual(["a", "b"]);
    });

    it("should throw for inconsistent object keys", () => {
      expect(() => new DataFrame([{ a: 1 }, { b: 2 }])).toThrow();
    });

    it("should throw for unequal array lengths", () => {
      expect(() => new DataFrame({ a: [1, 2], b: [3] })).toThrow();
    });
  });

  describe("basic methods", () => {
    const df = new DataFrame([{ a: 1, b: 2 }, { a: 3, b: 4 }, { a: 5, b: 6 }]);

    it("head() should return first rows", () => {
      const head = df.head(2);
      expect(head.shape()).toEqual([2, 2]);
      expect(head.columns.a.values).toEqual([1, 3]);
    });

    it("tail() should return last rows", () => {
      const tail = df.tail(2);
      expect(tail.shape()).toEqual([2, 2]);
      expect(tail.columns.a.values).toEqual([3, 5]);
    });

    it("length() should return row count", () => {
      expect(df.length()).toBe(3);
    });

    it("numColumns() should return column count", () => {
      expect(df.numColumns()).toBe(2);
    });

    it("shape() should return [rows, cols]", () => {
      expect(df.shape()).toEqual([3, 2]);
    });

    it("info() should return metadata", () => {
      const info = df.info();
      expect(info.rows).toBe(3);
      expect(info.columns).toBe(2);
      expect(info.columnNames).toEqual(["a", "b"]);
    });
  });

  describe("statistics", () => {
    const df = new DataFrame({ a: [1, 2, 3, 4, 5], b: [10, 20, 30, 40, 50] });

    it("sum()", () => {
      expect(df.sum()).toEqual({ a: 15, b: 150 });
      expect(df.sum("a")).toBe(15);
    });

    it("max()", () => {
      expect(df.max()).toEqual({ a: 5, b: 50 });
      expect(df.max("b")).toBe(50);
    });

    it("min()", () => {
      expect(df.min()).toEqual({ a: 1, b: 10 });
      expect(df.min("a")).toBe(1);
    });

    it("mean()", () => {
      expect(df.mean()).toEqual({ a: 3, b: 30 });
      expect(df.mean("a")).toBe(3);
    });

    it("median()", () => {
      expect(df.median()).toEqual({ a: 3, b: 30 });
      expect(df.median("b")).toBe(30);
    });

    it("mode()", () => {
      const df2 = new DataFrame({ x: [1, 1, 2, 3], y: [7, 8, 7, 9] });
      expect(df2.mode()).toEqual({ x: 1, y: 7 });
      expect(df2.mode("y")).toBe(7);
    });
  });

  describe("printing", () => {
    const df = new DataFrame([{ a: 1, b: 2 }, { a: 3, b: 4 }]);

    it("printTable() should not throw", () => {
      expect(() => df.printTable()).not.toThrow();
    });

    it("print() should not throw", () => {
      expect(() => df.print()).not.toThrow();
    });
  });
});
