/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 16/6/12.
 */
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

    // 先把原图重命名一下, 做好备份
    var recoverLocalPath = path.join(path.dirname(imgPath), path.basename(imgPath).replace(imgExt, '.orig.' + imgExt.substr(1)));
    fs.renameSync(imgPath, recoverLocalPath);

    // 压缩图片覆盖原文件名
    var verbose = process.argv.indexOf('--verbose') != -1;
    compressor(recoverLocalPath, imgPath, verbose);
  }

  callback(null, fs.readFileSync(imgPath));
};