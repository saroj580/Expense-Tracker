const express = require("express");
const { addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel
} = require("../controllers/expense.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/downloads", protect, downloadExpenseExcel);

router.delete("/:id", protect, deleteExpense);


module.exports = router;