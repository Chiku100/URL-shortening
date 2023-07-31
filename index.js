import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import axios from "axios";
import { fileURLToPath } from 'url';
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
app.use(express.static("public"))
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.render(__dirname + "/views/index.ejs")
});

app.post("/", async (req, res) => {
    const link = req.body.inputs
    try {
        const response = await axios.get(`https://api.shrtco.de/v2/shorten?url=${link}`);
        const result = response.data;
        res.render("index.ejs", { data: result.result.short_link });
        // console.log(result.result.short_link);
        // console.log(data);
    } catch (e) {
        console.log(e.data);
        // console.error("Failed to make request:", error.error);
        res.render("index.ejs", {
            error: e.data
        });
    }

});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

