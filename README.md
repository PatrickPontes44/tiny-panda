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
```
import { DataFrame } from "tiny-panda";

// you can use it as an object containing arrays

const data_obj = {
  A: [1, 2, 3],
  B: [4, 5, 6],
};

const df_from_obj = new DataFrame(data_obj);

// or like an array of objects

const data_arr = [
  { a: 1, b: 4 },
  { a: 2, b: 5 },
  { a: 3, b: 6 }
];

const df_from_arr = new DataFrame(data_arr);

df_from_arr.print();
console.log(df_from_arr.head(2).toString());
console.log(df_from_arr.mean());
```
---

## Roadmap

#### Soon (Next Level Features)

shape → get [rows, columns].

columns → get column names.

iloc(rowIndex, colIndex) → positional selection of values.

apply(func) → apply a function to column(s) or row(s).

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