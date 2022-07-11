let tsName: string = "typescriptName"

const getTsName: () => string = () => {
  return tsName
}

const setTsName: (name: string) => void = (name: string) => {
  tsName = name
}

export {
  getTsName,
  setTsName
}