import express from "express";
import multer from "multer";
import path from "node:path";
import * as fs from "node:fs";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join('public/'+req.params.username+'/');

        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        const filename = `${file.fieldname}-${Date.now()}.${ext}`;
        console.log(`Saving file as: ${filename}`);
        cb(null, filename);
    }
})
const upload = multer({ storage: storage });
const base = process.env.DOMAIN_BASE;
router.post(`/:username`, upload.single('file'), (req, res) => {
    const fileUrl = `${base}/${req.params.username}/${req.file?.filename}`;
    console.log('params:', req.params);
    res.status(200).send({ url: fileUrl });
    console.log(fileUrl);
});
export default router;