const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();

const upload = multer({
    dest: "uploads/"
});

app.use(express.static("public"));

app.post("/convert", upload.single("file"), (req, res) => {

    const outputFile =
        `output_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}.rbxmx`;

    execFile(
        "lua",
        [
            "lua2rbxmxv2.lua",
            req.file.path,
            outputFile
        ],
        (err) => {

            if (err) {
                console.error(err);

                try {
                    fs.unlinkSync(req.file.path);
                } catch {}

                return res.status(500).send(err.toString());
            }

            const outputName =
                path.parse(req.file.originalname).name + ".rbxmx";

            res.download(
                outputFile,
                outputName,
                () => {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch {}

                    try {
                        fs.unlinkSync(outputFile);
                    } catch {}
                }
            );
        }
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Online on port ${PORT}`);
});
