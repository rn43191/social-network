import mongoose from "mongoose";
import config from "config";
const db = config.get("MONGO_URI");
// const db = config.get("LOCAL_MONGO_URI");

export const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});
		console.log("MongoDB Connection Succeeded.");
	} catch (err) {
		console.error(err.message);
		// EXIT with failure
		process.exit(1);
	}
};
