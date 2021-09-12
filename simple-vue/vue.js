class Vue {
  constructor(options) {
    let elIsObj = typeof options.el === "object";
    this.$el = elIsObj ? options.el : document.querySelector(options.el);
    this.$data = options.data;
    this.$options = options;

    // 数据监听
    new Observer(this.$data);
    // 解析器解析
    new Compile(this.$el, this);
    // 代理 this.$data
    this.proxyData(this.$data);
  }
  proxyData(data) {
    for (const key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newVal) {
          data[key] = newVal;
        },
      });
    }
  }
}

class Compile {
  constructor(el, vm) {
    // 判断根元素是元素节点的前提下
    if (this.isElement(el)) {
      // 节点转为片段
      const f = this.node2Fragment(el);
      this.compiler(f, vm);

      // 将片段一次性添加到根节点
      el.appendChild(f);
    }
  }

  // 判断是否是节点
  isElement(el) {
    return el.nodeType === 1;
  }
  // 节点转为片段
  node2Fragment(el) {
    let first;
    const f = document.createDocumentFragment();
    while ((first = el.firstChild)) {
      f.appendChild(first);
    }
    return f;
  }
  compiler(fragment, vm) {
    // console.dir(fragment);
    [...fragment.childNodes].forEach((node) => {
      if (this.isElement(node)) {
        [...node.attributes].forEach((attr) => {
          const { nodeName, nodeValue } = attr;
          if (this.isDirective_v(nodeName)) {
            const dirType = nodeName.substr(2);
            const [eventDir, eventName] = dirType.split(":");
            utils[eventDir](node, nodeValue, vm, eventName);
          } else if (this.isDirective_at(nodeName)) {
            const eventName = nodeName.substr(1);
            utils["on"](node, nodeValue, vm, eventName);
          }
        });
        // item.innerText = 22;
      } else {
        if (node.nodeValue.indexOf("{{") > -1) {
          utils["text"](node, node.nodeValue, vm);
        }
      }

      // 子节点可能还有子节点,调用自己
      this.compiler(node, vm);
    });
  }
  isDirective_v(attr) {
    return attr.startsWith("v-");
  }
  isDirective_at(attr) {
    return attr.startsWith("@");
  }
}

utils = {
  //获取新值 对{{a}}--{{b}} 这种格式进行处理
  getContentVal(expr, vm) {
    const reg = /\{\{(.+?)\}\}/g;
    return expr.replace(reg, (...arg) => {
      return this.getVal(arg[1], vm);
    });
  },
  getVal(expr, vm) {
    if (expr.indexOf("{{") > -1) {
      return this.getContentVal(expr, vm);
    } else {
      // return vm.$data[expr];  // 这种只能处理最简单最外层的数据
      // expr 可能是多级嵌套关系 所以 需要特殊处理
      return expr.split(".").reduce((data, curr) => {
        return data[curr];
      }, vm.$data);
    }
  },
  setVal(expr, vm, value) {
    const exprArr = expr.split(".");
    exprArr.reduce((data, curr, index) => {
      // return (data[curr] = value);
      if (index === exprArr.length - 1) {
        data[curr] = value;
      } else {
        return data[curr];
      }
    }, vm.$data);
  },
  // 包含 mustache 语法的 换取内容后的值
  getContentVal(expr, vm) {
    return expr.replace(/\{\{(.+?)\}\}/g, (...arg) => {
      return this.getVal(arg[1], vm);
    });
  },
  text: function (node, expr, vm) {
    // 不是 mustache 语法的 是 v-text 情况下,类似v-html
    if (expr.indexOf("{{") === -1) {
      new Watcher(vm, expr, (newVal) => {
        this.updater.textUpdater(node, newVal);
      });
      this.updater.textUpdater(node, this.getVal(expr, vm));
    } else {
      // 包含 mustache 语法的,需要先正则匹配符合条件的各个表达式,arg[1]
      const value = expr.replace(/\{\{(.+?)\}\}/g, (...arg) => {
        new Watcher(vm, arg[1], () => {
          this.updater.textUpdater(node, this.getContentVal(expr, vm));
        });
        return this.getVal(arg[1], vm);
      });
      this.updater.textUpdater(node, value);
    }
  },
  html: function (node, expr, vm) {
    new Watcher(vm, expr, (newVal) => {
      this.updater.htmlUpdater(node, newVal);
    });
    this.updater.htmlUpdater(node, this.getVal(expr, vm));
  },
  model: function (node, expr, vm) {
    // 绑定更新函数  数据 => 视图
    new Watcher(vm, expr, (newVal) => {
      this.updater.modelUpdater(node, newVal);
    });
    // 视图 => 数据 => 视图
    node.addEventListener(
      "input",
      function (e) {
        this.setVal(expr, vm, e.target.value);
      }.bind(this),
      false
    );
    this.updater.modelUpdater(node, this.getVal(expr, vm));
  },
  on: function (node, expr, vm, eventName) {
    const fn = vm.$options.methods && vm.$options.methods[expr];
    node.addEventListener(eventName, fn);
  },

  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    },
  },
};
