let:
暂时性死区（temporal dead zone，简称TDZ)

if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}



typeof x; // ReferenceError
let x;


typeof undeclared_variable // "undefined"

在没有let之前，typeof运算符是百分之百安全的，永远不会报错。现在这一点不成立了。

暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。
