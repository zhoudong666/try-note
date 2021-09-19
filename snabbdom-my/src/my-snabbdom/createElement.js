export default function createElement(vnode) {
  // console.log("createElement目的是把虚拟节点,变为真正DOM---vnode:", vnode);
  // 创建节点
  const domNode = document.createElement(vnode.sel);
  // 是 有子节点 还是 纯文本
  if (vnode.text && (!vnode.children || !vnode.children.length)) {
    domNode.innerText = vnode.text;
  } else if (Array.isArray(vnode.children) && vnode.children.length) {
    for (const item of vnode.children) {
      // 递归调用createElement创建子节点
      const childDom = createElement(item);
      // 将创建的子节点添加到父节点之下
      domNode.appendChild(childDom);
    }
  }
  // 补充elm属性
  vnode.elm = domNode;
  return vnode.elm;
}
