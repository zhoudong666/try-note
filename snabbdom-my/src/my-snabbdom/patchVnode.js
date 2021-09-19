import createElement from "./createElement";
import updateChildren from "./updateChildren";

export default function patchVnode(oldVnode, newVnode) {
  // 是同一个对象的情况下,啥都不做
  if (oldVnode === newVnode) return;
  // 节点有text属性,则没有children属性 => 在 h 函数里已经做了分析判断
  if (newVnode.text) {
    if (oldVnode.text === newVnode.text) return;
    // 只要判断老节点与新节点text不相等,直接赋值
    if (oldVnode.text !== newVnode.text) oldVnode.elm.innerText = newVnode.text;
  } else {
    // 节点没有text属性,则有children
    // 老节点有children
    if (oldVnode.children && oldVnode.children.length) {
      //
      //四种命中查找
      // 1. 新前与旧前
      // 2. 新后与旧后
      // 3. 新后与旧前  移动节点到 旧后的 后面
      // 4. 新前与旧后  移动节点到 旧前的 前面
      // 命中一种就不再进行命中判断
      // 如果都没有命中,就需要用循环来寻找
      //
      //
      updateChildren(oldVnode.elm, newVnode.children, oldVnode.children);
    } else {
      // 老节点没有children
      oldVnode.elm.innerText = "";
      newVnode.children.forEach((item) => {
        var el = createElement(item);
        oldVnode.elm.appendChild(el);
      });
    }
  }
}
