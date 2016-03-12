//singlton
var getSingle = function(fn) {
	var result;

	return function () {
		result || (result = fn.apply(this, arguments));
	}
};

var getScript = getSingle(function(){
	return document.createElement('script');
});

var s1 = getScript();
var s2 = getScript();
console.log(s1 === s2);







//else
//AOP
