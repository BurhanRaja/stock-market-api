import express from "express";
import { browserInit, browserStop } from "./utils/browser.js";
import config from "./config.js";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send({
    message: "Hello World",
  });
});


app.listen(port, () => {
  console.log(`Connected to http://localhost:${port}`);
});

// Plan

// Upcoming IPO
// Investment Calculator
// Individual Stock
// Search Stock

