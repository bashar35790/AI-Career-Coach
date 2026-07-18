import { Response } from 'express';
import { Item } from '../models/index';
import { sendSuccess, sendError } from '../utils/response';
import type { AuthRequest } from '../middleware/auth';

export async function getItems(req: AuthRequest, res: Response) {
  try {
    const { category, minPrice, maxPrice, sort, page = '1', limit = '12' } = req.query;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Item.find(filter).sort(sortOption).skip(skip).limit(limitNum).populate('createdBy', 'name'),
      Item.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      items,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch items', 500);
  }
}

export async function getItem(req: AuthRequest, res: Response) {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
    if (!item) return sendError(res, 'Item not found', 404);
    return sendSuccess(res, item);
  } catch (error) {
    return sendError(res, 'Failed to fetch item', 500);
  }
}

export async function createItem(req: AuthRequest, res: Response) {
  try {
    const { title, shortDesc, fullDesc, price, category, image } = req.body;

    if (!title || !shortDesc || !fullDesc || price === undefined || !category) {
      return sendError(res, 'Title, shortDesc, fullDesc, price, and category are required');
    }

    const item = await Item.create({
      title,
      shortDesc,
      fullDesc,
      price: Number(price),
      category,
      image,
      createdBy: req.userId,
    });

    return sendSuccess(res, item, 201);
  } catch (error) {
    return sendError(res, 'Failed to create item', 500);
  }
}

export async function deleteItem(req: AuthRequest, res: Response) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return sendError(res, 'Item not found', 404);

    if (item.createdBy.toString() !== req.userId) {
      return sendError(res, 'Not authorized to delete this item', 403);
    }

    await Item.findByIdAndDelete(req.params.id);
    return sendSuccess(res, { message: 'Item deleted' });
  } catch (error) {
    return sendError(res, 'Failed to delete item', 500);
  }
}
