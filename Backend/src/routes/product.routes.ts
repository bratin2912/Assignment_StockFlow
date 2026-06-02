import { Router } from 'express';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as productService from '../services/product.service';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';

const router = Router();

router.use(auth);

router.post('/', validate(createProductSchema), async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const product = await productService.createProduct(user.organizationId, req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { search } = req.query;
    const products = await productService.getProducts(user.organizationId, search ? String(search) : undefined);
    res.json(products);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const product = await productService.getProductById(String(id), user.organizationId);
    res.json(product);
  } catch (error) {
    res.status(404).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

router.put('/:id', validate(updateProductSchema), async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const product = await productService.updateProduct(String(id), user.organizationId, req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const result = await productService.deleteProduct(String(id), user.organizationId);
    res.json(result);
  } catch (error) {
    res.status(404).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

export default router;