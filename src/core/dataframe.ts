import { Series } from "./series";

/**
 * A simple tabular data structure inspired by pandas.DataFrame.
 * Stores data as a collection of named Series objects.
 */
export class DataFrame {
  /** Mapping of column names to Series */
  columns: Record<string, Series>;

  /**
   * Create a new DataFrame from an array of objects or an object of arrays.
   *
   * @param data - 
   *  - Array of objects: each object represents a row (all rows must have the same keys).  
   *  - Object of arrays: each key represents a column (all arrays must have the same length).
   *
   * @throws If input is empty, malformed, or inconsistent.
   *
   * @example
   * ```ts
   * new DataFrame([{a: 1, b: 2}, {a: 3, b: 4}]);
   * new DataFrame({a: [1, 3], b: [2, 4]});
   * ```
   */
  constructor(data: Record<string, any[]> | Array<Record<string, any>>) {
    this.columns = {};

    if (Array.isArray(data)) {
      // Case 1: array of objects
      if (data.length === 0 || typeof data[0] !== "object" || data[0] === null) {
        throw new Error("DataFrame constructor: expected a non-empty array of objects.");
      }

      const keys = Object.keys(data[0]);

      for (const row of data) {
        if (typeof row !== "object" || row === null) {
          throw new Error("DataFrame constructor: array elements must be objects.");
        }
        const rowKeys = Object.keys(row);
        if (rowKeys.length !== keys.length || !rowKeys.every(k => keys.includes(k))) {
          throw new Error("DataFrame constructor: all objects must have the same keys.");
        }
      }

      for (const key of keys) {
        this.columns[key] = new Series(data.map(row => row[key]));
      }
    } 
    else if (typeof data === "object" && data !== null) {
      // Case 2: object of arrays
      const keys = Object.keys(data);
      if (keys.length === 0) {
        throw new Error("DataFrame constructor: object must have at least one key.");
      }

      const lengths = keys.map(k => Array.isArray(data[k]) ? data[k].length : -1);
      if (lengths.includes(-1)) {
        throw new Error("DataFrame constructor: all values in object must be arrays.");
      }

      const firstLen = lengths[0];
      if (!lengths.every(len => len === firstLen)) {
        throw new Error("DataFrame constructor: all arrays must have the same length.");
      }

      for (const key of keys) {
        this.columns[key] = new Series(data[key]);
      }
    } 
    else {
      throw new Error("DataFrame constructor: expected array of objects or object of arrays.");
    }
  }

  /**
   * Return the first `n` rows of the DataFrame.
   * @param n - Number of rows to return (default: 5).
   * @returns A new DataFrame containing the first `n` rows.
   */
  head(n: number = 5): DataFrame {
    const result: Record<string, any[]> = {};
    for (const key in this.columns) {
      result[key] = this.columns[key].values.slice(0, n);
    }
    return new DataFrame(result);
  }

  /**
   * Return the last `n` rows of the DataFrame.
   * @param n - Number of rows to return (default: 5).
   * @returns A new DataFrame containing the last `n` rows.
   */
  tail(n: number = 5): DataFrame {
    const result: Record<string, any[]> = {};
    for (const key in this.columns) {
      result[key] = this.columns[key].values.slice(
        this.columns[key].values.length - n,
        this.columns[key].values.length
      );
    }
    return new DataFrame(result);
  }

  /**
   * Get the number of rows in the DataFrame.
   * @returns The number of rows (length of the first column).
  */
  length(): number {
    const firstKey = Object.keys(this.columns)[0];
    return firstKey ? this.columns[firstKey].length() : 0;
  }

  /**
   * Get the number of columns in the DataFrame.
   * @returns The number of columns.
  */
  numColumns(): number {
    return Object.keys(this.columns).length;
  }

  /**
   * Get the names of all columns in the DataFrame.
   * @returns An array of column names.
  */
  columnNames(): string[] {
    return Object.keys(this.columns);
  }

  /**
   * Get the shape of the DataFrame as [rows, columns].
   * @returns A tuple with the number of rows and columns.
   */
  shape(): [number, number] {
    const numRows = this.length();
    const numCols = Object.keys(this.columns).length;
    return [numRows, numCols];
  }

  /**
   * Compute the sum of a specific column, or of all numeric columns.
   *
   * @param k - Column name. If null, computes sum for all columns.
   * @returns The mean of the column if `k` is given, or an object mapping column → sum otherwise.
   * @throws If column does not exist.
   */
  sum(k: string | null = null): number | Record<string, number> {
    if (k) {
      if (!(k in this.columns)) {
        throw new Error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].sum();
    } else {
      const sums: Record<string, number> = {};
      for (const key in this.columns) {
        sums[key] = this.columns[key].sum();
      }
      return sums;
    }
  }

  /**
   * Compute the maximum value in a specific column, or of all numeric columns.
   *
   * @param k - Column name. If null, computes max for all columns.
   * @returns The max of the column if `k` is given, or an object mapping column → max otherwise.
   * @throws If column does not exist.
  */
  max(k: string | null = null): number | Record<string, number> {
    if (k) {
      if (!(k in this.columns)) {
        throw new Error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].max();
    } else {
      const maxes: Record<string, number> = {};
      for (const key in this.columns) {
        maxes[key] = this.columns[key].max();
      }
      return maxes;
    }
  }

  /**
   * Compute the minimum value in a specific column, or of all numeric columns.
   *
   * @param k - Column name. If null, computes min for all columns.
   * @returns The min of the column if `k` is given, or an object mapping column → min otherwise.
   * @throws If column does not exist.
  */
  min(k: string | null = null): number | Record<string, number> {
    if (k) {
      if (!(k in this.columns)) {
        throw new Error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].min();
    } else {
      const mins: Record<string, number> = {};
      for (const key in this.columns) {
        mins[key] = this.columns[key].min();
      }
      return mins;
    }
  }

  /**
   * Compute the mean of a specific column, or of all numeric columns.
   *
   * @param k - Column name. If null, computes means for all columns.
   * @returns The mean of the column if `k` is given, or an object mapping column → mean otherwise.
   * @throws If column does not exist.
   */
  mean(k: string | null = null): number | Record<string, number> {
    if (k) {
      if (!(k in this.columns)) {
        throw new Error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].mean();
    } else {
      const means: Record<string, number> = {};
      for (const key in this.columns) {
        means[key] = this.columns[key].mean();
      }
      return means;
    }
  }

  /**
   * Convert the DataFrame to a string representation.
   * Pretty-print the DataFrame as a table with headers and rows.
  */
  printTable() {
    const keys = Object.keys(this.columns);
    const colWidths: Record<string, number> = {};
    for (const k of keys) {
      const values = this.columns[k].values.map(v => String(v));
      const maxValLen = values.reduce((max, v) => Math.max(max, v.length), 0);
      colWidths[k] = Math.max(k.length, maxValLen);
    }
    let rows: string = '';
    rows += keys.map(k => k.padEnd(colWidths[k], ' ')).join(' | ') + "\n";
    rows += keys.map(k => '-'.repeat(colWidths[k])).join('-|-') + "\n";
    const length = this.columns[keys[0]].values.length;
    for (let i = 0; i < length; i++) {
      rows += keys.map(k => String(this.columns[k].values[i]).padEnd(colWidths[k], ' ')).join(' | ') + "\n";
    }
    console.log(rows);
  }
  
  /**
   * Pretty-print the DataFrame using `console.table`.
  */
  print(): void {
    console.table(this.columns);
  }
}
