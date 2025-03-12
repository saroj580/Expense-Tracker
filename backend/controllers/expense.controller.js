const xlsx = require('xlsx');
const Expense = require("../model/expense.model");

exports.addExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, category, amount, date } = req.body;

        //check : validation of missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date : new Date(date)  //YYYY-MM-DDTHH:mm:ss.sssZ //2025-03-12T11:46:00.000Z
        })

        await newExpense.save();
        return res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server Error!!!", error: error.message });
    }
}

exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server Error!!!", error: error.message });
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id)
        res.status(200).json("Expense deleted Successfully.")
    } catch (error) {
        res.status(500).json({ message: "Server Error!!!", error: error.message });
    }
}

exports.downloadExpenseExcel = async(req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        const data = expense.map((item) => ({
            category: item.category,
            Amount: item.amount,
            Date: item.date
        }))

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx')
    } catch (error) {
        res.status(500).json({ message: "Server Error!!!", error: error.message });
    }
}