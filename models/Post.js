import mongoose from "mongoose";

var postSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	text: {
		type: String,
		required: true,
	},
	name: {
		type: String,
	},
	avatar: {
		type: String,
	},
	likes: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		},
	],
	comments: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			text: {
				type: String,
				required: true,
			},
			name: {
				type: String,
			},
			avatar: {
				type: String,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
	date: {
		type: Date,
		default: Date.now,
	},
});

export const Post = mongoose.model("Post", postSchema);
