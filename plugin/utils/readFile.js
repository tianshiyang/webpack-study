const fs = require("fs");
const path = require("path");

// 读取所有文件夹
function readAllFolder(filePath, suffix) {
  const suffixRegexp = RegExp(suffix.map(res => "\\" + res).join("|")) // 文件结尾类型
  fs.readdir(filePath, (error, files) => {
    if (error) {
      console.error(`读取${filePath}下的文件夹失败：${error}`);
    } else {
      // 遍历读取当前文件的绝对路径
      files.forEach((filename) => {
        const fileDir = path.join(filePath, filename);
        fs.stat(fileDir, (error, stats) => {
          if (error) {
            console.warn("获取文件stats失败");
          } else {
            const isFile = stats.isFile(); // 是文件
            const isDir = stats.isDirectory(); // 是文件夹
            if (isFile && suffixRegexp.test(fileDir)) {
              console.log(fileDir)
            }
            if (isDir) {
              readAllFolder(fileDir, suffix); // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        });
      });
    }
  });
}

// 读取文件
function readFile(dirPath) {
  fs.readFile(dirPath, "utf-8", (err, dataStr) => {
    if (err) {
      return console.log("读取文件失败" + err.message);
    }
    console.log("读取文件成功:" + dataStr);
  });
}

module.exports = {
  readFile,
  readAllFolder,
};
