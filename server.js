require("dotenv").config();

const { PORT, MONGODB_URI } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// import middleware
const cors = require("cors");
const morgan = require("morgan");

//db connection
mongoose.connect(MONGODB_URI);
mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected"))
  .on("error", (error) => console.log(error))

//models
const RecipeSchema = new mongoose.Schema({
    title: String,
    diet_label: String,
    image: String,
    ingredients: String,
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

//Middleware
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

//test route
app.get("/recipe", async (req, res) => {
    try {
        res.json(await Recipe.find(req.body));
      } catch (error) {
        res.status(400).json(error);
      }
  });

//Recipe create
app.post("/recipe", async (req, res) => {
    try {
      res.json(await Recipe.create(req.body));
    } catch (error) {
      res.status(400).json(error);
    }
  });

// Recipe update
app.put('/recipe/:id', async (req,res) => {
    try {
      res.json(
        await Recipe.findByIdAndUpdate(req.params.id, req.body)
      )
    } catch (error) {
      res.status(400).json(error);
    }
  })

// Recipe delete
app.delete("/recipe/:id", async (req, res) => {
    try {
      res.json(await Recipe.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });


//listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));




