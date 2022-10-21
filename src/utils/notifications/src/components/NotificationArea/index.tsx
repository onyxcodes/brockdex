import React, { useRef, useCallback, ReactElement } from 'react';
import { useDispatch, } from 'react-redux';
import './index.scss';

import { Notifier } from '../../../';
import NotificationElement from '../NotificationElement';
import Button from 'components/commons/Button';

import { removeNotification, callback } from '../../../.';

type NotificationAreaElOpts = {
    alert?: Notifier.Alert;
    iconMapping?: (type: string) => JSX.Element;
}
type NotificationAreaOpts = {
    element: ReactElement<Notifier.NotificationElementProps, any>
};

interface NotificationAreaProps {
    notifications: Notifier.NotificationObject[],
    types?: Notifier.NotificationType[],
    areaId?: string
    options?: NotificationAreaElOpts | NotificationAreaOpts;
}
const NotificationArea: React.VFC<NotificationAreaProps> = (props) => {
    const {
        notifications,
        types,
        areaId = 'notification-area',
        options = {
            element: <NotificationElement/>
        } 
    } = props;
    const dispatch = useDispatch();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [ gotRef, markRefPresence ] = React.useState(false); 

    // Sets the container's ref, only when areaId was not provided
    // and the ref hasn't been already set
    const refSetter = useCallback( (node) => {
        if ( areaId && !containerRef.current && node) {
            containerRef.current = node;
            markRefPresence(true);
        }
    }, []);

    const closeNotification = React.useCallback( (id?: string) => {
        id && dispatch(removeNotification(id))
    }, [dispatch]);

    // TODO use ts type predicate
    const element: NotificationAreaOpts['element'] = options?.hasOwnProperty('element') ?
        (options as NotificationAreaOpts).element : <NotificationElement/>;

    // TODO use ts type predicate
    const componentOptions: NotificationAreaElOpts = options?.hasOwnProperty('alert') ?
        options as NotificationAreaElOpts : { };

    const renderedNotifications = React.useMemo( () => {
        if (gotRef) {
            return notifications
            .filter( n => {
                if ( types?.length && n.type ) return types.includes(n.type)
                else return true;
            })
            .map( (notification, i) => {
                const buttons = notification.actions?.map( (action, i) => {
                    const buttonAction = () => {
                        dispatch(callback(action.callback, notification.id, action.payload));
                    }
                    return <Button key={i}
                        onClick={buttonAction}
                    >
                        {action.label}
                    </Button>
                });

                return <element.type key={notification.id}
                    {...componentOptions}
                    areaId={containerRef.current!.id}
                    message={notification.message}
                    active={notification.active}
                    type={notification.type}
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

    return <div ref={refSetter} id={areaId} className='notification-area f aie'>
        {renderedNotifications}
    </div>
}

export default NotificationArea;