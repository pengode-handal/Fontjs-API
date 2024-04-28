const sizeOf = require("image-size");

var a = sizeOf("./images/nadeshiko.jpg");
console.log(a.height + " " + a.width);
