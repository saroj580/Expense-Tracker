require("dotenv").config();
const express = require("express");
const connectMongoDb = require("./connection.js")
const app = express()
const cors = require("cors");
const PORT = process.env.PORT || 5000;


const authRoutes = require("./routes/auth.route.js");
const incomeRoutes = require("./routes/income.route.js");
const expenseRoutes = require("./routes/expense.route.js")
const dashboardRoutes = require("./routes/dashboard.route.js");
const { formatNepalTime } = require("./utils/dateHelper");
const path = require("path");


//middleware to handle cors
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders : ["Content-Type", "authorization"],
}))


// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${formatNepalTime(new Date())}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Body parser middleware - enhanced configuration
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug middleware for request body
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Request body:', req.body);
    }
    next();
});



//connection
connectMongoDb(process.env.MONGO_URI)
    .then(() => console.log("MongoDb connected"))
    .catch((err) => console.log("Error while connecting Mongodb", err));

    
app.get("/", (req, res) => {
    res.status(200).send("Home")
})

//routes 
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

//serve uploads folder 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, (req, res) => {
    console.log(`Connected to http://localhost:${PORT}`)
})
