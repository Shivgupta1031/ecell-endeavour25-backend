import express from "express";
import { UsernameController } from "../controllers/UsernameController";

const router = express.Router();
const usernameController = new UsernameController();

// Route to check if a username is already taken
router.post("/search-username", async (req: express.Request, res: express.Response) => {
  await usernameController.searchUsername(req, res);
});

export default router;