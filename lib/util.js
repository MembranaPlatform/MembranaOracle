const  sleep = timeout => new Promise(res => setTimeout(res, timeout));
const  eqArr = ((a, b) => a.length === b.length && a.map((x, y) => x === b[y]).reduce((a, c) => a && c));
const deepEqual = (x, y) => {
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length &&
      ok(x).every(key => deepEqual(x[key], y[key]))
  ) : (x === y);
};
module.exports = {
  sleep, eqArr, deepEqual
};
