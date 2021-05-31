import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import checkAPIs from "express-validator";
const { check, validationResult } = checkAPIs;

import { isAuth } from "../../middleware/auth.js";
import { User } from "../../models/User.js";

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get("/", isAuth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		console.error(error.message);
		res.status(500).send("Server Error!");
	}
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
	"/",
	[check("email", "Please include a valid email").isEmail(), check("password", "Please enter a password ").exists()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ errors: [{ msg: "Invalid credentials!" }] });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ errors: [{ msg: "Invalid credentials!" }] });
			}

			const payload = {
				user: { id: user.id },
			};
			jwt.sign(payload, config.get("JWT_SECRET"), { expiresIn: "1d" }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server Error!");
		}
	}
);

export { router as default };
