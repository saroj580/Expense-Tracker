import User from "../model/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";

//email validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Password strength validation
const validatePassword = (password) => {
  return password.length >= 6;
};

const handlesignup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return next(errorHandler(400, "All fields are required"));
        }
        if (!validateEmail(email)) {
            return next(errorHandler(400, "Invalid email format"));
        }
        
        if (!validatePassword(password)) {
            return next(errorHandler(400, "password must be at least 6 characters long"));
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, email, password: hashedPassword });
        
        await newUser.save();
        res.status(200).json({ message: "User registered successfully" });

    } catch (error) {
        next(error);
    }
};

const handleSignIn = async (req, res) => {
    try {
        const [email, password] = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid email or password" });
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        next(error);
    }
}

const google = async (req, res) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({id})
        }
    } catch (error) {
        
    }
}


export default handlesignup;