# query-master

a parser for boolean search strings

    const query = require('query-master')

    query(`apple "pink lady" OR "royal gala" OR ambrosia -iphone -mac`)
    { any: [ [ 'pink lady', 'royal gala', 'ambrosia' ] ],
      not: [ 'iphone', 'mac' ],
      must: [ 'apple' ] }

[![GitHub stars](https://img.shields.io/github/stars/hueyy/query-master.svg?style=social&label=Stars)](https://github.com/hueyy/query-master)
[![npm](https://img.shields.io/npm/dt/query-master.svg)](https://www.npmjs.com/package/query-master)
[![npm](https://img.shields.io/npm/l/query-master.svg)](https://www.npmjs.com/package/query-master)


