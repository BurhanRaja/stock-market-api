import dotenv from "dotenv";
dotenv.config();

let config;
export default config = {
  NSE_API_URL: process.env.NSE_API_URL,
  YAHOO_API_URL: process.env.YAHOO_API_URL,
  MONEYCONTROL_API_URL: process.env.MONEYCONTROL_API_URL,
  UPSTOX_API_URL: process.env.UPSTOX_API_URL,
};
