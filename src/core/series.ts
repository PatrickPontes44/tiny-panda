/**
 * A one-dimensional array-like structure for handling data, similar to pandas.Series.
 */
export class Series {
  /** The underlying values of the Series */
  values: any[];

  /**
   * Create a new Series.
   * @param values - An array of values to initialize the Series with.
   */
  constructor(values: any[]) {
    this.values = values;
  }

  /**
   * Return the first `n` elements of the Series.
   * @param n - Number of elements to return (default: 5).
   * @returns A new Series containing the first `n` elements.
   */
  head(n: number = 5): Series {
    return new Series(this.values.slice(0, n));
  }

  /**
   * Return the last `n` elements of the Series.
   * @param n - Number of elements to return (default: 5).
   * @returns A new Series containing the last `n` elements.
   */
  tail(n: number = 5): Series {
    return new Series(this.values.slice(this.values.length - n, this.values.length));
  }

  /**
   * Get the number of elements in the Series.
   * @returns The length of the Series.
  */
  length(): number {
    return this.values.length;
  }

  /**
   * Compute the sum of all numeric values in the Series.
   * @returns The sum of the Series values.
   * @throws Will throw if values are not numeric.
   */
  sum(): number {
    return this.values.reduce((acc, val) => acc + val, 0);
  }

  /**
   * Compute the maximum value in the Series.
   * @returns The maximum value in the Series.
   * @throws Will throw if values are not comparable.
  */
  max(): number {
    return Math.max(...this.values);
  }

  /**
   * Compute the minimum value in the Series.
   * @returns The minimum value in the Series.
   * @throws Will throw if values are not comparable.
  */
  min(): number {
    return Math.min(...this.values);
  }

  /**
   * Compute the mean (average) of all numeric values in the Series.
   * @returns The mean of the Series values.
   * @throws Will throw if values are not numeric.
   */
  mean(): number {
    return this.sum() / this.values.length;
  }
}
