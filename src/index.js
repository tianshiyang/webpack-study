import { add, sub } from "./es6/math.js"
console.log("index.js")
console.log("es6 ========")
console.log("add:", add(1, 2))
console.log("sub:", sub(20, 1))

const { getName, getAge } = require("./common/index.js")
console.log("common ========")
console.log("getName: ", getName("张三"))
console.log("getAge: ", getAge(22))

import "./css/index.css"

console.log("ts ================")
import { getTsName, setTsName } from "./ts/index.ts"
setTsName("typeScript!!!!")
console.log(getTsName())

console.log("alias =========")
import { aliasFunction } from "@/module/index.ts"
aliasFunction()

import $ from 'jquery'
$("#jqueryDom").text("从cdn获取的外部扩展，不打包到dist文件中")
console.log($("#jqueryDom"))


import { testApi1 } from "@/api/test1.js"
console.log(testApi1())