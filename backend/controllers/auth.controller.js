const User = require("../model/user.model.js");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const errorHandler = require("../utils/errorHandler.js")

//email validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Password strength validation
const validatePassword = (password) => {
  return password.length >= 6;
};

//generate the token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: "1h" });
}

const registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;
    //validation : check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        //create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

const loginUser = async (req, res) => {
    console.log("Login attempt with body:", req.body);
    console.log("Headers:", req.headers);

    let email, password;
    
    if (typeof req.body === 'string') {
        try {
            const parsed = JSON.parse(req.body);
            email = parsed.email;
            password = parsed.password;
        } catch (e) {
            console.error("Error parsing JSON body:", e);
            return res.status(400).json({ message: "Invalid request format." });
        }
    } else {
        email = req.body.email;
        password = req.body.password;
    }

    if (!email || !password) {
        console.log("Login failed: Missing email or password");
        return res.status(400).json({ message: "All fields are required." });
    }
    try {
        console.log("Searching for user with email:", email);
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Login failed: User not found with email:", email);
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isPasswordValid = await user.comparePassword(password);
        console.log("Password validation result:", isPasswordValid);
        
        if (!isPasswordValid) {
            console.log("Login failed: Invalid password for user:", email);
            return res.status(400).json({ message: "Invalid credentials." });
        }

        console.log("Login successful for user:", email);

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }

};

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(400).json({ message: "user not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// const handlesignup = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         if (!username || !email || !password) {
//             return next(errorHandler(400, "All fields are required"));
//         }
//         if (!validateEmail(email)) {
//             return next(errorHandler(400, "Invalid email format"));
//         }
        
//         if (!validatePassword(password)) {
//             return next(errorHandler(400, "password must be at least 6 characters long"));
//         }
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: "User already exists" });

//         const hashedPassword = await bcrypt.hash(password, 10)
//         const newUser = new User({ username, email, password: hashedPassword });
        
//         await newUser.save();
//         res.status(200).json({ message: "User registered successfully" });

//     } catch (error) {
//         next(error);
//     }
// };

// const handleSignIn = async (req, res) => {
//     try {
//         const [email, password] = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ message: "User not found" });
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch)
//             return res.status(400).json({ message: "Invalid email or password" });
//         const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
//             expiresIn: "1h",
//         });
//         res.status(200).json({ token, userId: user._id });
//     } catch (error) {
//         next(error);
//     }
// }

// const google = async (req, res) => {
//     const { email, name, googlePhotoUrl } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (user) {
//             const token = jwt.sign({id})
//         }
//     } catch (error) {
        
//     }
// }


// module.export = {
//     handleSignIn,
//     handlesignup,
//     google
// }

module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
}