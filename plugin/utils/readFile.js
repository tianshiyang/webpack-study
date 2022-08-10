const fs = require("fs");
const path = require("path");

const repeatUrls = [];
const existUrlObj = {};

// 读取所有文件夹
function readAllFolder(logger, filePath, suffix, resolve, reject) {
  const suffixRegexp = RegExp(suffix.map((res) => "\\" + res).join("|")); // 文件结尾类型
  fs.readdir(filePath, (error, files) => {
    if (error) {
      reject(`读取${filePath}下的文件夹失败：${error}`);
    } else {
      // 遍历读取当前文件的绝对路径
      Promise.all(files.map((filename) => {
        return new Promise((FResolve, FReject) => {
          const fileDir = path.join(filePath, filename);
          fs.stat(fileDir, (error, stats) => {
            if (error) {
              reject("获取文件stats失败");
            } else {
              const isFile = stats.isFile(); // 是文件
              const isDir = stats.isDirectory(); // 是文件夹
              if (isFile && suffixRegexp.test(fileDir)) {
                readFile(fileDir, resolve, reject, FResolve);
              }
              if (isDir) {
                readAllFolder(logger, fileDir, suffix, resolve, reject); // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
              }
            }
          });
        });
      })).then(res => {
        const exsitUrls = [...new Set(res.flat(99))]
        console.log(exsitUrls)
        if (exsitUrls.length) {
          logger.error(`url路径${exsitUrls}重复`)
        }
      })
    }
  });
}

// 读取文件
function readFile(dirPath, resolve, reject, FResolve) {
  fs.readFile(dirPath, "utf-8", (err, dataStr) => {
    if (err) {
      return reject("读取文件失败" + err.message);
    }
    if (!dataStr.includes("url")) {
      resolve();
      return;
    }
    findUrl(dataStr, FResolve);
    resolve();
  });
}

// 循环查找url
function findUrl(dataStr, FResolve) {
  if (dataStr.length && dataStr.includes("url")) {
    let urlIndex = dataStr.indexOf("url");
    const afterCostStr = costString(dataStr, urlIndex + "url".length);
    const { url, urlEndIndex } = matchUrlPath(afterCostStr);
    if (existUrlObj[url]) {
      repeatUrls.push(url)
    }
    existUrlObj[url] = true;
    return findUrl(costString(afterCostStr, urlEndIndex), FResolve);
  } else {
    FResolve(repeatUrls)
  }
}

// 消费字符串
function costString(dataStr, startIndex) {
  return dataStr.slice(startIndex);
}

// 匹配url路径
function matchUrlPath(str) {
  /**
   * TODO
   *  1. 错误捕获机制 -> 字符串匹配失败
   *  2. 暂不支持url拼写 如 url: "api/isc" + '/logistics/index.json'
   *  3. 如果除了api以外的其他地方使用了url这个字段，则会有问题
   */
  let url = "";
  let SATAE = "waitStart";
  let urlEndIndex = "";
  for (let i = 0; i < str.length; i++) {
    if (SATAE === "waitStart" && ['"', "'"].includes(str.charAt(i))) {
      SATAE = "urlStart";
      continue;
    }
    if (SATAE === "urlStart") {
      if (!['"', "'"].includes(str.charAt(i))) {
        url = url + str.charAt(i);
      } else {
        SATAE = "urlEnd";
        urlEndIndex = i;
        break;
      }
    }
  }
  if (SATAE !== "urlEnd") {
    console.log("匹配失败");
  }
  return {
    url,
    urlEndIndex,
  };
}

module.exports = {
  readAllFolder,
};
