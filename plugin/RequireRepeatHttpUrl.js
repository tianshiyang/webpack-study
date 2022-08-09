const { readAllFolder } = require("./utils/readFile");

class RequireRepeatHttpUrl {
  constructor(options) {
    this.folderPath = options.folderPath;
    this.extensions = options.extensions;
  }
  apply(compiler) {
    // todo hooks生命周期afterResolvers可以换成更合适的，目前写这个因为想再webpack.config.js中使用alias
    compiler.hooks.afterResolvers.tap("RequireRepeatHttpUrl", () => {
      const checkExtensionsResult = this.checkExtensions();
      if (checkExtensionsResult) {
        // 文件类型符合.js或者.ts
        readAllFolder(this.folderPath, checkExtensionsResult);
      }
    });
  }
  // 检查文件类型
  checkExtensions() {
    if (typeof this.extensions === "string") {
      // 文本类型
      if (this.checkSuffix(this.extensions.trim())) {
        return [this.extensions.trim()];
      }
      return false;
    } else if (Array.isArray(this.extensions)) {
      // 数组类型
      if (this.extensions.every((item) => this.checkSuffix(item.trim()))) {
        return this.extensions.map((item) => item.trim());
      }
      return false;
    }
    console.error("文件类型仅支持传递数组或字符串");
    return false;
  }
  //   检查后缀
  checkSuffix(extensions) {
    if ([".js", ".ts"].includes(extensions)) {
      return true;
    }
    console.error("仅支持检测js或ts文件");
    return false;
  }
}
module.exports = RequireRepeatHttpUrl;
