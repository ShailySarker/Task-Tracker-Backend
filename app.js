const dotenv = require ('dotenv');
const express = require ('express');
const cors = require ('cors');
const database = require ('./config/db');


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
database.connectDB();

// PORT
const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
    console.log(`Task Tracker server running on port ${PORT}`);
});