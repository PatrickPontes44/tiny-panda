import { Series } from "./series";

/**
 * A simple tabular data structure inspired by pandas.DataFrame.
 * Stores data as a collection of named Series objects.
 */
export class DataFrame {
  /** Mapping of column names to Series */
  columns: Record<string, Series>;
  #originalData: Record<string, any[]> | Array<Record<string, any>>;

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
    this.#originalData = data;

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

      return new Proxy(this, {
        get: (target: DataFrame, prop: string | symbol, receiver: any) => {
          if (Reflect.has(target, prop)) return Reflect.get(target, prop, receiver);
          if (typeof prop === "string" && prop in target.columns) return target.columns[prop];
          return undefined;
        },
        set: () => {
          throw new Error("Direct assignment to Dataframe value is not allowed.");
        }
      });
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
      return new Proxy(this, {
        get: (target: DataFrame, prop: string | symbol, receiver: any) => {
          if (Reflect.has(target, prop)) return Reflect.get(target, prop, receiver);
          if (typeof prop === "string" && prop in target.columns) return target.columns[prop];
          return undefined;
        },
        set: () => {
          throw new Error("Direct assignment to Dataframe value is not allowed.");
        }
      });
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

    /** Estimate memory usage of the DataFrame */
  estimatedMemoryUsage(): string {
    let totalBytes = 0;

    for (const colName in this.columns) {
      const series = this.columns[colName];
      for (const val of series.values) {
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
    }

    return `${(totalBytes / 1024).toFixed(2)} KB`;
  }

  /**
   * Get basic information about the DataFrame.
   * @returns An object containing number of rows, columns, column names, and estimated memory usage.
  */
  info(): { rows: number; columns: number; columnNames: string[]; estimatedMemoryUsage: string } {
    const rows = this.length();
    const columns = this.numColumns();
    const columnNames = this.columnNames();
    const estimatedMemoryUsage = this.estimatedMemoryUsage();
    return { rows, columns, columnNames, estimatedMemoryUsage };
  }

  /**
   * Get descriptive statistics for all numeric columns in the DataFrame.
   * @returns An object mapping column names to their descriptive statistics.
   */
  describe(k: string | null = null): Record<string, any> {
    if (k) {
      if (!(k in this.columns)) {
        console.error(`Column "${k}" does not exist in DataFrame.`);
      }
      return { [k]: this.columns[k].describe() };
    } else {
      return {
        max: this.max(),
        min: this.min(),
        sum: this.sum(),
        mean: this.mean(),
        median: this.median(),
        mode: this.mode(),
      };
    }
  }

  /**
   * @param k - Column name. If null, compute the uniques for all columns.
   * @returns The unique values of the column if `k` is given, or an object mapping column → unique otherwise.
   * @throws If column does not exist.
   */
  unique(k: string): Record<string, Series> | Series {
    if (k) {
      if (!(k in this.columns)) {
        console.error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].unique();
    }
    const result: Record<string, Series> = {};
    for (const col in this.columns) {
      result[col] = this.columns[col].unique();
    }
    return result;
  }

  /**
   * @param k - Column name. If null, compute the valueCounts for all columns.
   * @param desc - whether to sort descending (default true)
   * @returns The value counts of the column if `k` is given, or an object mapping column → counts otherwise.
   */
  valueCounts(k: string, desc: boolean = true): Record<string, Record<any, number>> | Record<any, number> {
    if (k) {
      if (!(k in this.columns)) {
        console.error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].valueCounts(desc);
    }
    const result: Record<string, Record<any, number>> = {};
    for (const col in this.columns) {
      result[col] = this.columns[col].valueCounts(desc);
    }
    return result;
  }

  /**
   * Compute the sum of a specific column, or of all numeric columns.
   *
   * @param k - Column name. If null, computes sum for all columns.
   * @returns The mean of the column if `k` is given, or an object mapping column → sum otherwise.
   * @throws If column does not exist.
   */
  sum(k: string | null = null): number | null | Record<string, number | null> {
    if (k) {
      if (!(k in this.columns)) {
        console.error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].sum();
    }
    const sums: Record<string, number | null> = {};
    for (const key in this.columns) {
      sums[key] = this.columns[key].sum();
    }
    return sums;
  }

  /**
   * Compute the maximum value in a specific column, or of all numeric columns.
   *
   * @param k - Column name. If null, computes max for all columns.
   * @returns The max of the column if `k` is given, or an object mapping column → max otherwise.
   * @throws If column does not exist.
  */
  max(k: string | null = null): number | null | Record<string, number | null> {
    if (k) {
      if (!(k in this.columns)) {
        console.error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].max();
    }
    const maxes: Record<string, number | null> = {};
    for (const key in this.columns) {
      maxes[key] = this.columns[key].max();
    }
    return maxes;
  }

  /**
   * Compute the minimum value in a specific column, or of all numeric columns.
   *
   * @param k - Column name. If null, computes min for all columns.
   * @returns The min of the column if `k` is given, or an object mapping column → min otherwise.
   * @throws If column does not exist.
  */
  min(k: string | null = null): number | null | Record<string, number | null> {
    if (k) {
      if (!(k in this.columns)) {
        console.error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].min();
    }
    const mins: Record<string, number | null> = {};
    for (const key in this.columns) {
      mins[key] = this.columns[key].min();
    }
    return mins;
  }

  /**
   * Compute the mean of a specific column, or of all numeric columns.
   *
   * @param k - Column name. If null, computes means for all columns.
   * @returns The mean of the column if `k` is given, or an object mapping column → mean otherwise.
   * @throws If column does not exist.
   */
  mean(k: string | null = null): number | null | Record<string, number | null> {
    if (k) {
      if (!(k in this.columns)) {
        console.error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].mean();
    }
    const means: Record<string, number | null> = {};
    for (const key in this.columns) {
      means[key] = this.columns[key].mean();
    }
    return means;
  }

  /**
   * Compute the median of a specific column, or of all numeric columns.
   *
   * @param k - Column name. If null, computes medians for all columns.
   * @returns The median of the column if `k` is given, or an object mapping column → median otherwise.
   * @throws If column does not exist.
   */
  median(k: string | null = null): number | null | Record<string, number | null> {
    if (k) {
      if (!(k in this.columns)) {
        console.error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].median();
    }
    const medians: Record<string, number | null> = {};
    for (const key in this.columns) {
      medians[key] = this.columns[key].median();
    }
    return medians;
  }

  /**
   * Compute the mode of a specific column, or of all numeric columns.
   *
   * @param k - Column name. If null, computes modes for all columns.
   * @returns The mode of the column if `k` is given, or an object mapping column → mode otherwise.
   * @throws If column does not exist.
   */
  mode(k: string | null = null): number | null | Record<string, number | null> {
    if (k) {
      if (!(k in this.columns)) {
        console.error(`Column "${k}" does not exist in DataFrame.`);
      }
      return this.columns[k].mode();
    }
    const modes: Record<string, number | null> = {};
    for (const key in this.columns) {
      modes[key] = this.columns[key].mode();
    }
    return modes;
  }

  /**
   * Positional indexing to get value(s) by row and column indices.
   * @param rowIndex - The row index (0-based).
   * @param colIndex - The column index (0-based). If null, returns the entire row as an object.
   * @returns The value at the specified position, or the entire row as an object if `colIndex` is null.
   * @throws If indices are out of bounds.
  */
  iloc(rowIndex: number, colIndex: number | null = null): any {
    if (colIndex === null) {
      const row: Record<string, any> = {};
      for (const col in this.columns) {
        row[col] = this.columns[col].values[rowIndex];
      }
      return row;
    } else {
      const colName = Object.keys(this.columns)[colIndex];
      return this.columns[colName].values[rowIndex];
    }
  }

  /**
   * Label-based indexing to get value(s) by row index and column name.
   * @param rowIndex - The row index (0-based).
   * @param colName - The column name.
   * @returns The value at the specified position.
   * @throws If indices are out of bounds or column does not exist.
  */
  loc(rowIndex: number, colName: string): any {
    const numRows = this.length();
    if (rowIndex < 0 || rowIndex >= numRows) {
      throw new Error(`Row index ${rowIndex} out of range`);
    }
    if (!this.columnNames().includes(colName)) {
      throw new Error(`Column "${colName}" does not exist`);
    }
    return this.columns[colName].values[rowIndex];
  }

  /**
   * Convert the DataFrame to a string representation.
   * @param num_rows - Number of rows to be displayed. If null, computes all rows.
   * Pretty-print the DataFrame as a table with headers and rows.
  */
  printTable(num_rows: number | null = null): void {
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
    const length = num_rows ? num_rows : this.columns[keys[0]].values.length;
    for (let i = 0; i < length; i++) {
      rows += keys.map(k => String(this.columns[k].values[i]).padEnd(colWidths[k], ' ')).join(' | ') + "\n";
    }
    console.log(rows);
  }
  
  /**
   * Pretty-print the DataFrame using `console.table`.
  */
  print(): void {
    console.table(this.#originalData);
  }

  /**
   * Apply a function along an axis of the DataFrame.
   * @param func - The function to apply. It receives a Series and its label (column name or row index).
   * @param axis - The axis to apply the function on: 0 for columns, 1 for rows (default: 0).
   * @returns An object mapping column/row labels to the results of the function.
   */
  apply(func: (series: Series, label: string | number) => any, axis: 0 | 1 = 0): Record<string, any> | any {
    if (axis === 0) {
      const result: Record<string, any> = {};
      for (const key of Object.keys(this.columns)) {
        result[key] = func(this.columns[key], key);
      }
      return result;
    } else {
      const numRows = this.length();
      const keys = Object.keys(this.columns);
      const result: any[] = [];
      for (let i = 0; i < numRows; i++) {
        const rowData: any[] = [];
        for (const key of keys) {
          rowData.push(this.columns[key].values[i]);
        }
        const rowSeries = new Series(rowData);
        result.push(func(rowSeries, i));
      }
      return result;
    }
  }
}
