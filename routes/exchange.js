import { Router } from "express";
import nse from "../controller/nse.js";
import bse from "../controller/bse.js";

const router = Router();

// NSE
router.get("/nse/indicies/:name", nse.getNSESector);
router.get("/nse/derivatives/:name", nse.getNiftyDerivatives);

// BSE
router.get("/bse/indicies/:name", bse.getBSESector);
router.get("/bse/derivatives/:name", bse.getBSEDerivatives);

export default router;
