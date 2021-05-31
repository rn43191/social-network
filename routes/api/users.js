import express from "express";
const router = express.Router();
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import checkAPIs from "express-validator";
import config from "config";
import normalize from "normalize-url";
const { check, validationResult } = checkAPIs;

import { User } from "../../models/User.js";

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
	"/",
	[
		check("name", "name is required").not().isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check("password", "Please enter a password with 6+ characters").isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (user) {
				return res.status(200).json({ errors: [{ msg: "User already exists." }] });
			}

			const avatar = normalize(
				gravatar.url(email, {
					s: "200",
					r: "pg",
					d: "retro",
				}),
				{ forceHttps: true }
			);
			const salt = await bcrypt.genSalt(10);

			user = new User({
				name,
				email,
				password,
				avatar,
			});

			user.password = await bcrypt.hash(password, salt);
			await user.save();

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
