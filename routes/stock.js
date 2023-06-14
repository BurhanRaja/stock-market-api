import { Router } from "express";
import stock from "../controller/stock.js";

const router = Router();

router.get("/details/:name/:id", stock.getStockDetails);

router.get("/price/:name/:id", stock.getStockPrice);

export default router;
