const { readAllFolder } = require("./utils/readFile");

const PluginName = "RequireRepeatHttpUrl";

class RequireRepeatHttpUrl {
  folderPath = null;
  extensions = null;

  constructor(options) {
    this.folderPath = options.folderPath;
    this.extensions = options.extensions;
  }
  apply(compiler) {
    // todo hooks生命周期afterResolvers可以换成更合适的，目前写这个因为想再webpack.config.js中使用alias
    compiler.hooks.emit.tapPromise(PluginName, () => {
      return new Promise((resolve, reject) => {
        const checkExtensionsResult = this.checkExtensions(reject);
        if (checkExtensionsResult) {
          // 文件类型符合.js或者.ts
          readAllFolder(
            this.folderPath,
            checkExtensionsResult,
            resolve,
            reject
          );
        }
      })
    })
  }
  // 检查文件类型
  checkExtensions(reject) {
    if (typeof this.extensions === "string") {
      // 文本类型
      if (this.checkSuffix(this.extensions.trim(), reject)) {
        return [this.extensions.trim()];
      }
      return false;
    } else if (Array.isArray(this.extensions)) {
      // 数组类型
      if (
        this.extensions.every((item) => this.checkSuffix(item.trim(), reject))
      ) {
        return this.extensions.map((item) => item.trim());
      }
      return false;
    }
    reject("文件类型仅支持传递数组或字符串");
  }
  //   检查后缀
  checkSuffix(extensions, reject) {
    if ([".js", ".ts"].includes(extensions)) {
      return true;
    }
    reject("仅支持检测js或ts文件");
  }
}
module.exports = RequireRepeatHttpUrl;
