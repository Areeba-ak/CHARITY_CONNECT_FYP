const User = require('../models/User');
const Story = require('../models/Story');
const bcrypt = require('bcryptjs');

/**
 * =========================
 * GET MY PROFILE
 * =========================
 */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * UPDATE MY PROFILE
 * =========================
 */
exports.updateMyProfile = async (req, res) => {
  try {
    // ✅ Whitelisted fields only (security)
    const allowedFields = [
      'firstName',
      'lastName',
      'email',
      'address',
      'city',
      'contact',
      'avatar',
      'gender',
      'profession',
      'otherProfession',
      'cnicImage'
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // ❌ Block protected fields
    delete updates.role;
    delete updates._id;
    delete updates.password;

    // ✅ Normalize email
    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    // ✅ Normalize gender
    if (updates.gender) {
      const g = String(updates.gender).toLowerCase();
      if (!['male', 'female', 'other'].includes(g)) {
        delete updates.gender;
      } else {
        updates.gender = g;
      }
    }

    // ✅ Avatar size protection (~2MB limit)
    if (updates.avatar && updates.avatar.length > 2_000_000) {
      return res.status(400).json({
        message: 'Avatar image too large. Max size is ~2MB'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: false // allow partial updates
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * CHANGE PASSWORD
 * =========================
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'Please provide all password fields'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'New passwords do not match'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * ADMIN: GET USER BY ID
 * =========================
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * DELETE MY ACCOUNT
 * =========================
 */
exports.deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Remove any non-approved stories submitted by this user. Approved stories
    // must be preserved for public news display, but pending/rejected entries
    // can be removed to avoid orphaned requests.
    await Story.deleteMany({ submittedBy: userId, status: { $ne: 'approved' } });

    // Finally delete the user record
    await User.findByIdAndDelete(userId);

    // Clear any auth cookie set by OAuth flows
    try {
      res.clearCookie('token');
    } catch (e) {
      // ignore
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
