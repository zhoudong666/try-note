class Observer {
  constructor(data) {
    this.observe(data);
  }
  observe(obj) {
    if (typeof obj === "object") {
      var keys = Object.keys(obj);
      keys.forEach((key) => {
        this.reactDefine(obj, key, obj[key]);
      });
    }
  }
  reactDefine(obj, key, value) {
    var that = this;
    // 对值也是对象的进行处理
    this.observe(value);
    // vue核心 定义响应式位置  和 创建依赖收集
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get: function () {
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: function (newVal) {
        that.observe(newVal);
        if (value !== newVal) {
          value = newVal;
          dep.notify(newVal);
          dep.refreshOldVal(newVal);
        }
      },
    });
  }
}

// 依赖采集器
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify(newVal) {
    this.subs.forEach((item) => item.update(newVal));
  }
  refreshOldVal(newVal) {
    this.subs.forEach((item) => (item.oldVal = newVal));
  }
}

// watcher监视
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb; //回调 跟新
    this.oldVal = this.getOldVal();
  }
  getOldVal() {
    Dep.target = this;
    const oldV = utils.getVal(this.expr, this.vm); //this.vm.$data[this.expr];
    Dep.target = null;
    return oldV;
  }
  update(newVal) {
    this.cb(newVal);
  }
}
