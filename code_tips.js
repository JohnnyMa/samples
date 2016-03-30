//# how to add a mixin to an existing class

//## Creating classic mixins
// A simple object with some methods
var DraggableMixin = {
	startDrag: function() {
		// It will have the context of the main class
		console.log('Context = ', this);
	},
	onDrag: function() {}
};

// UserItemView already extends BaseView
var UserItemView = BaseView.extend({
	tagName: 'div',
	template: '<%= name %>'
});


// 1. copy the Mixin's properties into the View
_.extend(UserItemView.prototype, DraggableMixin, {
	otherFn: function() {}
});
var itemView = new UserItemView();
// Call the mixin's method
itemView.startDrag();


// 2. copy ONLY a single method
UserItemView.prototype.startDrag = DraggableMixin.startDrag;




// ## Creating functional mixins
// Functional mixin
var DraggableMixin = function(config) {
	this.startDrag = function() {};
	this.onDrag = function() {};
	return this;
};
// DraggableMixin method is called passing the config object
DraggableMixin.call(UserItemView.prototype, {
	foo: 'bar'
});
// SortableMixin.call(UserItemView.prototype);
new UserItemView().startDrag();


// Functional mixin with cache
var DraggableMixin = (function() {
	var startDrag = function() {};
	var onDrag = function() {};

	return function(config) {
		this.startDrag = startDrag;
		this.onDrag = onDrag;
		return this;
	};
})();



//# curry

// Definition of curry
Function.prototype.curry = function() {
	var slice = Array.prototype.slice,
		args = slice.apply(arguments),
		that = this;

	return function() {
		return that.apply(null,
			args.concat(slice.apply(arguments)));
	};
};

// Functional mixin with cache
var DraggableMixin = (function() {
	var startDrag = function(options) {
		console.log('Options = ', options);
	};
	var onDrag = function() {};

	return function(config) {
		this.startDrag = startDrag.curry(config);
		this.onDrag = onDrag;
		return this;
	};
})();

DraggableMixin.call(UserItemView.prototype, {
	foo: 'bar'
});

itemView.startDrag();

