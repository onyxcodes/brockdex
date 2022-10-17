import { createAction } from '@reduxjs/toolkit';
import { Notification } from './types';

const notify = createAction<Notification>('notify');

const clearNotification = createAction<string>('clearNotification');

const clearAllNotifications = createAction('clearAllNotifications');

/* May be useful when notifications are saved in a database
 * and want to restore them at app load
 */
const loadNotifications = createAction<Notification[]>('loadNotifications');

export { clearNotification, clearAllNotifications, loadNotifications };
export default notify;