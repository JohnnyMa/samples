export function type(obj) {
  if (typeof obj === 'undefined') {
      return 'Undefined';
  }
  return Object.prototype.toString.call(obj).slice(8, -1);
}

export function evalOpt(obj, callback, ...args) {
  if (isFunction(obj)) {
    callback = obj;
    return callback.apply(null, args);
  }
  return callback.apply(null, args.concat([obj]));
}

export function isFunction(obj) {
  return type(obj) === 'Function';
}

export function isObject(obj) {
  return type(obj) === 'Object';
}

export function isArray(obj) {
  return Array.isArray(obj);
}

export function isNil(obj) {
  return type(obj) === 'Undefined' || type(obj) === 'Null';
}

export function extend(obj, ...sources) {
  for (let source of sources) {
    if (!isObject(source)) {
      return;
    }
    for (let key in source) {
      obj[key] = source[key];
    }
  }
  return obj;
}

export function addMethods(obj, hash) {
  for (let key in hash) {
    if (!isFunction(hash[key])) {
      continue;
    }
    obj[key] = hash[key].bind(obj);
  }
  return obj;
}

export function evalFn(fn, fallback) {
  return isFunction(fn) ? fn : fallback;
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}