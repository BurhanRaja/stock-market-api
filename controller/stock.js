import config from "../config.js";
import { browserInit, browserStop } from "../utils/browser.js";

// Stock Details
export const getStockDetails = async (req, res) => {
  let success = false;
  try {
    const { name, id } = req.params;

    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL + `stocks/${name}/${id}/`
    );

    await page.waitForSelector(
      ".stock-info .stock-price-wrap #main-price-box .current-price"
    );

    const stockOverview = await page.evaluate(async () => {
      await page.click(
        "#overview .stock-card-header #company-profile-desc .show-more-description"
      );
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

    const stockPerformance = await page.evaluate(() =>
      Array.from(document.querySelectorAll("#performance li")).map((el) => {
        return {
          summary_title: el.querySelector(".summary-title").innerText,
          summary_price: el.querySelector(".summary-amount").innerText,
        };
      })
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
      data: {
        stockOverview,
        stockIndicators,
        stockPerformance,
        profitabilityRatios,
        operationalRatios,
        valuationRatios,
        shareholdersReturns,
      },
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: "Internal Server Error",
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

    res.status(200).send({
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
  getStockDetails,
  getStockPrice,
};