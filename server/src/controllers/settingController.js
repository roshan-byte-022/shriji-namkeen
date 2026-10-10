import { Setting } from '../models/Setting.js';

// @desc    Get business settings (public)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update business settings (Admin)
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Business settings updated successfully.',
      settings
    });
  } catch (error) {
    next(error);
  }
};
