import express from "express";
// import cors from "cors";
import exchangeRoute from "./routes/exchange.js";
import stockRoute from "./routes/stock.js";
import mutualFundRoute from "./routes/mutual-fund.js";

const app = express();
const port = 8080;

app.use(express.json());
// app.use(cors());

app.get("/", (req, res) => {
  res.send({
    message: "Hello World",
  });
});

app.use("/api/exchange", exchangeRoute);
app.use("/api/stock", stockRoute);
app.use("/api/mutual-fund", mutualFundRoute);

app.listen(port, () => {
  console.log(`Connected to http://localhost:${port}`);
});

// Plan

// Upcoming IPO
// Investment Calculator
// Individual Stock
// Search Stock