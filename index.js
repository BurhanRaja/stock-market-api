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

const niftyDerivatives = async (req, res) => {
  let { page, browser } = await browserInit(
    config.NSE_API_URL + "market-data/live-equity-market"
  );

  // await page.select("select#equitieStockSelect", "NIFTY 50");

  const niftyDerivative = await page.evaluate(() =>
    document.querySelector("table")
  );
  console.log(niftyDerivative);

  await browserStop(browser);
};

niftyDerivatives();

app.listen(port, () => {
  console.log(`Connected to http://localhost:${port}`);
});

// Plan

// Nifty 50 All Data from
