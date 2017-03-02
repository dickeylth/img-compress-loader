'use strict';

Promise.all([
  'optipng',
  'gifsicle',
  'jpegtran'
].map(cmd => {
  return new Promise((resolve, reject) => {
    require('./' + cmd).findExisting(err => {
      if (err) {
        reject(err);
      } else {
        console.log(`${cmd} pre-build test passed successfully`);
      }
    })
  });
})).catch(e => {
  console.error(e);
});