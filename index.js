const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");
const { GlobalFonts, createCanvas, loadImage } = require("@napi-rs/canvas");
const fontPath = "./fonts/Ruang.ttf";
GlobalFonts.registerFromPath(path.resolve(fontPath), "Ruang");
// Menentukan port untuk server
const port = process.env.PORT || 1337;
// registerFont(path.resolve(fontPath), { family: "Ruang" });
// console.log(GlobalFonts.families);
app.get("/api/font", async (req, res) => {
    // Mengambil teks dan ukuran font dari query URL
    const text = req.query.q;
    const w = parseInt(req.query.w) || 650;
    const h = parseInt(req.query.h) || 200;
    const color = req.query.color || "black";
    const size = parseInt(req.query.size);

    if (!text || !size || isNaN(size)) {
        res.status(400).send("Parameter teks atau ukuran font tidak valid");
        return;
    }
    // Membuat canvas
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    // Mengatur font
    ctx.font = `${size || 24}px "Ruang"`;

    // Menghapus gambar latar belakang
    const padding = 30;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color.replace("=", "#");
    const textWidth = ctx.measureText(text).width; // Lebar teks
    const canvasCenterX = canvas.width / 2;
    const textX = canvasCenterX - textWidth / 2; // Posisi X di tengah - setengah lebar teks

    const textHeight = ctx.measureText(text).actualBoundingBoxAscent; // Tinggi teks (perkiraan)
    const canvasCenterY = canvas.height / 2;
    const textY = canvasCenterY - textHeight / 2;
    const maxWidth = canvas.width - padding * 2;
    // ctx.fillText(text, X, Y);
    // function wrapText(ctx, text, maxWidth) {
    //     let words = text.split(" "); // Memisahkan kata-kata
    //     let line = ""; // Baris teks saat ini
    //     let y =
    //         canvasCenterY - ctx.measureText(text).actualBoundingBoxAscent / 2; // Posisi Y awal
    //     let x = padding; // Posisi X awal (dengan padding)

    //     for (let i = 0; i < words.length; i++) {
    //         const word = words[i];
    //         const lineWidth = ctx.measureText(line + word).width; // Lebar baris saat ini

    //         // Memeriksa apakah kata berikutnya akan melebihi lebar maksimum
    //         if (lineWidth > maxWidth) {
    //             // Menulis baris saat ini
    //             ctx.fillText(line, x, y); // Menulis di tengah (dengan padding)
    //             y += ctx.measureText(word).actualBoundingBoxAscent; // Pindah ke baris baru
    //             x = padding; // Reset posisi X ke awal baris
    //             line = word; // Memulai baris baru dengan kata saat ini
    //         } else {
    //             line += " " + word; // Menambahkan kata ke baris saat ini
    //         }
    //     }

    //     // Menulis baris terakhir

    // }

    // // Menulis teks dengan pembungkusan
    // wrapText(ctx, text, maxWidth);
    ctx.textAlign = "center";
    let y = canvasCenterY - ctx.measureText(text).actualBoundingBoxAscent / 2;
    ctx.fillText(text, 650 / 2, y);
    const imageData = canvas.toDataURL("image/png");

    const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");

    res.contentType("image/png");
    res.send(imageBuffer);
});

const menipulatingImages = async (
    image,
    size = 24,
    text = "Default",
    width = 0,
    height = 0,
    color = "black",
    textAlign = "center",
    baseLine = "middle"
) => {
    const dimensions = sizeOf(image);
    if (width == "center") {
        width = dimensions.width / 2;
    }
    const canvas = createCanvas(dimensions.width, dimensions.height);
    const ctx = canvas.getContext("2d");
    var img = await loadImage(image);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = baseLine;

    ctx.font = `${size}px Ruang`;
    ctx.fillText(text, parseInt(width), parseInt(height));

    const imageData = canvas.toDataURL("image/png");

    const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");
    return imageBuffer;
};

app.get("/api/images/nadeshiko", async function (req, res) {
    const {
        q: text,
        color = "white",
        size = 24,
        w: width = 50,
        h: height = 50,
    } = req.query;
    if (!text || !size || isNaN(size)) {
        res.status(400).json({
            error: "Parameter teks atau ukuran font tidak valid",
        });
        return;
    }
    console.log(color.replace("=", "#"));
    res.contentType("image/png");
    res.send(
        await menipulatingImages(
            path.resolve("./images/nadeshiko.jpg"),
            size,
            text,
            width,
            height,
            color.replace("=", "#")
        )
    );
});

app.get("/api/images/paper", async function (req, res) {
    const {
        q: text,
        color = "black",
        size = 24,
        w: width = 154,
        h: height = 355,
    } = req.query;
    if (!text || !size || isNaN(size)) {
        res.status(400).json({
            error: "Parameter teks atau ukuran font tidak valid",
        });
        return;
    }
    res.contentType("image/png");
    res.send(
        await menipulatingImages(
            path.resolve("./images/paper.jpg"),
            size,
            text,
            width,
            height,
            color
        )
    );
});

app.get("/api/images/chizuru", async function (req, res) {
    const {
        q: text,
        color = "black",
        size = 24,
        w: width = 366,
        h: height = 600,
        align = "center",
        baseline = "middle",
    } = req.query;
    if (!text || !size || isNaN(size)) {
        res.status(400).json({
            error: "Parameter teks atau ukuran font tidak valid",
        });
        return;
    }
    res.contentType("image/png");
    res.send(
        await menipulatingImages(
            path.resolve("./images/kyaaa.jpg"),
            size,
            text,
            width,
            height,
            color.replace("=", "#"),
            align,
            baseline
        )
    );
});

app.get("/api/images/nyot", async function (req, res) {
    const {
        q: text,
        color = "#fff",
        size = 24,
        w: width = 285,
        h: height = 510,
        align = "center",
        baseline = "middle",
    } = req.query;
    if (!text || !size || isNaN(size)) {
        res.status(400).json({
            error: "Parameter teks atau ukuran font tidak valid",
        });
        return;
    }
    res.contentType("image/png");
    res.send(
        await menipulatingImages(
            path.resolve("./images/ahh.jpg"),
            size,
            text,
            width,
            height,
            color.replace("=", "#"),
            align,
            baseline
        )
    );
});

app.get("/api/images/rikka", async function (req, res) {
    const {
        q: text,
        color = "black",
        size = 24,
        w: width,
        h: height = 610,
        align = "center",
        baseline = "middle",
    } = req.query;
    if (!text || !size || isNaN(size)) {
        res.status(400).json({
            error: "Parameter teks atau ukuran font tidak valid",
        });
        return;
    }
    res.contentType("image/png");
    res.send(
        await menipulatingImages(
            path.resolve("./images/rikka.png"),
            size,
            text,
            width,
            height,
            color.replace("=", "#"),
            align,
            baseline
        )
    );
});
// Menjalankan server
app.listen(1337);

module.exports = app;
