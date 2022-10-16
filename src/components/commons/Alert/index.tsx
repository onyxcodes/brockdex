import React, { ReactElement } from 'react';
import './index.scss';
import Button from 'components/commons/Button';

// TODO: Change into using portals

interface AlertProps {
    children?: React.ReactNode;
    onClose?: () => void;
    icon?: JSX.Element;
    visible?: boolean;
    closeAlert?: () => void;
    className?: string;
    showClose?: boolean;
}
export type AlertElement = ReactElement;
const Alert = ( props: AlertProps ): AlertElement => {
    const {
        icon,
        visible = true,
        children,
        closeAlert,
        showClose = true,
        onClose,
        className
    } = props;
    
    const [ mounted, mount ] = React.useState(false);
    const [ visibility, setVisibility ] = React.useState(false);

    let alertClass = 'alert';
    if (className) alertClass =`${alertClass} ${className}`;

    React.useLayoutEffect( () => {
        let unmountTimeoutId: number,
            visiblityTimeoutId: number;
        if ( visible ) {
            mount(visible);
            visiblityTimeoutId = window.setTimeout( () => setVisibility(true), 150)
        } else {
            unmountTimeoutId = window.setTimeout( () => mount(visible), 1000);
            setVisibility(visible);
        }
    }, [visible]);

    if ( visibility ) {
        alertClass = `${alertClass} visible`;
    }

    /* Trace unmount of component to trigger, if provided,
     * fire onClose callback
     */
    React.useEffect( () => {
        if (!mounted && !visible) {
            onClose && onClose();
        }
    }, [mounted]);

    return mounted ? <>
        <div className={alertClass}>
            { showClose && <Button onClick={closeAlert} className='f-right m025' 
                iconName='close' shape='circle' type='text'
            /> }
            <div className='alert-wrapper f fd-row p05'>
                { icon }
                <div className='alert-content f aic t6 px05'>
                    {children}
                </div>
            </div>
        </div>
    </> : <></>
}

export default Alert;