const Income = require("../model/income.model");
const Expense = require("../model/expense.model");
const { isValidObjectId, Types } = require('mongoose');
const { formatNepalTime } = require('../utils/dateHelper');

//Dashboard data
exports.getdashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("User Data:", req.user);
        
        const userObjectId = new Types.ObjectId(String(userId));

        //fetch total income 
        const totalIncome = await Income.aggregate([
            {
                $match: { userId: userObjectId }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            },
        ]);

        console.log("TotalIncome", { 
            totalIncomeAmount: totalIncome.length > 0 ? totalIncome[0].total : 0,
            recordCount: totalIncome.length,
            timestamp: formatNepalTime(new Date())
        });


        //fetch the total expense 
        const totalExpense = await Expense.aggregate([
            {
                $match: { userId: userObjectId }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ])

        console.log("TotalExpense", { 
            totalExpenseAmount: totalExpense.length > 0 ? totalExpense[0].total : 0,
            recordCount: totalExpense.length,
            timestamp: formatNepalTime(new Date())
        });
        
        //get income transaction of last 60 days
        const last60DaysIncomeTransaction = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });
        
        //get totalincome for last 60days
        const incomeLast60Days = last60DaysIncomeTransaction.reduce((sum, transaction) => sum + transaction.amount, 0);

        //get expense transaction of last 30 days
        const last30DaysExpenseTransaction = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //get totalExpense of last 30 days
        const expenseLast30Days = last30DaysExpenseTransaction.reduce((sum, transaction) => sum + transaction.amount, 0);

        //fetch last 5 days transaction (income + expense)
        const lastIncomeTransactions = await Income.find({ userId }).sort({ date: -1 }).limit(5);
        const lastExpenseTransactions = await Expense.find({ userId }).sort({ date: -1 }).limit(5);
            
        const lastTransaction = [
            ...lastIncomeTransactions.map((txn) => ({ ...txn.toObject(), type: "income" })),
            ...lastExpenseTransactions.map((txn) => ({ ...txn.toObject(), type: "expense" }))
        ].sort((a, b) => b.date - a.date);

        // const lastTransaction = [
        //     ...(await Income.find({ userId })
        //         .sort({ date: -1 })
        //         .limit(5)
        //         .map((txn) => ({
        //             ...txn.toObject(),
        //             type: "income",
        //         })
        //         )),
        //     ...(await Expense.find({ userId })
        //         .sort({ date: -1 })
        //         .limit(5)
        //         .map((txn) => ({
        //             ...txn.toObject(),
        //             type: "expense",
        //         })
        //         )),
        // ].sort((a, b) => b.date - a.date) //sort latest first

        // Fetch uploaded images for the user
        // const uploadedImages = await Image.find({ userId }); // Assuming there is an Image model

        res.json({
            // uploadedImages, // Include the uploaded images in the response

            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: expenseLast30Days,
                transaction : last30DaysExpenseTransaction
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transaction : last60DaysIncomeTransaction
            },
            recentTransaction: lastTransaction,
        })

    } catch (error) {
        res.status(500).json({ message: 'Server Error !!!' , error});
    }
}
