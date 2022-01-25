const fs = require("fs");

function read(url) {
  fs.readFile(url, "utf8", function (err, data) {
    if (err) throw err;
    console.log(data);
  });
}

read("./test1.txt");
read("./test2.txt");
read("./test3.txt");

console.dir(Promise);
