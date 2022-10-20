import React, { ReactNode } from 'react';
import Icon from 'components/commons/Icon';
import Alert from '../Alert';
import { Notifier } from '../../../';
import ReactDOM from 'react-dom';

const getGenericIcon = ( type: Notifier.NotificationObject['level'] ) => {
    let iconName;
    switch (type) {
        
        case 'warning':
            iconName = 'exclamation-triangle';
            break;
        case 'debug':
            iconName = 'lightbulb-o';
            break;
        case 'error':
            iconName = 'frown-o';
            break;
        case 'prompt':
            iconName = 'question-circle'
            break;
        case 'pending':
            iconName = 'hourglass-end'
            break;
        case 'info':
        default:
            iconName = 'info-circle';
        break;
    }

    return <Icon name={iconName} />
}

const NotificationElement: Notifier.NotificationElement<Notifier.NotificationElementProps> = (props): JSX.Element => {
    const {
        areaId = 'modal-area',
        active = true,
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
        Component = Alert,
        getIcon = getGenericIcon,
    } = props;

    const [ visible, setVisible ] = React.useState(true);

    React.useEffect( () => {
        if (active !== visible) {
            setVisible(active);
        }
    }, [active]);

    let alertIcon;
    if (showIcon) {
        alertIcon = getIcon(level);
    }

    const renderedButtons = React.useMemo(() => buttons?.map((button, i) => {
        const extendedOnClick = () => {
            button.props.onClick && button.props.onClick();
            if (closeOnAction) setVisible(false);
        }
        return <button.type key={button.key || i}
            {...button.props}
            onClick={() => extendedOnClick()}
        />
    }), [buttons]);

    const hide = React.useCallback( () => {
        setVisible(false);
    }, []);

    const area = document.getElementById(areaId);

    return area ? ReactDOM.createPortal(<Component
        icon={alertIcon}
        visible={visible}
        onClose={onClose}
        showClose={clearable}
        closeAlert={hide}
    >
        <>
            <span>{message}</span>
            {/* TODO: Change to more appropriate className */}
            {renderedButtons?.length && <div className='alert-buttons px05 f jcc'>
                {renderedButtons}
            </div>}
        </>
    </Component>, area) : <></>;
}

export default NotificationElement;