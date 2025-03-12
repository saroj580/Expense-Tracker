const xlsx = require('xlsx');
const Income = require("../model/income.model");

exports.addIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, source, amount, date } = req.body;

        //check : validation of missing fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date : new Date(date)  //YYYY-MM-DDTHH:mm:ss.sssZ //2025-03-12T11:46:00.000Z
        })

        await newIncome.save();
        return res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server Error!!!", error: error.message });
    }
}

exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ message: "Server Error!!!", error: error.message });
    }
}

exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id)
        res.status(200).json("Imcome deleted Successfully.")
    } catch (error) {
        res.status(500).json({ message: "Server Error!!!", error: error.message });
    }
}

exports.downloadIncomeExcel = async(req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
        }))

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download('income_details.xlsx')
    } catch (error) {
        res.status(500).json({ message: "Server Error!!!", error: error.message });
    }
}