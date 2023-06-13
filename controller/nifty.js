import config from "../config.js";
import { browserInit, browserStop } from "../utils/browser.js";

let nifties = [
  "nifty-50",
  "nifty-bank",
  "nifty-fin-service",
  "nifty-auto",
  "nifty-energy",
  "nifty-fmcg",
  "nifty-it",
  "nifty-metal",
  "nifty-media",
  "nifty-pharma",
  "nifty-reality",
  "nifty-oil-and-gas",
  "nifty-healthcare",
];

export const getNiftySector = async (req, res) => {
  let success = false;
  try {
    const { name } = req.body;

    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL + `indices/${name}-share-price/#overview`
    );
    const niftySector = await page.evaluate(() => {
      // main
      let container = document.querySelector(".left-sec .stock-info");
      let name = container.querySelector(
        ".stock-header .stock-segment"
      ).innerText;
      let price = container.querySelector(
        ".stock-price-wrap #main-price-box .pricing"
      ).innerText;
      let percentage = container.querySelector(
        ".stock-price-wrap #main-price-box .price-stats"
      ).innerText;

      // Detail Container
      let detailContainer = document.querySelector(
        "#overview .stock-card-content"
      );
      let open = detailContainer.querySelector("ul li #open").innerText;
      let close = detailContainer.querySelector("ul li #close").innerText;
      let day_range =
        detailContainer.querySelector("ul li #day-range").innerText;
      let year_range =
        detailContainer.querySelector("ul li #year-range").innerText;

      return {
        name,
        price,
        percentage,
        open,
        close,
        day_range,
        year_range,
      };
    });
    await browserStop(browser);

    if (niftySector.length === 0) {
      return res.status(404).send({
        success,
        message: "No Sector Found",
      });
    }

    success = true;

    return res.status(200).send({
      success,
      data: niftySector,
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: "Internal Server Error",
    });
  }
};

export const niftyDerivatives = async (req, res) => {
  let success = false;
  try {
  const { name } = req.body;

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
          curr_price: el.querySelector(".data-col-2 .price-details .price")
            .innerText,
          change: el.querySelector(".stat-desktop .price-details .percentage")
            .innerText,
          open_price: el.querySelector(".data-col-3").innerText,
          close_price: el.querySelector(".data-col-4").innerText,
        };
      })
    );
  
    await browserStop(browser);
  };
  
  } catch (err) {}
};

niftyDerivatives();
