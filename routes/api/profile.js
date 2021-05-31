import express from "express";
const router = express.Router();
import checkAPIs from "express-validator";
const { check, validationResult } = checkAPIs;
import axios from "axios";
import config from "config";
// bring in normalize to give us a proper url, regardless of what user entered
import normalize from "normalize-url";

import { isAuth } from "../../middleware/auth.js";
import { User } from "../../models/User.js";
import { Profile } from "../../models/Profile.js";
import { Post } from "../../models/Post.js";

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get("/me", isAuth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate("user", [
			"name",
			"avatar",
		]);
		if (!profile) {
			return res.status(400).json({ msg: "No profile for this user!" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error!");
	}
});

// @route   POST api/profile
// @desc    Create or update a user profile
// @access  Private
router.post(
	"/",
	[
		isAuth,
		[
			check("status", "Status is required").not().isEmpty(),
			check("skills", "skills is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin,
		} = req.body;

		const profileFields = {
			user: req.user.id,
			company,
			location,
			website: website === "" ? "" : normalize(website, { forceHttps: true }),
			bio,
			skills: Array.isArray(skills)
				? skills
				: skills.split(",").map((skill) => " " + skill.trim()),
			status,
			githubusername,
		};

		// Build social object and add to profileFields
		const socialfields = { youtube, twitter, instagram, linkedin, facebook };

		for (const [key, value] of Object.entries(socialfields)) {
			if (value.length > 0) socialfields[key] = normalize(value, { forceHttps: true });
		}
		profileFields.social = socialfields;

		try {
			// Using upsert option (creates new doc if no match is found):
			let profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{
					$set: profileFields,
				},
				{
					new: true,
					upsert: true,
				}
			);
			return res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("server error!");
		}
	}
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
	try {
		const profiles = await Profile.find().populate("user", ["name", "avatar"]);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error!");
	}
});

// @route   GET api/profile/user/:user_id
// @desc    Get an user profiles by user_id
// @access  Public
router.get("/user/:user_id", async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", [
			"name",
			"avatar",
		]);
		if (!profile) {
			return res.status(400).json({ msg: "No profile found!" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind == "ObjectId") {
			return res.status(400).json({ msg: "No profile found!" });
		}
		res.status(500).send("server error!");
	}
});

// @route   DELETE api/profile
// @desc    Delete Profile, user and Posts
// @access  Private
router.delete("/", isAuth, async (req, res) => {
	try {
		// Remove User Posts
		await Post.deleteMany({ user: req.user.id });
		// Remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// Remove User
		await User.findOneAndRemove({ _id: req.user.id });
		res.json({ msg: "User Removed!" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error!");
	}
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
	"/experience",
	[
		isAuth,
		[
			check("title", "Title is required").not().isEmpty(),
			check("company", "company is required").not().isEmpty(),
			check("from", "from date is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, company, location, from, to, current, description } = req.body;

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id }).populate("user", [
				"name",
				"avatar",
			]);
			profile.experience.unshift(newExp); //Push at beginning
			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("server error!");
		}
	}
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete("/experience/:exp_id", isAuth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate("user", [
			"name",
			"avatar",
		]);

		// Get remove index
		const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);
		profile.experience.splice(removeIndex, 1);

		await profile.save();
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error!");
	}
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
	"/education",
	[
		isAuth,
		[
			check("school", "school is required").not().isEmpty(),
			check("degree", "degree is required").not().isEmpty(),
			check("fieldofstudy", "field of study is required").not().isEmpty(),
			check("from", "from date is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { school, degree, fieldofstudy, from, to, current, description } = req.body;

		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id }).populate("user", [
				"name",
				"avatar",
			]);
			profile.education.unshift(newEdu); //Push at beginning
			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("server error!");
		}
	}
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete("/education/:edu_id", isAuth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate("user", [
			"name",
			"avatar",
		]);

		// Get remove index
		const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);
		profile.education.splice(removeIndex, 1);

		await profile.save();
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error!");
	}
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get("/github/:username", async (req, res) => {
	try {
		const uri = encodeURI(
			`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
		);
		const headers = {
			"user-agent": "node.js",
			Authorization: `token ${config.get("GITHUB_TOKEN")}`,
		};

		const gitHubResponse = await axios.get(uri, { headers });
		return res.json(gitHubResponse.data);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error!");
	}
});

export { router as default };
