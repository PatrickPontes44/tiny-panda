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

  /** Estimate memory usage of the Series */
  estimatedMemoryUsage(): string {
    let totalBytes = 0;
    for (const val of this.values) {
      if (typeof val === "number") {
        totalBytes += 8;
      } else if (typeof val === "string") {
        totalBytes += val.length * 2;
      } else if (val === null || val === undefined) {
        totalBytes += 0;
      } else {
        totalBytes += 8;
      }
    }

    return `${(totalBytes / 1024).toFixed(2)} KB`;
  }

  /**
   * Get basic information about the Series.
   * @returns An object containing length, type of values, and estimated memory usage.
  */
  info(): { length: number; type: string; estimatedMemoryUsage: string } {
    const length = this.length();
    const type = length > 0 ? typeof this.values[0] : 'undefined';
    const estimatedMemoryUsage = this.estimatedMemoryUsage();
    return { length, type, estimatedMemoryUsage };
  }

  /**
   * Get descriptive statistics of the Series.
   * @returns An object containing max, min, sum, and mean of the Series values.
   * @throws Will throw if values are not numeric.
   */
  describe(): { max: number | null, min: number | null, sum: number | null, mean: number | null, median: number | null, mode: any | null } {
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
  sum(): number | null {
    if (!this.values.every(val => typeof val === 'number')) {
      return null;
    }
    return this.values.reduce((acc, val) => acc + val, 0);
  }

  /**
   * Compute the maximum value in the Series.
   * @returns The maximum value in the Series.
   * @throws Will throw if values are not comparable.
  */
  max(): number | null {
    if (!this.values.every(val => typeof val === 'number')) {
      return null;
    }

    let maxVal = -Infinity;
    for (const val of this.values) {
      if (val > maxVal) maxVal = val;
    }
    return maxVal;
  }

  /**
   * Compute the minimum value in the Series.
   * @returns The minimum value in the Series.
   * @throws Will throw if values are not comparable.
  */
  min(): number | null {
    if (!this.values.every(val => typeof val === 'number')) {
      return null;
    }
    
    let minVal = Infinity;
    for (const val of this.values) {
      if (val < minVal) minVal = val;
    }
    return minVal;
  }

  /**
   * Compute the mean (average) of all numeric values in the Series.
   * @returns The mean of the Series values.
   * @throws Will throw if values are not numeric.
   */
  mean(): number | null {
    if (!this.values.every(val => typeof val === 'number')) {
      return null;
    }
    const sum = this.sum();
    return sum != null ? sum / this.values.length : null;
  }

  /**
   * Compute the median of all numeric values in the Series.
   * @returns The median of the Series values.
   */
  median(): number | null {
    if (!this.values.every(val => typeof val === "number")) {
      return null;
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
