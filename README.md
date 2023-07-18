# MICRO-TSDB
Node.js TSDB, Time Series Database

#Example
```
const tsdb = require('./micro-tsdb');
// tsdb.tz('Asia/Seoul'); <= default
// tsdb.tz('America/New_York');

console.log(`Data: ${tsdb.path}`);

const fireA = tsdb.get('fireA');
console.log(`fireA: ${fireA.path}`);
const fireB = tsdb.get('fireB');
console.log(`fireB: ${fireB.path}`);

let max = 10;
while(max--) {
    fireA.in(max);
    fireB.in(max);
}

// default today
const tA = fireA.out();
console.log(fireA.name);
console.log(tA);

const tB = fireB.out();
console.log(fireB.name);
console.log(tB);

// begin ~ end
const sA = fireA.out("20230715", "20230718");
console.log(fireA.name);
console.log(sA);

const sB = fireB.out("20230715", "20230718");
console.log(fireB.name);
console.log(sB);
```

Data: C:\works\src\.data
fireA: C:\works\src\.data\fireA
fireB: C:\works\src\.data\fireB
fireA
[
  { t: '20230718111029447', v: 9 },
  { t: '20230718111029447', v: 8 },
  { t: '20230718111029447', v: 7 },
  { t: '20230718111029447', v: 6 },
  { t: '20230718111029447', v: 5 },
  { t: '20230718111029448', v: 4 },
  { t: '20230718111029448', v: 3 },
  { t: '20230718111029448', v: 2 },
  { t: '20230718111029448', v: 1 },
  { t: '20230718111029448', v: 0 }
]
fireB
[
  { t: '20230718111029447', v: 9 },
  { t: '20230718111029447', v: 8 },
  { t: '20230718111029447', v: 7 },
  { t: '20230718111029447', v: 6 },
  { t: '20230718111029448', v: 5 },
  { t: '20230718111029448', v: 4 },
  { t: '20230718111029448', v: 3 },
  { t: '20230718111029448', v: 2 },
  { t: '20230718111029448', v: 1 },
  { t: '20230718111029448', v: 0 }
]
fireA
[
  { t: '20230718111029447', v: 9 },
  { t: '20230718111029447', v: 8 },
  { t: '20230718111029447', v: 7 },
  { t: '20230718111029447', v: 6 },
  { t: '20230718111029447', v: 5 },
  { t: '20230718111029448', v: 4 },
  { t: '20230718111029448', v: 3 },
  { t: '20230718111029448', v: 2 },
  { t: '20230718111029448', v: 1 },
  { t: '20230718111029448', v: 0 }
]
fireB
[
  { t: '20230718111029447', v: 9 },
  { t: '20230718111029447', v: 8 },
  { t: '20230718111029447', v: 7 },
  { t: '20230718111029447', v: 6 },
  { t: '20230718111029448', v: 5 },
  { t: '20230718111029448', v: 4 },
  { t: '20230718111029448', v: 3 },
  { t: '20230718111029448', v: 2 },
  { t: '20230718111029448', v: 1 },
  { t: '20230718111029448', v: 0 }
]

