import * as dotenv from 'dotenv';
dotenv.config();
import express, { json } from "express";
// import colors from "colors";
import { Database } from "./config.js";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import candidateRoute from "./routes/candidateRoute.js";
import voteRoute from "./routes/voteRoute.js"
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(json());
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/payments", paymentRoute);
app.use('/api/vote', voteRoute)

const port = process.env.PORT || 4000;
(async () => {
  try {
    const db = new Database
    await db.connect()
    // start the app engine
    app.listen(port, () => {
      console.log("NODE SERVER STARTED: https://127.0.0.1:" + port)
    })

  } catch (error) {
    console.error(error)
  }
})();
