const express = require("express");
const { addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel
} = require("../controllers/income.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/downloads", protect, downloadIncomeExcel);

router.delete("/:id", protect, deleteIncome);


module.exports = router;