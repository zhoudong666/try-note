import patchVnode from "./patchVnode";
import createElement from "./createElement";

function isSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key;
}
export default function updateChildren(parentElm, newChildren, oldChildren) {
  // console.log(parentElm, newChildren, oldChildren);
  // 新前
  let newStartIndex = 0;
  // 旧前
  let oldStartIndex = 0;
  // 新后
  let newEndIndex = newChildren.length - 1;
  // 旧后
  let oldEndIndex = oldChildren.length - 1;

  // 新前节点
  let newStartVnode = newChildren[newStartIndex];
  // 旧前节点
  let oldStartVnode = oldChildren[oldStartIndex];
  // 新后节点
  let newEndVnode = newChildren[newEndIndex];
  // 旧后节点
  let oldEndVnode = oldChildren[oldEndIndex];
  // 旧节点key和index集合
  let keyMap = {};
  oldChildren.forEach((item, index) => {
    if (item.key) keyMap[item.key] = index;
  });
  while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]; // 旧前加一,旧前节点更新
    } else if (!newStartVnode) {
      newStartVnode = newChildren[++newStartIndex]; // 新前加一,新前节点更新
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 新前与旧前 相同命中
      patchVnode(oldStartVnode, newStartVnode);
      newStartVnode = newChildren[++newStartIndex]; // 新前加一,新前节点更新
      oldStartVnode = oldChildren[++oldStartIndex]; // 旧前加一,旧前节点更新
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 新后与旧后 相同命中
      patchVnode(oldEndVnode, newEndVnode);
      newEndVnode = newChildren[--newEndIndex]; // 新后减一,新后节点更新
      oldEndVnode = oldChildren[--oldEndIndex]; // 旧后减一,旧后节点更新
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 新后与旧前 相同命中
      patchVnode(oldStartVnode, newEndVnode);
      newEndVnode = newChildren[--newEndIndex]; // 新后减一,新后节点更新
      oldStartVnode = oldChildren[++oldStartIndex]; // 旧后减一,旧后节点更新
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSiblings);
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 新前与旧后 相同命中
      patchVnode(oldEndVnode, newStartVnode);
      newStartVnode = newChildren[++newStartIndex]; // 新后减一,新后节点更新
      oldEndVnode = oldChildren[--oldEndIndex]; // 旧后减一,旧后节点更新
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
    } else {
      let index_in_oldChildren = keyMap[newStartVnode.key];
      if (index_in_oldChildren === undefined) {
        // 旧节点中没有,需要新增
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm);
        patchVnode(oldStartVnode, newStartVnode);
      } else {
        // 旧节点中有,移动即可
        let moveVnode = oldChildren[index_in_oldChildren];
        parentElm.insertBefore(moveVnode.elm, oldStartVnode.elm);
        patchVnode(moveVnode, newStartVnode);
        oldChildren[index_in_oldChildren] = undefined;
      }
      newStartVnode = newChildren[++newStartIndex];
    }
  }

  // 继续看还有没有剩余
  if (newStartIndex <= newEndIndex) {
    // new 还有剩余
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      parentElm.appendChild(createElement(newChildren[i]));
    }
  } else if (oldStartIndex <= oldEndIndex) {
    // old 还有剩余
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      // 因为上面 对 不符合四种命中的结果 处理 是老节点存在情况下,设置为undefined 所以移除需要判空
      if (oldChildren[i]) parentElm.removeChild(oldChildren[i].elm);
    }
  }
}
