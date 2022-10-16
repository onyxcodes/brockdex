import React from 'react';
import Icon from 'components/commons/Icon';
import Alert, { AlertElement } from 'components/commons/Alert';
import { Notification as NotificationType } from 'features/ui';

const getGenericIcon = ( type: NotificationType['level'] ) => {
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
    return <div className='alert-icon f aic p05'>
        <Icon name={iconName} />
    </div>
}

interface NotificationProps extends NotificationType {
    element?: AlertElement;
    showIcon?: boolean;
    buttons?: JSX.Element[];
    onClose?: () => void;
    showElapsedTime?: boolean;
    closeOnAction?: boolean;
    getIcon?: (type: string) => JSX.Element;
}
const Notification = (props: NotificationProps): AlertElement => {
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
        element = <Alert/>,
        getIcon = getGenericIcon,
    } = props;

    const [ visible, setVisible ] = React.useState(true);

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

    return <element.type
        key={id}
        icon={alertIcon}
        visible={visible}
        onClose={onClose}
        showClose={clearable}
        closeAlert={hide}
        // NOTE: if a custom element was specified with its props
        // same props will override above 'deafults'
        {...element.props}
    >
        <>
            <span>{message}</span>
            {renderedButtons?.length && <div className='alert-buttons px05 f jcc'>
                {renderedButtons}
            </div>}
        </>
    </element.type>
}

export default Notification;