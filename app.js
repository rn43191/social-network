import express from "express";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/api/users.js";
import authRoutes from "./routes/api/auth.js";
import profileRoutes from "./routes/api/profile.js";
import postRoutes from "./routes/api/posts.js";

import path from "path";

const app = express();
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Serve Static assets in production
if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}.`);
});
