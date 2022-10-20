import React, { useRef, useCallback } from 'react';
import { useDispatch, } from 'react-redux';
import './index.scss';

import { Notifier } from '../../../';
import NotificationElement from '../NotificationElement';
import Button from 'components/commons/Button';

import { removeNotification, callback } from '../../../.';
// import { globalFunctions } from 'utils/';

// TODO: Consider turning into a hook
// should acccept a selector that points to the array of notifications
type NotificationAreaElOpts = {
    Component?: Notifier.Alert;
    iconMapping?: (type: string) => JSX.Element;
}
type NotificationAreaOpts = {
    Notification: Notifier.NotificationElement
};

interface NotificationAreaProps {
    notifications: Notifier.NotificationObject[],
    areaId?: string
    options?: NotificationAreaElOpts | NotificationAreaOpts;
}
const NotificationArea: React.VFC<NotificationAreaProps> = (props) => {
    const {
        notifications,
        areaId,
        options = {
            Notification: Notification
        } 
    } = props;
    const dispatch = useDispatch();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [ gotRef, markRefPresence ] = React.useState(false); 

    // Sets the container's ref, only when areaId was not provided
    // and the ref hasn't been already set
    const refSetter = useCallback( (node) => {
        // debugger;
            if ( !areaId && !containerRef.current && node) {
            containerRef.current = node;
            markRefPresence(true);
        }
    }, []);

    const closeNotification = React.useCallback( (id?: string) => {
        id && dispatch(removeNotification(id))
    }, [dispatch]);

    const _Notification = options?.hasOwnProperty('Component') ?
        (options as NotificationAreaOpts).Notification : NotificationElement;

    const componentOptions: NotificationAreaElOpts = options?.hasOwnProperty('Component') ?
        options as NotificationAreaElOpts : { };

    const renderedNotifications = React.useMemo( () => {
        if (gotRef) {
            return notifications.map( (notification, i) => {
            
                let buttons = notification.actions?.map( (action, i) => {
                    const buttonAction = () => {
                        dispatch(callback(action.globalFnName, notification.id, action.payload));
                    }
                    return <Button key={i}
                        onClick={buttonAction}
                    >
                        {action.label}
                    </Button>
                });
                return <_Notification key={notification.id}
                    {...componentOptions}
                    areaId={containerRef.current!.id}
                    message={notification.message}
                    active={notification.active}
                    level={notification.level}
                    clearable={notification.clearable}
                    timeout={notification.timeout}
                    timestamp={notification.timestamp}
                    showElapsedTime={!!!notification.timestamp}
                    buttons={buttons}
                    onClose={() => closeNotification(notification.id)}
                />
            })
        } else return [];
    }, [notifications, gotRef]);

    return <div ref={refSetter} id='notification-area' className='notification-area f aie'>
        {renderedNotifications}
    </div>
        
}

export default NotificationArea;