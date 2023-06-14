import config from "../config.js";
import { browserInit, browserStop } from "../utils/browser.js";

let bses = ["sensex", "bse100"];

export const getBSESector = async (req, res) => {
  let success = false;
  try {
    const { name } = req.params;

    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL + `indices/${name}-share-price/#overview`
    );
    const bseSector = await page.evaluate(() => {
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
        overview: {
          open,
          close,
          day_range,
          year_range,
        },
      };
    });
    await browserStop(browser);

    if (bseSector.length === 0) {
      return res.status(404).send({
        success,
        message: "No Sector Found",
      });
    }

    success = true;

    return res.status(200).send({
      success,
      data: bseSector,
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: "Internal Server Error",
    });
  }
};

export const getBSEDerivatives = async (req, res) => {
  let success = false;
  try {
    const { name } = req.params;

    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL + `indices/${name}-share-price/#overview`
    );

    const bse = await page.evaluate(() =>
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
          endpoint: el
            .querySelector(".data-col-1 .company-name span a")
            .getAttribute("href"),
        };
      })
    );

    await browserStop(browser);

    if (bse.length === 0) {
      return res.status(404).send({
        success,
        message: "No Sector Found",
      });
    }

    success = true;

    return res.status(200).send({
      success,
      data: bse,
      length: bse.length,
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: "Internal Server Error",
    });
  }
};

export const getBSEStockDetails = async (req, res) => {
  let success = false;
  try {
    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL +
        `stocks/adani-enterprises-limited-share-price/INE423A01024/`
    );

    await page.click(".stock-buy-sell .bse-nse-switch label");

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

const getBSEStockPrice = async (req, res) => {
  let success = false;
  try {
    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL +
        `stocks/adani-enterprises-limited-share-price/INE423A01024/`
    );

    await page.waitForSelector(".stock-buy-sell .bse-nse-switch label");
    await page.click(".stock-buy-sell .bse-nse-switch label");

    let sharePrice = await page.evaluate(() => {
      let price = document.querySelector(
        ".stock-info .stock-price-wrap #main-price-box .pricing"
      ).innerText;
      let percentage = document.querySelectorAll(
        ".stock-info .stock-price-wrap #main-price-box div"
      )[1].innerText;

      return {
        price,
        percentage,
      };
    });

    console.log(sharePrice);
    await browserStop(browser);
    success = true;

    // res.status(200).send({
    //   success,
    //   data: {
    //     ...sharePrice,
    //   },
    // });
  } catch (err) {
    // return res.status(500).send({
    //   success,
    //   message: "Internal Server Error",
    // });
  }
};

getBSEStockPrice();

export default {
  getBSESector,
  getBSEDerivatives,
  getBSEStockDetails,
  getBSEStockPrice,
};
