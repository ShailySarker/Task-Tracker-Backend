const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const database = require('./config/db');
const baseRoutes = require('./routes/baseRoutes');
const { errorHandler, notFound } = require('./middlewares/error');


dotenv.config();
const app = express();


// Middleware
app.use(
	cors({
		origin: ['http://localhost:3000', '*', 'https://task-tracker-website.vercel.app'],
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());


// Database connection
database.connectDB();


// Routes
app.use('/api/v1', baseRoutes);


// Error Handling
app.use(notFound);
app.use(errorHandler);


// PORT
const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
    console.log(`Task Tracker server running on port ${PORT}`);
});