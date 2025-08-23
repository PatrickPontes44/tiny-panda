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
   * Get basic information about the Series.
   * @returns An object containing length, type of values, and estimated memory usage.
  */
  info(): { length: number; type: string; estimatedMemoryUsage: string } {
    const length = this.length();
    const type = length > 0 ? typeof this.values[0] : 'undefined';
    const estimatedMemoryUsage = `${(length * 8) / 1024} KB`;
    return { length, type, estimatedMemoryUsage };
  }

  /**
   * Get descriptive statistics of the Series.
   * @returns An object containing max, min, sum, and mean of the Series values.
   * @throws Will throw if values are not numeric.
   */
  describe(): { max: number, min: number, sum: number, mean: number, median: number, mode: any | null } {
    return {
      max: this.max(),
      min: this.min(),
      sum: this.sum(),
      mean: this.mean(),
      median: this.median(),
      mode: this.mode(),
    };
  }

  /** Return the unique values in the Series (preserves first-occurrence order) */
  unique(): Series {
    const seen = new Set<any>();
    const uniques: any[] = [];
    for (const val of this.values) {
      if (!seen.has(val)) {
        seen.add(val);
        uniques.push(val);
      }
    }
    return new Series(uniques);
  }

  /**
   * Return the counts of each unique value in the Series.
  */
  valueCounts(desc: boolean = true): Record<any, number> {
    const counts = new Map<any, number>();
    for (const val of this.values) {
      counts.set(val, (counts.get(val) || 0) + 1);
    }
    const countsArray = Array.from(counts.entries());
    if (desc) {
      countsArray.sort((a, b) => b[1] - a[1]);
    }
    const result: Record<any, number> = {};
    for (const [val, count] of countsArray) {
      result[val] = count;
    }

    return result;
  }

  /**
   * Compute the sum of all numeric values in the Series.
   * @returns The sum of the Series values.
   * @throws Will throw if values are not numeric.
   */
  sum(): number {
    if (!this.values.every(val => typeof val === 'number')) {
      throw new Error("Sum not implemented for non-numeric values.");
    }
    return this.values.reduce((acc, val) => acc + val, 0);
  }

  /**
   * Compute the maximum value in the Series.
   * @returns The maximum value in the Series.
   * @throws Will throw if values are not comparable.
  */
  max(): number {
    if (!this.values.every(val => typeof val === 'number')) {
      throw new Error("Max not implemented for non-numeric values.");
    }
    return Math.max(...this.values);
  }

  /**
   * Compute the minimum value in the Series.
   * @returns The minimum value in the Series.
   * @throws Will throw if values are not comparable.
  */
  min(): number {
    if (!this.values.every(val => typeof val === 'number')) {
      throw new Error("Min not implemented for non-numeric values.");
    }
    return Math.min(...this.values);
  }

  /**
   * Compute the mean (average) of all numeric values in the Series.
   * @returns The mean of the Series values.
   * @throws Will throw if values are not numeric.
   */
  mean(): number {
    if (!this.values.every(val => typeof val === 'number')) {
      throw new Error("Mean not implemented for non-numeric values.");
    }
    return this.sum() / this.values.length;
  }

  /**
   * Compute the median of all numeric values in the Series.
   * @returns The median of the Series values.
   */
  median(): number {
    if (!this.values.every(val => typeof val === "number")) {
      throw new Error("Median not implemented for non-numeric values.");
    }
    const sorted = [...this.values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Compute the mode (most frequent value) of all numeric values in the Series.
   * @returns The mode of the Series values, or null if Series is empty.
   */
  mode(): any | null {
    if (this.values.length === 0) return null;

    const counts = new Map<any, number>();
    for (const val of this.values) {
      counts.set(val, (counts.get(val) || 0) + 1);
    }
    let maxCount = 0;
    let mode: any | null = null;
    for (const [val, count] of counts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mode = val;
      }
    }
    return mode;
  }
}
