# Expense Tracker

A full-stack expense tracking application built with the MERN stack (MongoDB, Express, React, Node.js) that helps users manage their income and expenses with visualization tools and reporting features.


## Features

- **User Authentication**: Secure registration and login system
- **Dashboard**: Overview of financial status with income and expense summary
- **Income Management**: Add, view, edit, and delete income sources
- **Expense Tracking**: Categorize and track expenses
- **Data Visualization**: Charts and graphs to visualize financial data
- **Reports**: Generate and download income and expense reports as Excel files
- **Nepal Time (UTC+5:45)**: All dates and times are displayed in Nepal's timezone
- **Responsive Design**: Works on desktop and mobile devices
- **Emoji Picker**: Use emojis to categorize your transactions visually


## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Chart.js for data visualization
- Moment.js with timezone support
- Axios for API calls
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB for database
- Mongoose ODM
- JWT for authentication
- bcrypt.js for password hashing
- XLSX for Excel file generation
- CORS for cross-origin requests

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas connection)
- npm or yarn

### Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/saroj580/expense-tracker.git
cd expense-tracker
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_TOKEN=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

5. Start the backend server
```bash
cd backend
npm run dev
```

6. Start the frontend development server
```bash
cd frontend
npm start
```

7. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
expense-tracker/
├── backend/                 # Backend server code
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── model/               # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── connection.js        # Database connection
│   ├── server.js            # Server entry point
│   └── ...
├── frontend/                # React frontend
│   ├── public/              # Static files
│   └── src/
│       ├── assets/          # Images and assets
│       ├── components/      # React components
│       ├── context/         # React context
│       ├── hooks/           # Custom hooks
│       ├── page/            # Page components
│       ├── utils/           # Utility functions
│       ├── App.jsx          # Main App component
│       └── ...
└── README.md                # Project documentation
```

## Usage

### Registration and Login
- Register a new account with a valid email and password
- Log in with your credentials

### Dashboard
- View summary of your financial status
- See recent transactions
- Access quick links to add income or expenses

### Adding Income
- Click "Add Income" 
- Fill in the source, amount, and date
- Optionally add an icon
- Submit to save

### Adding Expenses
- Click "Add Expense"
- Select a category, enter amount and date
- Optionally add an icon
- Submit to save

### Generating Reports
- Navigate to Income or Expense section
- Click the Download button to generate an Excel report

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login a user
- `GET /api/v1/auth/getUser` - Get current user info
- `POST /api/v1/auth/upload-image` - Upload user profile image

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard data

### Income
- `POST /api/v1/income/add` - Add new income
- `GET /api/v1/income/get` - Get all incomes
- `DELETE /api/v1/income/:id` - Delete an income
- `GET /api/v1/income/downloads` - Download income report

### Expense
- `POST /api/v1/expense/add` - Add new expense
- `GET /api/v1/expense/get` - Get all expenses
- `DELETE /api/v1/expense/:id` - Delete an expense
- `GET /api/v1/expense/downloads` - Download expense report

### Transactions
- `GET /api/v1/transactions` - All transactions

## Future Enhancements

- Budget planning and tracking
- Recurring transactions
- Expense categories customization
- Dark mode support
- Mobile app version
- Email notifications for budget limits

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

- **Login Issues**: Make sure MongoDB is running and your credentials are correct
- **Date Format Problems**: The application uses Nepal timezone (UTC+5:45)
- **Download Not Working**: Ensure you have at least one transaction to download

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [Moment.js](https://momentjs.com/)

## Contact

Your Name - [chaudharysaroj844@gmail.com]

Project Link: [https://github.com/saroj580/Expense-Tracker.git]