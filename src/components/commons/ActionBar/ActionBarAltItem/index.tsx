import React from 'react';
import Modal from 'components/commons/Modal';
import Button from 'components/commons/Button';

interface ActionBarAltItem {
    item: JSX.Element;
    title?: string;
}

/** 
 * @description By default, the alternative item for actionbar item is a button with icon as '...',
 * when clicked, it show's a modal with the original item as content.
 * If provided, uses a specific element as 'trigger'
 */
const ActionBarAltItem = ( props: ActionBarAltItem ) => {
    const { item, title } = props;
    const [ modalState, setModalState ] = React.useState(false);
    
    const hide = React.useCallback( () => {
        setModalState(false)
    }, []);

    const show = React.useCallback( () => {
        setModalState(true)
    }, []);

    return <>
        <Button title={title} shape='circle' iconName='ellipsis-h' onClick={show}/>
        { modalState && <Modal visible={modalState} closeModal={hide}>{item}</Modal> }
    </>
}


export default ActionBarAltItem;