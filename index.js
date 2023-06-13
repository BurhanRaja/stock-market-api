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
    config.UPSTOX_API_URL + `indices/nifty-50-share-price/#overview`
  );

  const nifty = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll("#table-data-indices .stock-filter-data")
    ).map((el) => {
      return {
        image: el.querySelector(".data-col-1 .company-info figure img").src,
        name: el.querySelector(".data-col-1 .company-name span a").innerText,
        curr_price: el.querySelector(".data-col-2 .price-details .price").innerText,
        change: el.querySelector(".stat-desktop .price-details .percentage").innerText
      }
    })
  );
  console.log(nifty);

  await browserStop(browser);
};

niftyDerivatives();

app.listen(port, () => {
  console.log(`Connected to http://localhost:${port}`);
});

// Plan

// Nifty 50 All Data from
