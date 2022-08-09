import { request } from "http";

export function testApi1() {
  return request({
    url: "api/test1.json"
  })
}