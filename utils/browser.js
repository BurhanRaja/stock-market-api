import puppeteer from "puppeteer";

export async function browserInit(url) {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto(url);
  
  return {
    page,
    browser,
  };
}

export async function browserStop(browser) {
  await browser.close();
}
