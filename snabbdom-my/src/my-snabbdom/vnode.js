// 函数的功能非常简单, 就是把传入的参数组合成对象再返回去
export default function (sel, data, children, text, elm) {
  return { sel, data, children, text, elm, key: data.key };
}
