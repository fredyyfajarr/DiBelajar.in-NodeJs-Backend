import * as notificationService from '../services/notificationService.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { notifications, total } =
      await notificationService.getNotificationsByUserId(userId, req.query);
    res
      .status(200)
      .json({
        success: true,
        count: notifications.length,
        total,
        data: notifications,
      });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const updatedNotification =
      await notificationService.markNotificationAsRead(notificationId);
    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: updatedNotification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await notificationService.markAllNotificationsAsRead(userId);
    res
      .status(200)
      .json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
