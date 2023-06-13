import { browserInit, browserStop } from "../utils/browser.js";

export const popularNiftySectors = async (req, res) => {
  let success = false;
  try {
    let { page, browser } = await browserInit("https://www.nseindia.com/");

    const popularNiftySector = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".tabs_boxes .nav-tabs a")).map(
        (el) => {
          return {
            name: el.querySelector(".tb_name").innerText,
            value: el.querySelector(".tb_val").innerText,
            percentage: el.querySelector(".tb_per").innerText,
          };
        }
      )
    );
    await browserStop(browser);

    if (popularNiftySector.length === 0) {
      return res.status(404).send({
        success,
        message: "No Sector Found",
      });
    }

    success = true;

    return res.status(200).send({
      success,
      data: popularNiftySector,
    });
  } catch (err) {
    return res.status(500).send({
      success,
      message: "Internal Server Error",
    });
  }
};
