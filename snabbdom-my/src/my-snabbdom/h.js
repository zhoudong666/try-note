import vnode from "./vnode.js";

// 编写一个低配版本的h函数, 这个函数必修接收3个参数
// 形态1 h('div',{},'文字')
// 形态2 h('div',{},[])
// 形态3 h('div',{},h())

export default function (sel, data, c) {
  // 查看参数数量是否为3
  if (arguments.length != 3) throw new Error("参数过少");
  // 判断参数c的类型
  if (typeof c === "string" || typeof c === "number") {
    return vnode(sel, data, undefined, c, undefined);
  } else if (Array.isArray(c)) {
    const children = [];
    c.forEach((item) => {
      if (
        typeof item !== "object" ||
        (typeof item === "object" && !item.hasOwnProperty("sel"))
      ) {
        throw new Error("数组中有不满足是对象的项");
      }
      children.push(item);
    });
    return vnode(sel, data, children, undefined, undefined);
  } else if (typeof c === "object" && c.hasOwnProperty("sel")) {
    const children = [c];
    return vnode(sel, data, children, undefined, undefined);
  }
}
