<p align="center">
  <img width="200" height="200" src="./src/assets/tiny_panda.png">
</p>

<div align="center"> 
tiny-panda is a lightweight JavaScript library inspired by Python’s pandas.
It provides a simple, intuitive API for working with tabular data in the browser or Node.js.
</div>


##  Features
Easy-to-use DataFrame and Series objects

Data filtering, selection, and transformation

Basic statistics and summary methods

Import/export to JSON and CSV

Familiar pandas-like syntax

## Installation
```
npm install tiny-panda
```

## Usage
```
import { DataFrame } from "tiny-panda";

const df = new DataFrame({
  A: [1, 2, 3],
  B: [4, 5, 6],
});

df.print();
// A  B
// 1  4
// 2  5
// 3  6
```

## Roadmap

More pandas-like methods (groupBy, merge, pivot)

File readers (CSV, Excel, Parquet)

Performance optimizations

## License

MIT License