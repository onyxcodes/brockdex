import notificationsMiddleware from './middleware';
import notifications from './notifications';
import NotificationElement from './src/components/NotificationElement';
import NotificationArea from './src/components/NotificationArea';
import Alert from './src/components/Alert';
import { createNotification, clearNotifications, updateNotification, removeNotification, loadNotifications, callback } from './notifications';

export namespace Notifier {

    export type NotificationObject = {
        id?: string;
        active?: boolean;
        level?: 'info' | 'pending' | 'warning' | 'prompt' | 'error' | 'debug';
        message?: string;
        actions?: {
            label: string;
            payload?: { [key: string]: any };
            globalFnName: string;
        }[];
        clearable?: boolean;
        timeout?: number;
        timestamp?: EpochTimeStamp;
    }

    // A new notification should at least contain a message
    export interface NewNotificationObject extends NotificationObject {
        id: string;
        message: string;
        // level: 'info' | 'pending' | 'warning' | 'prompt' | 'error' | 'debug';
    }

    // The usal purpose of the update notification object is to
    // update a already present notification's content 
    export interface UpdatedNotificationObject extends NotificationObject {
        id: string;
    }


    // TODO: Consider not extending NotificationType
    // or omit the not-needed props:
    // actions
    // id (since the component rendering the notification will apply the key)
    // timeout (since the parent decides when to unmount the component)

    // TODO: Consider moving the icon mapping function to notificationArea,
    // since all notifications will use the same mapping
    // This would avoid having to create a component that returns a customized notification
    // while letting the notificationArea handle the customizations
    // i.e.: useNotifications( Component?: AlertType, iconMappingFn );
    // instead of useNotifications(MyCustomNotification)
    // What about both?
    export interface AlertProps {
        onClose?: () => void;
        icon?: JSX.Element;
        visible?: boolean;
        closeAlert?: () => void;
        className?: string;
        showClose?: boolean;
    }
    export type Alert<P extends AlertProps = AlertProps> = React.FC<P>;
    export interface NotificationElementProps extends NotificationObject {
        // areaId determines in which area the notification will be mounted
        // I decided to specify this option at this (component) level
        // to allow different "types"/"target" of notifications to be 
        // placed in separate spaces
        areaId?: string;
        Component?: Alert;
        showIcon?: boolean;
        buttons?: JSX.Element[];
        onClose?: () => void;
        showElapsedTime?: boolean;
        closeOnAction?: boolean;
        getIcon?: (type: string) => JSX.Element;
    }

    export type NotificationElement<P extends NotificationElementProps = NotificationElementProps> = React.VFC<P>;
}

export { NotificationElement, NotificationArea, Alert };
export { createNotification, clearNotifications, updateNotification, removeNotification, loadNotifications, callback };
export { notifications, notificationsMiddleware };

