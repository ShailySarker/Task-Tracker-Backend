const mongoose = require('mongoose');

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Task Tracker DB Connected !!');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

