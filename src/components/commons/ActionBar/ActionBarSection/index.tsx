import React from 'react';
import useElementWidth from 'hooks/useElementWidth';
import { ActionBarItemProps } from 'components/commons/ActionBar';
import ActionBarItem, { ActionBarItemRef } from 'components/commons/ActionBar/ActionBarItem';
import Modal from 'components/commons/Modal';
import Button from 'components/commons/Button';

interface ActionBarAltSection {
    items: React.ReactNode;
    title?: string;
}
const ActionBarAltSection = ( props: ActionBarAltSection ) => {
    const { items, title } = props;
    const [ modalState, setModalState ] = React.useState(false);
    
    const hide = React.useCallback( () => {
        setModalState(false)
    }, []);

    const show = React.useCallback( () => {
        setModalState(true)
    }, []);

    return <>
        <Button title={title} shape='circle' iconName='ellipsis-v' onClick={show}/>
        { modalState && <Modal visible={modalState} closeModal={hide}>{items}</Modal> }
    </>
}

interface AcctionBarSectionProps {
    type: 'left' | 'center' | 'right';
    items: (ActionBarItemProps | null)[];
}
export type ActionBarSectionRef = {
    width: number;
    element: HTMLElement | null;
}
const ActionBarSection = ( props: AcctionBarSectionProps ) => {
    const { type, items } = props;

    // Reference to the html div containing this section
    const ref = React.useRef<HTMLDivElement | null>(null);

    // Reference that will get populated with the items of this ection
    
    const itemsList = React.useRef<{
        [key: string]: HTMLElement | null
    }>({});

    const [_itemsList, updateItemsList ] = React.useState(itemsList.current);

    // Helps recognize when an item get added or changed to width item refs list 
    const [itemsListChange, markItemsListChange ]= React.useState(false);

    const [ scaling, setScaling ] = React.useState({
        value: false,
        itemsWidth: 0 // needed to track items total width before scaling
    });

    /**
     * Allows to render also when there are no items for this type
     * but there are for the center,
     * to make sure that those are centered
     */
    const [ 
        hasCenteredItems, 
        markCenterItemPresence
    ] = React.useState(false);

    const [ gotRef, markRefPresence ] = React.useState(false); 

    const sectionWidth = useElementWidth(ref.current);

    const actionBarSectionClass = `actionbar-${type}`;

    const addItemRef = React.useCallback( ( item: ActionBarItemRef | null) => {
        if ( item && item.element && type !== 'center' ) {
            if ( item.key == 'favorite-remove' || item.key == 'close-modal') debugger;
            // markItemsListChange(!itemsListChange)
            itemsList.current[item.key] = item.element;
            updateItemsList({...itemsList.current})
            return itemsList.current[item.key];
        }
    }, [itemsListChange]);

    const refSetter = React.useCallback( (node) => {
        if (ref.current) {
            //
        }

        if (node) {
            markRefPresence(true)
        }

        // Save a reference to the node
        ref.current = node
    }, []);

    /** Items expected for this actionbar section
     * mapped to the ActionBarItem component.
     * Also populates the items ref list to track their sizes
     * and checks if there are items that belong to the 'center' section
     */
    const _items = React.useMemo(() => {
        let trueIndex = -1;

        return items.map( i => {
        if (i?.position === type) {
            trueIndex++;
            return <ActionBarItem
                item={i.item}
                title={i.title}
                uniqueKey={i.key}
                key={i.key}
                sectionRef={ref}
                setReady={addItemRef}
                // ref={addItemRef}
            />
        } else if (!hasCenteredItems && i?.position === 'center') {
            markCenterItemPresence(true);;
        } 
    }).filter( e => !!e )}, [items]);

    React.useEffect( () => {
        // The unique key was enforced to assure that the list object contains
        // unique elements

        // If the parent changes the items after mounting the list object
        // may contain element no longer in view, although their width will be 0

        // TODO: Find a way to remove elements in the list 
        // or rebuild correctly the object list

        // TODO: Maybe a Set could be used instead of the object?
        // Dunno whether it can descern the same DOM elements..
        itemsList.current = { ...itemsList.current };
    }, [_items]);

    // Given a list of items, uses their width to obain the total width
    // then, based on the current scaling state, the section's width and the total calculate
    // descide whether it shouldv update scaling state 
    const alterScaling = React.useCallback( (_itemList: {
        [key: string]: HTMLElement | null
    }) => {
        const totalItemsWidth = Object.values( _itemList).reduce( (total, element) => {
            return total + (element?.offsetWidth || 0);
        }, 0);
        console.log('Calculating whether it should scale', {sectionWidth, totalItemsWidth, scaling})
        if ( !scaling.value && totalItemsWidth && sectionWidth && totalItemsWidth >= sectionWidth) {
            console.log('Section should scale', {sectionWidth, totalItemsWidth})
            setScaling({
                value: true,
                itemsWidth: totalItemsWidth
            });
        } else if ( scaling.value && scaling.itemsWidth && sectionWidth && scaling.itemsWidth < sectionWidth ) {
            console.log('Section should not scale', {sectionWidth, itemsWidth: scaling.itemsWidth})
            setScaling({
                value: false,
                itemsWidth: 0
            });
        }
    }, [sectionWidth, scaling]);

    // if ( sectionWidth ) debugger


    React.useEffect( () => {
        // let timeoutId: number;

        // // scaling disabled for center sections
        // if ( type !== 'center' ) {
        //     // gives time to paint the dom 
        //     // and also children items to switch to their scaled versions
        //     timeoutId = window.setTimeout( () => alterScaling(itemsList.current),150);
        // }

        // return () => {
        //     if (timeoutId) window.clearTimeout(timeoutId)
        // }
        alterScaling(itemsList.current)
    }, [_itemsList, sectionWidth]);

    // Shows an alternative version of the section when scaling value is set to true
    const renderedItem = React.useMemo( () => {
        return !scaling.value ? _items : <ActionBarAltSection items={_items}/>;
    }, [scaling, _items]);

    // Renders the component only if it has items of it's type,
    // or there are items in the center section
    return (_items.length || hasCenteredItems) ? <div className={actionBarSectionClass} ref={refSetter}>
    {/* // return (_items.length || hasCenteredItems) ? <div className={actionBarSectionClass} ref={ref}> */}
        {renderedItem}
    </div> : null;
}

export default ActionBarSection;