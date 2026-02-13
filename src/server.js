import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";

connectDB();

const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
