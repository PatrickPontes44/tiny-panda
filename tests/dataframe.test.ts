import { DataFrame } from "../src/core/dataframe";
import { Series } from "../src/core/series";

describe("DataFrame", () => {
  test("head returns the first N rows", () => {
    const df = new DataFrame({
      A: [1, 2, 3, 4, 5],
      B: [10, 20, 30, 40, 50],
    });

    const headDf = df.head(3);

    expect(headDf.columns.A.values).toEqual([1, 2, 3]);
    expect(headDf.columns.B.values).toEqual([10, 20, 30]);
  });

  test("print outputs the table", () => {
    const df = new DataFrame({
      A: [1, 2],
      B: [3, 4],
    });

    console.table = jest.fn(); // mock console.table
    df.print();
    expect(console.table).toHaveBeenCalledWith(df.columns);
  });
});

describe("Series", () => {
  test("sum returns correct total", () => {
    const series = new Series([1, 2, 3]);
    expect(series.sum()).toBe(6);
  });
});