import Notification from '../models/Notification.js';

export const createNotification = async (userId, message, link) => {
  const newNotification = await Notification.create({
    userId,
    message,
    link,
  });
  return newNotification;
};

export const getNotificationsByUserId = async (userId, params) => {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId })
    .sort('-createdAt')
    .limit(limit)
    .skip(skip);
  const total = await Notification.countDocuments({ userId });
  return { notifications, total };
};

export const markNotificationAsRead = async (notificationId) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
};

export const markAllNotificationsAsRead = async (userId) => {
  return await Notification.updateMany({ userId }, { isRead: true });
};
