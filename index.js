/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 16/6/12.
 */
"use strict";

var shell = require('shelljs');
var path = require('path');
var fs = require('fs');
var commandMap = {
  optipng: 'optipng-bin',
  jpegtran: 'jpegtran-bin',
  gifsicle: 'gifsicle'
};
Object.keys(commandMap).forEach(command => {
  if (!shell.which(command)) {
    console.log('>> installing ' + command + ' ...');
    shell.exec('tnpm i -g ' + commandMap[command], {
      silent: false
    });
  }
});
var compressor = (imgPath, imgDestPath, verbose) => {
  var isValidImageExt = true;
  var imgExt = path.extname(imgPath).substr(1);
  var shellOption = {
    silent: !verbose
  };
  // 先删除
  fs.existsSync(imgDestPath) && fs.unlinkSync(imgDestPath);
  switch (imgExt) {
    case 'png':
      shell.exec('optipng ' + imgPath + ' -out ' + imgDestPath, shellOption);
      break;
    case 'jpeg':
    case 'jpg':
      shell.exec('jpegtran -optimize -progressive -outfile ' + imgDestPath + ' ' + imgPath, shellOption);
      break;
    case 'gif':
      shell.exec('gifsicle -o ' + imgDestPath + ' ' + imgPath, shellOption);
      break;
    default:
      isValidImageExt = false;
      shell.exec('cp ' + imgPath + ' ' + imgDestPath, shellOption);
      break;
  }
  return isValidImageExt;
};


module.exports = function (content) {
  this.cacheable && this.cacheable();
  var callback = this.async();
  var imgPath = this.resourcePath;
  var imgExt = path.extname(imgPath);

  if (/jp(e?)g|gif|png/.test(imgExt)) {

    // 仅处理 jpg/jpge/gif/png 类型图片, 避免误伤 svg

    // 压缩图片到 .min
    var verbose = process.argv.indexOf('--verbose') != -1;
    var compressDestPath = path.join(path.dirname(imgPath), path.basename(imgPath).replace(imgExt, '.min.' + imgExt.substr(1)));
    compressor(imgPath, compressDestPath, verbose);

    // 替换前检查 md5
    const md5File = require('md5-file');
    var currentFileMd5 = md5File.sync(imgPath);
    var newMinFileMd5 = md5File.sync(compressDestPath);
    if (newMinFileMd5 != currentFileMd5) {
      // 压缩后的图片和当前图片 md5 不一致才复制覆盖, 否则不处理, 避免死循环触发 webpack 重复构建
      fs.unlinkSync(imgPath);
      fs.renameSync(compressDestPath, imgPath);
    } else {
      fs.unlinkSync(compressDestPath);
    }
    callback(null, fs.readFileSync(imgPath));
  } else {
    callback(null, content);
  }
};