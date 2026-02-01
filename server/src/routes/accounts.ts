import { Router } from "express";
import { listAccounts } from "../services/accountService";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const accounts = await listAccounts();
    res.json({ data: accounts });
  } catch (error) {
    next(error);
  }
});

export default router;
