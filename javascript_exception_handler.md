javascript exception handler

built-in exception types:
1. Error
```
var error = new Error("error message");
```


2. RangeError
```
var pi = 3.14159;

pi.toFixed(100000);  // RangeError
```


3. ReferenceError
```
function foo() {
  bar++;  // ReferenceError
}
```


4. SyntaxError
```
if (foo) {  // SyntaxError
  // the closing curly brace is missing
```


5. TypeError
```
var foo = {};
foo.bar();//TypeError
```


6. URIError
```
decodeURIComponent("%"); // URIError
```


7. EvalError
在调用eval()出exception的时候会出现。



```
try {
  // assume an exception occurs
} catch (exception) {
  if (exception instanceof TypeError) {
    // Handle TypeError exceptions
  } else if (exception instanceof ReferenceError) {
    // Handle ReferenceError exceptions
  } else {
    // Handle all other types of exceptions
  }
} finally {
	//TODO
	return false;
}
```


自定义error类型：
```
function DivisionByZeroError(message) {
  this.name = "DivisionByZeroError";
  this.message = (message || "");
}

DivisionByZeroError.prototype = new Error();
DivisionByZeroError.prototype.constructor = DivisionByZeroError;
```


Async Handling
1. 在回调函数里面添加try...catch
2. 在调用栈的最顶层添加try...catch

```
//1.
//在方法里调用
function test1(j) {
        try{
            var s = 0;
            for (var i = 0; i < j; i++) s = i;
            for (var i = 0; i < j; i++) s = i;
            for (var i = 0; i < j; i++) s = i;
            for (var i = 0; i < j; i++) s = i;
            return s;
        }
        catch(ex) {
            console.log(ex);
        }
}

// Slow!
test1(1000000);


//2.
//在调用栈顶层调用
function test2(j) {
    var s = 0;
    for (var i = 0; i < j; i++) s = i;
    for (var i = 0; i < j; i++) s = i;
    for (var i = 0; i < j; i++) s = i;
    for (var i = 0; i < j; i++) s = i;
    return s;
}

// Much faster
try {
    test2(1000000);
} catch(ex) {
    console.log(ex);
}
```

More：
http://www.sitepoint.com/proper-error-handling-javascript/
https://github.com/nodejs/node/wiki/Best-practices-and-gotchas-with-v8