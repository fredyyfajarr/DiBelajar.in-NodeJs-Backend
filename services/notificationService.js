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
  const page = Math.max(Number(params?.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params?.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId })
    .sort('-createdAt')
    .limit(limit)
    .skip(skip);
  const total = await Notification.countDocuments({ userId });
  return { notifications, total };
};

export const markNotificationAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
};

export const markAllNotificationsAsRead = async (userId) => {
  return await Notification.updateMany({ userId }, { isRead: true });
};
