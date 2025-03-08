import express from "express"
import connectMongoDb from "./connection.js"
import dotenv from "dotenv";
const app = express()

import userRouter from "./routes/user.route.js";


dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connection
connectMongoDb("mongodb://127.0.0.1:27017/Expense-Tracker")
    .then(() => console.log("MongoDb connected"))
    .catch((err) => console.log("Error while connecting Mongodb", err));

    
app.get("/", (req, res) => {
    res.status(200).send("Home")
})

//routes 
app.route("/user", userRouter);

app.listen(process.env.PORT, (req, res) => {
    console.log(`Connected to http://localhost:${process.env.PORT}`)
})
