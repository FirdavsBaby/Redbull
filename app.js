const express = require('express');
const Io = require('./utils/io');
const Cards =  new Io("./db/cards.json")
const cors = require('cors');
const fileupload = require('express-fileupload');
const Joi = require('joi');
const app = express();
const Card = require('./models/card');
const {v4} = require('uuid');
app.use(cors());
app.use(fileupload())
app.use(express.static(process.cwd() + "/uploads/"))
app.use(express.json());


app.get("/api/cards", async(req,res)=> {
    const cards = await Cards.read();
    const data = cards.length ? cards : {message: "No cards found"}
    res.status(200).json(data);
})

app.post("/api/add-card", async(req,res)=> {
    const cards = await Cards.read();
    const {title, description} = req.body;
    const {image} = req?.files;
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.required()
    })
    const {error} = schema.validate({title, description, image});
    if (error) {
        return res.status(400).json({error: error.message})
    }
    const imagePath = `${v4()}.${image.mimetype.split('/')[1]}`
    image.mv(`${process.cwd()}/uploads/${imagePath}`)
    const newCard = new Card(title, imagePath, description)
    const data = cards.length ? [...cards, newCard] : [newCard]
    Cards.write(data)
    res.status(200).json({message: "Card added successfully"})
})


app.listen(5000, ()=> {
    console.log("Server is running on port 5000");
})