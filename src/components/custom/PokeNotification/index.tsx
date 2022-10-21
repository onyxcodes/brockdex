import { useCallback } from 'react';
import './index.scss';
import { Notifier, NotificationElement} from 'utils/notifications';
import Pokeball from 'components/custom/Pokeball';
import {Alert} from 'utils/notifications/index';

// Uses the same props of NotificationElement, but without customizability properties
interface PokeNotificationProps extends Omit<Notifier.NotificationElementProps, 'alert' | 'getIcon'> {
    //
}

const PokeNotification: Notifier.NotificationElement<PokeNotificationProps> = ( props ) => {
    const {
        id,
        type = 'info',
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
        let icon;
        switch(type) {
            case 'error':
            case 'warning':
                icon = <img className='floating-unown' src={require('assets/unown_esclamation_mark.png')}/>;
            break;
            // case 'debug':
            //     icon = <i>D</i>;
            // break;
            case 'prompt':
                icon = <img className='floating-unown' src={require('assets/unown_question_mark.png')}/>;
            break;
            case 'pending':
                icon = <Pokeball animated={true}/>;
            break;
            // case 'info':
            // default:
            //     return <i>I</i>
        }

        return icon ? <div 
            className='pokenotification-icon'>
            {icon}
        </div> : undefined;
    }, [type]);

    return <NotificationElement
        {...props}
        getIcon={getIcon}
        alert={<Alert className='pokealert'/>}
    />
}

export default PokeNotification;