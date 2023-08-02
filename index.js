import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import axios from "axios";
import { fileURLToPath } from 'url';
const app = express();
import messages from "./schema.js"
import mongoose from "mongoose";
import { error } from "console";
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
app.use(express.static("public"))
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

app.get("/", async (req, res) => {
    const collections = await messages.find()
    res.render(__dirname + "/views/index.ejs", { collections })
});
main().catch((err) => console.log(err))
async function main() {
    await mongoose.connect("mongodb+srv://admin-chiku:YDEQxOLECDf0xYmP@cluster0.tsetr.mongodb.net/")
}

app.post("/", async (req, res) => {
    const link = req.body.inputs

    try {
        const response = await axios.get(`https://api.shrtco.de/v2/shorten?url=${link}`);
        const result = response.data;

        const run = async () => {
            try {

                const userData = new messages({
                    long_url: link,
                    short_url: result.result.short_link

                })
                await userData.save()
            } catch (error) {
                console.log(error);
            }
        }
        run()
        const copy = (text) => {
            console.log("copied value " + result.result.short_link);
            // navigator.clipboard.writeText(link.short_link);
            // global.navigator.clipboard.writeText(result.result.short_link);
        }
        res.redirect("/")
    } catch (e) {
        res.render("index.ejs", {
            error: e.data
        });
    }

});
app.post('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await messages.findByIdAndDelete(id)
        console.log(`Document with ${data} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
    res.redirect("/")
})
// app.post("/delete",async(req,res)=>{
//     console.log("delete");
    // await messages.deleteOne({}, function(err, obj) {
    //     if (err) throw err;
    //     console.log("1 document deleted");
    //     db.close();
    //   });
    // console.log(req);
// res.redirect("/")
// })
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

