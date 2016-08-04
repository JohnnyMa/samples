export function formatBytes(size, options = {}) {
  let {
    forceUnit = '*',
    stripUnit = false,
    radix = 1024,
    precision = 1
  } = options, units = 'B';
  if (forceUnit === 'B' || size < radix) {
    // do nothing
  } else if (forceUnit === 'KB' || size < Math.pow(radix, 2)) {
    units = 'KB';
    size = size / radix;
  } else if (forceUnit === 'MB' || size < Math.pow(radix, 3)) {
    units = 'MB';
    size = size / Math.pow(radix, 2);
  } else if (forceUnit === 'GB' || size < Math.pow(radix, 4)) {
    units = 'GB';
    size = size / Math.pow(radix, 3);
  } else if (forceUnit === 'TB' || size < Math.pow(radix, 5)) {
    units = 'TB';
    size = size / Math.pow(radix, 4);
  }
  if (stripUnit) {
    return size.toFixed(precision);
  }
  return size.toFixed(precision) + units;
}