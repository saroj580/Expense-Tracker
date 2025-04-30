const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
    registerUser,
    loginUser,
    getUserInfo,
    forgotPassword,
    resetPassword,
    verifyResetToken
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", protect, getUserInfo);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);

router.post("/upload-image", upload.single("image"),  (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    
    // // Save the image URL in the corresponding income record
    // const incomeRecord = new Income({
    //     userId: req.user.id,
    //     imageUrl: imageUrl,
    //     source: req.body.source, // Include source from request body
    //     amount: req.body.amount,   // Include amount from request body
    // });

    // await incomeRecord.save();

    res.status(200).json({ imageUrl });
})

module.exports = router;