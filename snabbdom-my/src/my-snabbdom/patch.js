// patch函数被调用 处理流程
// 判断oldVnode 是虚拟节点还是DOM节点
//     是DOM节点的话, 将其包装成虚拟节点
//     不是DOM节点,便是虚拟节点, 直接和newVnode比较,是不是同一个节点
//         不是同一个节点,暴力删除旧的,插入新的
//         是同一个节点, 精细化比较

import vnode from "./vnode";
import createElement from "./createElement";
import patchVnode from "./patchVnode";

export default function (oldVnode, newVnode) {
  //     是DOM节点的话, 将其包装成虚拟节点
  if (!oldVnode.sel) {
    const sel = oldVnode.tagName.toLowerCase();
    oldVnode = vnode(sel, {}, [], "", oldVnode, null);
  }
  // 判断是不是同一个节点 是的话
  if (oldVnode.sel === newVnode.sel && oldVnode.key === newVnode.key) {
    // 是同一个节点的情况下
    patchVnode(oldVnode, newVnode);
  } else {
    // 不是一个节点   直接将新的虚拟节点生成DOM节点,删除旧的
    var newElm = createElement(newVnode);
    // 有返回DOM节点的话,就追加到父节点
    if (newElm) oldVnode.elm.parentNode.insertBefore(newElm, oldVnode.elm);
    // 删除就的节点
    oldVnode.elm.parentNode.removeChild(oldVnode.elm);
  }
}
