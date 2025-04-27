const { generateToken } = require("../config/jwt");
const { APIError } = require("../middlewares/error");
const User = require("../models/userModel");

// ############ User Register #############
exports.registerUser = async (req, res) => {
    const { name, email, password, country } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            throw new APIError('User already exists', 400);
        }

        const user = await User.create({
            name,
            email,
            password,
            country,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            country: user.country,
            token: generateToken(user._id),
        });
    } catch (error) {
        next(error);
    }
};

// ############ User Login #############
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                country: user.country,
                token: generateToken(user._id),
            });
        } else {
            throw new APIError('Invalid email or password', 401);
        }
    } catch (error) {
        next(error);
    }
};

// ############ Get User Profile #############
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        next(error);
    }
};