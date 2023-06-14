import config from "../config.js";
import { browserInit, browserStop } from "../utils/browser.js";

// Stock Overview
const getStockOverview = async (req, res) => {
  let success = false;
  try {
    const { name, id } = req.params;

    const { page, browser } = await browserInit(
      config.UPSTOX_API_URL + `stocks/${name}/${id}/`
    );

    let btn = await page.$eval(
      "#overview .stock-card-header #company-profile-desc button",
      (el) => el.click()
    );

    const stockOverview = await page.evaluate(async () => {
      let shareName = document.querySelector(
        ".stock-info .stock-header .stock-name"
      ).innerText;
      let shareCode = document
        .querySelector(".stock-info .stock-header #code")
        .innerText.split(" ")[0];
      let shareImg = document.querySelector(
        ".stock-info .stock-header figure img"
      ).src;

      let titleOverview = document.querySelector(
        "#overview .stock-card-header .stock-overview-desc h2"
      ).innerText;
      let overview = document.querySelector(
        "#overview .stock-card-header #company-profile-desc"
      ).innerText;

      return {
        shareName,
        shareCode,
        shareImg,
        title: titleOverview,
        overview,
      };
    });

    await browserStop(browser);
    success = true;

    // console.log(stockOverview);

    return res.status(200).send({
      success,
      data: stockOverview,
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: err,
    });
  }
};

// Stock Performance
const getStocPerformance = async (req, res) => {
  let success = false;
  try {
    const { name, id } = req.params;

    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL + `stocks/${name}/${id}/`
    );

    const stockPerformance = await page.evaluate(() =>
      Array.from(document.querySelectorAll("#performance li")).map((el) => {
        return {
          summary_title: el.querySelector(".summary-title").innerText,
          summary_price: el.querySelector(".summary-amount").innerText,
        };
      })
    );

    await browserStop(browser);
    success = true;

    return res.status(200).send({
      success,
      data: stockPerformance,
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: err,
    });
  }
};

// Stock Indicators
const getStocIndicators = async (req, res) => {
  let success = false;
  try {
    const { name, id } = req.params;

    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL + `stocks/${name}/${id}/`
    );
    const stockIndicators = await page.evaluate(() => {
      let container = document.querySelector(
        "#fundamentals .sec-col .stock-card"
      );

      return Array.from(container.querySelectorAll("ul li")).map((el) => {
        return {
          summary_title: el.querySelector(".summary-title").innerText,
          summary_price: el.querySelector(".summary-amount").innerText,
        };
      });
    });

    await browserStop(browser);
    success = true;

    return res.status(200).send({
      success,
      data: stockIndicators,
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: err,
    });
  }
};

// Stock Ratios
const getStockRatios = async (req, res) => {
  let success = false;
  try {
    const { name, id } = req.params;

    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL +
        `stocks/adani-port-sez-ltd-share-price/INE742F01042/`
    );

    let profitabilityRatios = await page.evaluate(() => {
      let cont = document.querySelector(
        "#financial-ratios-card .stock-card-content [data-tab-panel='1']"
      );
      return Array.from(cont.querySelectorAll("ul li")).map((el) => {
        return {
          title: el.querySelector(".accordion-header .summary-title").innerText,
          ratio: el.querySelector(".accordion-header .summary-amount")
            .innerText,
        };
      });
    });
    let operationalRatios = await page.evaluate(() => {
      let cont = document.querySelector(
        "#financial-ratios-card .stock-card-content [data-tab-panel='2']"
      );

      return Array.from(cont.querySelectorAll("ul li")).map((el) => {
        return {
          title: el.querySelector(".accordion-header .summary-title").innerText,
          ratio: el.querySelector(".accordion-header .summary-amount")
            .innerText,
        };
      });
    });
    let valuationRatios = await page.evaluate(() => {
      let cont = document.querySelector(
        "#financial-ratios-card .stock-card-content [data-tab-panel='3']"
      );

      return Array.from(cont.querySelectorAll("ul li")).map((el) => {
        return {
          title: el.querySelector(".accordion-header .summary-title").innerText,
          ratio: el.querySelector(".accordion-header .summary-amount")
            .innerText,
        };
      });
    });
    await browserStop(browser);
    success = true;

    return res.status(200).send({
      success,
      data: {
        profitabilityRatios,
        operationalRatios,
        valuationRatios,
      },
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: err,
    });
  }
};

// Stock Details
const getStockShareHoldersReturn = async (req, res) => {
  let success = false;
  try {
    const { name, id } = req.params;

    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL +
        `stocks/adani-port-sez-ltd-share-price/INE742F01042/`
    );

    let shareholdersReturns = await page.evaluate(() => {
      let cont = Array.from(
        document.querySelectorAll("#fundamentals .sec-col .stock-card")
      )[3];
      return Array.from(cont.querySelectorAll(".stock-card-content ul li")).map(
        (el) => {
          return {
            title: el.querySelector(".summary-title").innerText,
            percentage: el.querySelector(".summary-amount span").innerText,
          };
        }
      );
    });

    await browserStop(browser);

    success = true;

    return res.status(200).send({
      success,
      data: shareholdersReturns,
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: err,
    });
  }
};

// Stock Price
const getStockPrice = async (req, res) => {
  let success = false;
  try {
    const { name, id } = req.params;

    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL + `stocks/${name}/${id}/`
    );

    let sharePrice = await page.evaluate(() => {
      let price = document.querySelector(
        ".stock-info .stock-price-wrap #main-price-box .current-price"
      ).innerText;
      let percentage = document.querySelector(
        ".stock-info .stock-price-wrap #main-price-box .profit-lose"
      ).innerText;

      return {
        price,
        percentage,
      };
    });

    await browserStop(browser);
    success = true;

    return res.status(200).send({
      success,
      data: {
        ...sharePrice,
      },
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: "Internal Server Error",
    });
  }
};

// stock/v3/get-historical-data from an API https://rapidapi.com/apidojo/api/yh-finance
// stock/v2/get-cash-flow from an API https://rapidapi.com/apidojo/api/yh-finance
// stock/v2/get-recommendation from an API https://rapidapi.com/apidojo/api/yh-finance

export default {
  getStockOverview,
  getStocPerformance,
  getStocIndicators,
  getStockRatios,
  getStockShareHoldersReturn,
  getStockPrice,
};
