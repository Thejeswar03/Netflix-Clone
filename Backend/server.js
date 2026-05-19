import express from "express";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";

import  {ENV_VARS} from "./config/envVars.js";
import { connectDB } from "./config/bd.js";
import { protectRoute } from "./middleware/protectRoute.js";
import cors from "cors";



//dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const PORT = ENV_VARS.PORT;

app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json()); //middleware to parse req.body in auth.controller since the data from mongoDB is in JSON.
app.use(cookieParser()); //allows parsing cookies sent in the header.

app.use("/api/v1/auth", authRoutes); 
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


app.listen(PORT, ()=>{
  console.log("Server started at http://localhost:" + PORT);
  connectDB();
});


