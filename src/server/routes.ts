import { Router, Request, Response } from 'express';
import {
  verifyAdminPassword,
  isValidToken,
  revokeToken,
  changeAdminPassword,
  requireAdminAuth,
} from './auth';
import {
  getAllProducts,
  getPublicProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
  getAllThemes,
  updateTheme,
  getAllAddons,
  createAddon,
  updateAddon,
  deleteAddon,
  getAllOffers,
  getActiveOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getSettings,
  updateSettings,
  getAllOrders,
  createOrderRequest,
  updateOrderStatus,
  saveUploadedImage,
} from './db';

export const apiRouter = Router();

// ================= PUBLIC ENDPOINTS =================

/**
 * Bootstrap data for customer website
 */
apiRouter.get('/public/bootstrap', (req: Request, res: Response) => {
  try {
    const products = getPublicProducts();
    const themes = getAllThemes();
    const addons = getAllAddons().filter((a) => a.isAvailable);
    const offers = getActiveOffers();
    const settings = getSettings();

    res.json({
      success: true,
      products,
      themes,
      addons,
      offers,
      settings,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching store data' });
  }
});

/**
 * Records customer checkout / WhatsApp inquiry intent
 */
apiRouter.post('/public/orders', (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const order = createOrderRequest(orderData);
    res.status(201).json({
      success: true,
      orderId: order.id,
      message: 'Order inquiry registered successfully',
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error recording order request' });
  }
});

// ================= ADMIN AUTH ENDPOINTS =================

/**
 * Admin Login
 */
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  const result = verifyAdminPassword(password);
  if (!result.success) {
    res.status(401).json({ error: result.error || 'Invalid admin credentials' });
    return;
  }

  res.json({
    success: true,
    token: result.token,
    message: 'Welcome to DILSY Admin Studio',
  });
});

/**
 * Admin Session Verification
 */
apiRouter.get('/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ valid: false });
    return;
  }

  const token = authHeader.substring(7).trim();
  const valid = isValidToken(token);
  res.json({ valid });
});

/**
 * Admin Logout
 */
apiRouter.post('/admin/logout', requireAdminAuth, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    revokeToken(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * Change Admin Password
 */
apiRouter.post('/admin/change-password', requireAdminAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Both current and new password are required' });
    return;
  }

  const result = changeAdminPassword(currentPassword, newPassword);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.json({ success: true, message: 'Password updated successfully' });
});

// ================= ADMIN PROTECTED ENDPOINTS =================

/**
 * Admin Dashboard Overview Metrics
 */
apiRouter.get('/admin/dashboard', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const products = getAllProducts();
    const orders = getAllOrders();
    const offers = getAllOffers();

    const publishedProducts = products.filter((p) => p.stockStatus !== 'unpublished');
    const availableProducts = products.filter((p) => (p.stockStatus || 'available') === 'available');
    const outOfStockProducts = products.filter((p) => p.stockStatus === 'out_of_stock');
    const activeOffers = offers.filter((o) => o.isActive);

    const pendingOrders = orders.filter((o) => o.status === 'Pending');

    res.json({
      success: true,
      stats: {
        totalProducts: products.length,
        publishedProducts: publishedProducts.length,
        availableProducts: availableProducts.length,
        outOfStockProducts: outOfStockProducts.length,
        activeOffersCount: activeOffers.length,
        totalOrdersCount: orders.length,
        pendingOrdersCount: pendingOrders.length,
      },
      recentOrders: orders.slice(0, 5),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error generating dashboard stats' });
  }
});

// --- Product Management ---

apiRouter.get('/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  res.json({ success: true, products: getAllProducts() });
});

apiRouter.post('/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const product = createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create product' });
  }
});

apiRouter.put('/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = updateProduct(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ success: true, product: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update product' });
  }
});

apiRouter.patch('/admin/products/:id/stock', requireAdminAuth, (req: Request, res: Response) => {
  const { stockStatus } = req.body;
  if (!stockStatus) {
    res.status(400).json({ error: 'stockStatus is required' });
    return;
  }
  const updated = updateProductStock(req.params.id, stockStatus);
  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ success: true, product: updated });
});

apiRouter.delete('/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = deleteProduct(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ success: true, message: 'Product removed' });
});

// --- Themes Management ---

apiRouter.get('/admin/themes', requireAdminAuth, (req: Request, res: Response) => {
  res.json({ success: true, themes: getAllThemes() });
});

apiRouter.put('/admin/themes/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = updateTheme(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Theme not found' });
      return;
    }
    res.json({ success: true, theme: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update theme' });
  }
});

// --- Addons Management ---

apiRouter.get('/admin/addons', requireAdminAuth, (req: Request, res: Response) => {
  res.json({ success: true, addons: getAllAddons() });
});

apiRouter.post('/admin/addons', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const addon = createAddon(req.body);
    res.status(201).json({ success: true, addon });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create add-on' });
  }
});

apiRouter.put('/admin/addons/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = updateAddon(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Add-on not found' });
      return;
    }
    res.json({ success: true, addon: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update add-on' });
  }
});

apiRouter.delete('/admin/addons/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = deleteAddon(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Add-on not found' });
    return;
  }
  res.json({ success: true, message: 'Add-on removed' });
});

// --- Offers Management ---

apiRouter.get('/admin/offers', requireAdminAuth, (req: Request, res: Response) => {
  res.json({ success: true, offers: getAllOffers() });
});

apiRouter.post('/admin/offers', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const offer = createOffer(req.body);
    res.status(201).json({ success: true, offer });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create offer' });
  }
});

apiRouter.put('/admin/offers/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = updateOffer(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Offer not found' });
      return;
    }
    res.json({ success: true, offer: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update offer' });
  }
});

apiRouter.delete('/admin/offers/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = deleteOffer(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Offer not found' });
    return;
  }
  res.json({ success: true, message: 'Offer removed' });
});

// --- Orders Management ---

apiRouter.get('/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
  res.json({ success: true, orders: getAllOrders() });
});

apiRouter.patch('/admin/orders/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { status, adminNotes } = req.body;
  if (!status) {
    res.status(400).json({ error: 'status is required' });
    return;
  }

  const updated = updateOrderStatus(req.params.id, status, adminNotes);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json({ success: true, order: updated });
});

// --- Settings Management ---

apiRouter.get('/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  res.json({ success: true, settings: getSettings() });
});

apiRouter.put('/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update settings' });
  }
});

// --- Image Upload Endpoint ---

apiRouter.post('/admin/upload-image', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { base64, filename } = req.body;
    if (!base64) {
      res.status(400).json({ error: 'base64 image payload is required' });
      return;
    }

    const publicUrl = saveUploadedImage(base64, filename);
    res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});
