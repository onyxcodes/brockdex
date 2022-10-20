import { useCallback } from 'react';
import { Notifier, NotificationElement} from 'utils/notifications';

// Uses the same props of NotificationElement, but without customizability properties
interface PokeNotificationProps extends Omit<Notifier.NotificationElementProps, 'Component' | 'getIcon'> {
    //
}

const PokeNotification: Notifier.NotificationElement<PokeNotificationProps> = ( props ) => {
    const {
        id,
        level = 'info',
        message, actions,
        clearable = true,
        timeout,
        timestamp,
        showIcon = true,
        showElapsedTime = false,
        buttons,
        closeOnAction = true,
        onClose,
    } = props;

    const getIcon = useCallback(() => {
        switch(level) {
            case 'warning':
                return <i>W</i>
            case 'debug':
                return <i>D</i>
            case 'error':
                return <i>E</i>
            case 'prompt':
                return <i>Pr</i>
            case 'pending':
                return <i>Pe</i>
            case 'info':
            default:
                return <i>I</i>
        }
    }, [level]);

    return <NotificationElement
        {...props}
        getIcon={getIcon}
    />
}

export default PokeNotification;