import { Router } from 'express';
import { getItems, getItem, createItem, deleteItem } from '../controllers/items.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', authenticate, createItem);
router.delete('/:id', authenticate, deleteItem);

export default router;
