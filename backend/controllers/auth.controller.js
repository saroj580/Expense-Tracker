const User = require("../model/user.model.js");
const jwt = require("jsonwebtoken")
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');

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
    
    // Ensure body is parsed correctly
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

// Forgot Password - Send reset email
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User with that email doesn't exist." });
        }

        // Generate random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash the token for security before storing in DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        
        // Set token and expiration (1 hour)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
        await user.save();
        
        // Send the email with the token
        try {
            await sendPasswordResetEmail(user.email, resetToken, user.fullName);
            res.status(200).json({ 
                message: "Password reset link sent to your email." 
            });
        } catch (error) {
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            
            console.error("Email sending error:", error);
            return res.status(500).json({ 
                message: "Failed to send reset email. Please try again." 
            });
        }
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ 
            message: "Something went wrong. Please try again later." 
        });
    }
};

// Reset Password with token
const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    
    if (!token || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }
    
    if (!validatePassword(password)) {
        return res.status(400).json({ 
            message: "Password must be at least 6 characters long." 
        });
    }
    
    try {
        // Hash the provided token to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        
        // Find user with the token and valid expiry
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ 
                message: "Invalid or expired reset token. Please request a new one." 
            });
        }
        
        // Set the new password
        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        
        await user.save();
        
        res.status(200).json({ 
            message: "Password reset successful. You can now log in with your new password." 
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ 
            message: "Something went wrong. Please try again later." 
        });
    }
};

// Verify reset token (to check if token is valid before showing reset form)
const verifyResetToken = async (req, res) => {
    const { token } = req.params;
    
    if (!token) {
        return res.status(400).json({ message: "Token is required." });
    }
    
    try {
        // Hash the provided token to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        
        // Find user with the token and valid expiry
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ 
                valid: false,
                message: "Invalid or expired reset token." 
            });
        }
        
        res.status(200).json({ 
            valid: true,
            message: "Token is valid." 
        });
    } catch (error) {
        console.error("Verify token error:", error);
        res.status(500).json({ 
            valid: false,
            message: "Something went wrong. Please try again later." 
        });
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
    forgotPassword,
    resetPassword,
    verifyResetToken
}