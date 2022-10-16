import { createReducer } from '@reduxjs/toolkit';
import setQuery from './query'
import notify, { clearNotification, clearAllNotifications, loadNotifications } from './notify';
import { Notification } from './types';

export interface UIState {
    query: string | undefined;
    notifications: Notification[];
}

const initalState = {
    query: '',
    notifications: []
} as UIState;

const reducer = createReducer(initalState, builder => { builder
    .addCase(setQuery, (state, action) =>{
        state.query = action.payload;
    })

    // Notification management
    .addCase(notify, (state, action) => {
        state.notifications.push(action.payload)
    })
    .addCase(clearNotification, (state, action) => {
        let notificationIndex = state.notifications.findIndex( el => el.id === action.payload );
        state.notifications.splice(notificationIndex,1)
    })
    .addCase(clearAllNotifications, (state, action) => {
        state.notifications = initalState.notifications;
    })
    .addCase(loadNotifications, (state, action) => {
        state.notifications = [...state.notifications, ...action.payload ];
    })
})

export default reducer;
export type { Notification };
export { setQuery, notify, clearNotification, clearAllNotifications, loadNotifications }