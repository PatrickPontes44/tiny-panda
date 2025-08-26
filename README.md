<p align="center">
  <img width="200" height="200" src="./src/assets/tiny_panda.png">
</p>

<div align="center"> 
tiny-panda is a lightweight JavaScript library inspired by Python’s pandas.
It provides a simple, intuitive API for working with tabular data in the browser or Node.js.
</div>

---

##  Features
- Easy-to-use DataFrame and Series objects
- Data filtering, selection, and transformation
- Basic statistics and summary methods
- Import/export to JSON and CSV
- Familiar pandas-like syntax

---

## Installation
```
npm install tiny-panda
```

---

## Usage
#### Series
A `Series` is a one-dimensional labeled array capable of holding any data type.
```

import { Series } from "tiny-panda";

const s = new Series([1, 3, 5, null, 6, 8]);
console.log(s.values);
// Output: [1, 3, 5, null, 6, 8]

// Get the length
console.log(s.length());
// Output: 6

// Get unique values
console.log(s.unique().values);
// Output: [1, 3, 5, null, 6, 8]

// Get value counts
const s2 = new Series(['a', 'b', 'a', 'c', 'a', 'd']);
console.log(s2.valueCounts());
// Output: { a: 3, b: 1, c: 1, d: 1 }

const numSeries = new Series([10, 20, 30, 40, 50]);

console.log(numSeries.sum());   // Output: 150
console.log(numSeries.mean());  // Output: 30
console.log(numSeries.median());// Output: 30
console.log(numSeries.min());   // Output: 10
console.log(numSeries.max());   // Output: 50

// Get a full summary
console.log(numSeries.describe());
/*
Output:
{
  max: 50,
  min: 10,
  sum: 150,
  mean: 30,
  median: 30,
  mode: 10
}
*/

const s = new Series([1, 2, 3, 4]);
const squared = s.apply(x => x * x);
console.log(squared.values);
// Output: [1, 4, 9, 16]
```

#### DataFrame
A DataFrame is a 2-dimensional labeled data structure with columns of potentially different types.
```
import { DataFrame } from "tiny-panda";

// From an array of objects (rows)
const df1 = new DataFrame([
  { name: 'Alice', age: 25, city: 'New York' },
  { name: 'Bob', age: 30, city: 'Paris' },
  { name: 'Charlie', age: 35, city: 'London' }
]);

// From an object of arrays (columns)
const df2 = new DataFrame({
  name: ['Alice', 'Bob', 'Charlie'],
  age: [25, 30, 35],
  city: ['New York', 'Paris', 'London']
});

// Display the first 2 rows
df1.head(2).printTable();
/*
Output:
name    | age | city
--------|-----|---------
Alice   | 25  | New York
Bob     | 30  | Paris
*/

// Get the dimensions of the DataFrame
console.log(df1.shape());
// Output: [3, 3]

// Select the 'age' column (returns a Series)
const ages = (df1 as any).age;
console.log(ages.values);
// Output: [25, 30, 35]

// Get value by label (row index 1, column 'name')
console.log(df1.loc(1, 'name'));
// Output: 'Bob'

// Get value by position (row index 2, column index 2)
console.log(df1.iloc(2, 2));
// Output: 'London'

// Get an entire row by position
console.log(df1.iloc(0));
// Output: { name: 'Alice', age: 25, city: 'New York' }

const df = new DataFrame({
  A: [1, 2, 3],
  B: [10, 20, 30],
  C: [100, 200, 300]
});

// Get the sum of each column
console.log(df.sum());
// Output: { A: 6, B: 60, C: 600 }

// Get a full statistical summary
console.log(df.describe());
/*
Output:
{
  max: { A: 3, B: 30, C: 300 },
  min: { A: 1, B: 10, C: 100 },
  sum: { A: 6, B: 60, C: 600 },
  mean: { A: 2, B: 20, C: 200 },
  median: { A: 2, B: 20, C: 200 },
  mode: { A: 1, B: 10, C: 100 }
}
*/

// Apply a function to each column (axis=0, default)
const columnMax = df.apply(series => series.max());
console.log(columnMax);
// Output: { A: 3, B: 30, C: 300 }

// Apply a function to each row (axis=1)
const rowSum = df.apply(series => series.sum(), 1);
console.log(rowSum);
// Output: [111, 222, 333]

```
---

## Roadmap

#### Future / Advanced Features

Add / drop columns (df["new"] = ..., df.drop("col")).

Rename columns (df.rename({ old: new })).

Sorting (df.sortBy("col")).

Filtering / boolean indexing (df[df["a"].values.map(x => x > 2)]).

Merge / join / concat multiple DataFrames.

Handling missing values (fillna(), dropna()).

GroupBy / aggregation (df.groupby("col").mean()).

---

## License

**MIT License**