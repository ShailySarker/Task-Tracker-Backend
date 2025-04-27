const dotenv = require ('dotenv');
const express = require ('express');
const cors = require ('cors');


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
    console.log(`Task Tracker server running on port ${PORT}`);
});