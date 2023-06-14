import config from "../config.js";
import { browserInit, browserStop } from "../utils/browser.js";

// Pagination endpoint /mutual-funds?limit={num}&offset={num}
// Fund Houses endpoint /mutual-funds?fundHouses={id}
// Category endpoint /mutual-funds?assetClasses={id}&categories={c}
// Risk Level endpoint /mutual-funds?riskLevels={l}
// Minimum Investment endpoint /mutual-funds?minimumInvestments={min}
// Lock Periods endpoint /mutual-funds?lockInPeriods={lp}
// Fund Plans endpoint /mutual-funds?schemeClasses={sc}

// filters page, fundHouse, [assetClases, categories], riskLevel, minimumInvestment, lockInPeriod, fundPlans
const getMutualFunds = async (req, res) => {
  let success = false;
  try {
    const {
      limit,
      offset,
      fundHouses,
      assetClasses,
      categories,
      riskLevels,
      minimumInvestments,
      lockInPeriods,
      fundPlans,
    } = req.params;

    // Fund Houses
    if (fundHouses.split(",").length > 0) {
      let fundHouse = fundHouses.split(",");
      let fh = "";
      for (let i = 0; i < fundHouse.length; i++) {
        let str = `&fundHouses=${fundHouse[i]}`;
        fh += str;
      }
      fundHouses = fh;
    }

    // Assest Classes
    if (assetClasses.split(",").length > 0) {
      let assetClass = assetClasses.split(",");
      let ac = "";
      for (let i = 0; i < assetClass.length; i++) {
        let str = `&assetClasses=${assetClass[i]}`;
        ac += str;
      }
      assetClasses = ac;
    }

    // Categories
    if (categories.split(",").length > 0) {
      let cat = categories.split(",");
      let c = "";
      for (let i = 0; i < cat.length; i++) {
        let str = `&categories=${cat[i]}`;
        c += str;
      }
      categories = c;
    }

    // Risk Levels
    if (riskLevels.split(",").length > 0) {
      let riskLevel = riskLevels.split(",");
      let rl = "";
      for (let i = 0; i < riskLevel.length; i++) {
        let str = `&riskLevels=${riskLevel[i]}`;
        rl += str;
      }
      riskLevels = rl;
    }

    // Minimum Investments
    if (minimumInvestments.split(",").length > 0) {
      let minInvest = minimumInvestments.split(",");
      let mi = "";
      for (let i = 0; i < minInvest.length; i++) {
        let str = `&minimumInvestments=${minInvest[i]}`;
        mi += str;
      }
      minimumInvestments = mi;
    }

    // Lock in Periods
    if (lockInPeriods.split(",").length > 0) {
      let lockPeriod = lockInPeriods.split(",");
      let lp = "";
      for (let i = 0; i < lockPeriod.length; i++) {
        let str = `&lockInPeriods=${lockPeriod[i]}`;
        lp += str;
      }
      lockInPeriods = lp;
    }

    // Scheme Class
    if (fundPlans.split(",").length > 0) {
      let fuelPlan = fundPlans.split(",");
      let fp = "";
      for (let i = 0; i < fuelPlan.length; i++) {
        let str = `&schemeClasses=${fuelPlan[i]}`;
        fp += str;
      }
      fundPlans = fp;
    }

    let { page, browser } = await browserInit(
      config.UPSTOX_API_URL +
        `mutual-funds?limit=${limit}&offset=${offset}${fundHouses}${assetClasses}${categories}${riskLevels}${minimumInvestments}${lockInPeriods}${fundPlans}`
    );

    let mutualFundData = await page.evaluate(() => {
      let table = document.querySelectorAll(
        ".layout__content .fund-list .fund-list__table table tbody .row"
      );
      if (table) {
        return Array.from(table).map((el) => {
          let td = Array.from(el.querySelectorAll(".cell"));
          return {
            id: el.getAttribute("id").split("-")[3],
            url: td[0].querySelector("span a").getAttribute("href"),
            logo: td[0].querySelector("span .fund-list__item img").src,
            name: td[0].querySelector(
              "span .fund-list__item .fund-list__item-name h2"
            ).innerText,
            plan: td[1].querySelector("span a .badge").innerText,
            five_year_return: td[2].querySelector("span a div").innerText,
            expense_ratio: td[3].querySelector("span a div").innerText,
            amount_Cr: td[4].querySelector("span a div").innerText,
          };
        });
      } else {
        return [];
      }
    });

    await browserStop(browser);

    success = true;

    return res.status(200).send({
      success,
      data: mutualFundData,
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: "Internal Server Error",
    });
  }
};

getMutualFunds();
