import { Router } from "express";
import stock from "../controller/stock.js";

const router = Router();

router.get("/overview/:name/:id", stock.getStockOverview);

router.get("/indicators/:name/:id", stock.getStocIndicators);

router.get("/performance/:name/:id", stock.getStocPerformance);

router.get("/ratios/:name/:id", stock.getStockRatios);

router.get("/shareholderreturn/:name/:id", stock.getStockShareHoldersReturn);

router.get("/price/:name/:id", stock.getStockPrice);

export default router;
