import { Order } from '../models/Order.js';

const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SJN-${dateStr}-${rand}`;
};

// @desc    Create new order / wholesale inquiry
// @route   POST /api/orders
// @access  Public (Rate limited)
export const createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      phoneNumber,
      whatsappNumber,
      email,
      orderType,
      items,
      deliveryAddress,
      customerNotes,
      businessName,
      source
    } = req.body;

    if (!customerName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone number are required.'
      });
    }

    // Clean and validate items if retail order
    let parsedItems = [];
    let totalAmount = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      parsedItems = items.map((item) => {
        const qty = Number(item.quantity) || 1;
        const price = Number(item.unitPrice) || 0;
        const subtotal = qty * price;
        totalAmount += subtotal;

        return {
          product: item.productId || item.product,
          productName: item.productName || 'Namkeen Item',
          productImage: item.productImage || '',
          weight: item.weight || 'Standard Pack',
          quantity: qty,
          unitPrice: price,
          subtotal
        };
      });
    }

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      whatsappNumber: (whatsappNumber || phoneNumber).trim(),
      email: email ? email.toLowerCase().trim() : '',
      orderType: orderType || 'retail_order',
      items: parsedItems,
      totalAmount,
      businessName: businessName ? businessName.trim() : '',
      deliveryAddress: deliveryAddress || {},
      customerNotes: customerNotes ? customerNotes.trim() : '',
      source: source || 'website_form',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order / inquiry submitted successfully.',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders/inquiries (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = async (req, res, next) => {
  try {
    const { status, type, search, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (type && type !== 'all') {
      filter.orderType = type;
    }
    if (search && search.trim()) {
      const keyword = search.trim();
      filter.$or = [
        { customerName: { $regex: keyword, $options: 'i' } },
        { phoneNumber: { $regex: keyword, $options: 'i' } },
        { orderNumber: { $regex: keyword, $options: 'i' } },
        { businessName: { $regex: keyword, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private (Admin)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status and internal notes
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, internalNotes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    if (status) {
      order.status = status;
    }
    if (internalNotes !== undefined) {
      order.internalNotes = internalNotes.trim();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics metrics
// @route   GET /api/orders/stats/summary
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const wholesaleInquiries = await Order.countDocuments({ orderType: 'wholesale_inquiry' });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Revenue calculation
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'dispatched', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        wholesaleInquiries,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
