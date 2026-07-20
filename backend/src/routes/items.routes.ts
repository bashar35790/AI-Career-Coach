import { Router } from "express";
import {
  getItems,
  getItem,
  createItem,
  deleteItem,
} from "../controllers/items.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createItemSchema } from "../validators/index";

const router = Router();

router.get("/", getItems);
router.get("/:id", authenticate, getItem);
router.post("/", authenticate, validate(createItemSchema), createItem);
router.delete("/:id", authenticate, deleteItem);

export default router;
