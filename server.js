const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");

const app = express();

const upload = multer({
    dest: "uploads/"
});

app.use(express.static("public"));

app.post("/convert", upload.single("file"), (req, res) => {

    execFile(
        "lua",
        [
            "lua2rbxmxv2.lua",
            req.file.path
        ],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send(err.toString());
            }

            res.download(
                "lua2rbxmx.rbxmx",
                () => {
                    fs.unlinkSync(req.file.path);
                }
            );
        }
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Online");
});
