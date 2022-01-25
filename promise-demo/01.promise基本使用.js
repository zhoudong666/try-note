let Promise = require("./myPromise");

let p = new Promise(function (resolve, reject) {
  // 成功状态
  resolve("success");
  // 失败状态
  // reject("error");
  // console.log(999); // 会立刻执行

  // setTimeout(() => {
  //   resolve("success success");
  // }, 1000);
});
p.then(
  function (data) {
    console.log(data, "sss");
    return 77;
  },
  function (err) {
    console.log(err, "eee");
  }
)
  .then(
    function (data) {
      console.log(data + "1");
    },
    function (err) {
      console.log(err + "2");
    }
  )
  .then(
    function (data) {
      console.log(data + "111");
    },
    function (err) {
      console.log(err + "222");
    }
  );
