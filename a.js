const express = require("express");
const app = express();
const fs = require("fs");
const sizeOf = require("image-size");
const path = require("path");
const { GlobalFonts, createCanvas, loadImage } = require("@napi-rs/canvas");
const fontPath = "./fonts/Ruang.ttf";
GlobalFonts.registerFromPath(path.resolve(fontPath), "Ruang");

const canvas = createCanvas(760, 360);
const ctx = canvas.getContext("2d");

ctx.font = "100px Ruang";
ctx.fillText("abc", 50, 300);
ctx.fillStyle = "black";
const b = canvas.toDataURL("image/png");
const imageBuffer = Buffer.from(b.split(",")[1], "base64");

app.get("/", function (req, res) {
    res.contentType("image/png");
    res.send(imageBuffer);
});

app.listen(1337);

module.exports = app;
