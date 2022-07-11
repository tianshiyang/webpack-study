class Bar {
  constructor(name) {
    this.name = name
  }
  setName(name) {
    this.name = name
  }
  foo1() {
    return this.name
  }
  foo2 = () => true
}

const foo1 = new Bar("张三")
const foo2 = new Bar("张三")
foo1.setName('zhangsan')
console.log(foo2.foo1())
// console.log(foo1.foo1 == foo2.foo1)
// console.log(foo1.foo2 == foo2.foo2)



console.log(foo1.foo1)