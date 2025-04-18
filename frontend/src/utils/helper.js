import moment from "moment";
import "moment-timezone";

// Configure moment to use Nepal timezone
const NEPAL_TIMEZONE = "Asia/Kathmandu";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getInitials = (name) => {
    if (!name)
        return "";
    const words = name.split(" ");
    let initials = "";
    for (let i = 0; i < Math.min(words.length, 2); i++){
        initials += words[i][0];
    }
    return initials.toUpperCase();
}

export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num))
        return "";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return fractionalPart
        ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
}

export const prepareExpenseChartData = (data = []) => {
    const chartData = data.map((item) => ({
        category: item?.category,
        amount: item?.amount,
    }))
    console.log("Prepared Chart Data:", chartData);
    return chartData;
}

export const prepareIncomeChartData = (data = []) => { 
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const chartData = sortedData.map((item) => ({
        month: formatNepalDate(item?.date),
        amount: item?.amount,
        source: item?.source

    }));
    return chartData;
}

// Format a date to Nepal Time
export const formatNepalDate = (date) => {
    return moment(date).tz(NEPAL_TIMEZONE).format("Do MMM YYYY");
};

// Format a date with time to Nepal Time
export const formatNepalDateTime = (date) => {
    return moment(date).tz(NEPAL_TIMEZONE).format("Do MMM YYYY, h:mm A");
};

export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const chartData = sortedData.map((item) => ({
        month: formatNepalDate(item?.date),
        amount: item?.amount,
        category: item?.category

    }));
    return chartData;
}