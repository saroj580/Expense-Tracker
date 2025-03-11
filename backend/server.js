require("dotenv").config();
const express = require("express");
const connectMongoDb = require("./connection.js")
const dotenv = require("dotenv");
const app = express()
const cors = require("cors");
const PORT = process.env.PORT || 5000;


const authRoutes = require("./routes/auth.route.js")

//middleware to handle cors
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders : ["Content-Type", "authorization"],
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connection
connectMongoDb(process.env.MONGO_URI)
    .then(() => console.log("MongoDb connected"))
    .catch((err) => console.log("Error while connecting Mongodb", err));

    
app.get("/", (req, res) => {
    res.status(200).send("Home")
})

//routes 
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, (req, res) => {
    console.log(`Connected to http://localhost:${PORT}`)
})
