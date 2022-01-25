console.log("hello");
function Promise(executor) {
  // 定义状态

  // 正在进行
  this.status = "pending";
  // 成功的值
  this.success = undefined;
  // 失败的值
  this.error = undefined;

  const that = this;

  this.onfufilledCallback = [];
  this.onrejectedCallback = [];

  // 成功的函数
  function resolve(val) {
    if (that.status === "pending") {
      that.status = "fufilled";
      that.success = val;
      that.onfufilledCallback.forEach((item) => item());
    }
  }
  // 失败的函数
  function reject(val) {
    if (that.status === "pending") {
      that.status = "rejected";
      that.error = val;
      that.onrejectedCallback.forEach((item) => item(that.error));
    }
  }

  try {
    // 因为 new Promise 里会立刻执行, 所以定义的executor 要执行
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
Promise.prototype.then = function (onfufilled, onrejected) {
  const that = this;
  let ppp = new Promise(function (res, rej) {
    if (that.status === "fufilled") {
      // 走的成功状态
      let rr = onfufilled(that.success);
      res(rr);
    } else if (that.status === "rejected") {
      // 走的失败状态
      let rr = onrejected(that.error);
      res(rr);
    } else if (that.status === "pending") {
      // 说明没有走成功和失败
      that.onfufilledCallback.push(() => {
        let rr = onfufilled(that.success);
        res(rr);
      });
      that.onrejectedCallback.push(() => {
        let rr = onrejected(that.error);
        res(rr);
      });
    }
  });
  return ppp;
};

Promise.prototype.catch = function (err) {
  return this.then(() => {}, err);
};

module.exports = Promise;
