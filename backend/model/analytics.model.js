import mongoose from "mongoose"

const analyticsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalSpending: {
        type: Number,
        default: 0
    },
    categorySpending: [{
      categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category'
        },
        total: {
          type: Number,
          default: 0
        },
    }],
    accountSpending: [{
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Account'
        },
        total: {
            type: Number,
            default: 0
        },
    }],
    createdAt: { type: Date, default: Date.now },
});

export const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;