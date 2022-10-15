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

    // Reference that will get populated with an object describing the width
    // of this section children items
    // const itemsWidthList = React.useRef<{[key: string]: number}>({});
    const itemsList = React.useRef<{
        [key: string]: HTMLElement | null
    }>({});

    // Helps recognize when an item get added or changed to width item refs list 
    const [itemsWidthChange, markItemsWidthChange ]= React.useState(false);

    const [ isScaled, markAsScaled ] = React.useState(false);

    // const markItemsUpdate = React.useCallback( () => {

    // }, [itemsWidthChange])
    
    /**
     * Allows to render also when there are no items for this type
     * but there are for the center,
     * to make sure that those are centered
     */
    const [ 
        hasCenteredItems, 
        markCenterItemPresence
    ] = React.useState(false);

    const sectionWidth = useElementWidth(ref.current);

    const actionBarSectionClass = `actionbar-${type}`;

    const addItemRef = React.useCallback( ( item: ActionBarItemRef | null) => {
        if ( item && item.width ) {
        console.log(`adding item with width ${item.width} at key ${item.key}`, item.element)
            markItemsWidthChange(!itemsWidthChange)
            // return itemsWidthList.current[item.key] = item.width;}
            return itemsList.current[item.key] = item.element;
        }
    }, [itemsWidthChange]);

    // const addItemRef = React.useCallback( ( item: ActionBarItemRef | null) => {
    //     if ( item && item.width ) {
    //     console.log(`adding item with width ${item.width} at key ${item.key}`, item)
    //         // markItemsWidthChange(!itemsWidthChange)
    //         // return itemsWidthList.current[item.key] = item.width;
    //         return itemsList.current[item.key] = item.element;
    //     }
    // }, []);

    /** Items expected for this actionbar section
     * mapped to the ActionBarItem component.
     * Also populates the items ref list to track their sizes
     * and checks if there are items that belong to the 'center' section
     */
    const _items = React.useMemo(() => {
        let trueIndex = -1;
        // debugger;

        return items.map( i => {
        if (i?.position === type) {
            trueIndex++;
            // console.log('got item index', {trueIndex, key: i.key});
            return <ActionBarItem
                item={i.item}
                title={i.title}
                uniqueKey={i.key || trueIndex}
                key={trueIndex}
                section={ref.current}
                ref={addItemRef}
            />
        } else if (!hasCenteredItems && i?.position === 'center') {
            markCenterItemPresence(true);
        } 
    }).filter( e => !!e )}, [items]);
    // })}, [items, sectionWidth]);

    React.useEffect( () => {
        itemsList.current = { ...itemsList.current };
        // console.log('got width list',itemsList.current)
    }, [_items])

    React.useEffect( () => {
        console.log('got width list',itemsList.current);
        let timeoutId: number;
        timeoutId = window.setTimeout( () => alterScaling(itemsList.current),150);

        return () => {
            if (timeoutId) window.clearTimeout(timeoutId)
        }
        // alterScaling(itemsList.current)
    }, [itemsWidthChange, sectionWidth])
// }, [itemsList.current, sectionWidth])


    const alterScaling = React.useCallback( (_itemList: {
        [key: string]: HTMLElement | null
    }) => {
        const totalItemsWidth = Object.values( _itemList).reduce( (total, element) => {
            return total + (element?.clientWidth || 0);
        }, 0);
        console.log('Calculating whether it should scale', {sectionWidth, totalItemsWidth})
        if ( totalItemsWidth && sectionWidth && totalItemsWidth >= sectionWidth) {
            console.log('Section should scale', {sectionWidth, totalItemsWidth})
            markAsScaled(true);
        } else if ( totalItemsWidth && sectionWidth && totalItemsWidth < sectionWidth ) {
            console.log('Section should not scale', {sectionWidth, totalItemsWidth})
            markAsScaled(false);
        }
    }, [sectionWidth]);

    // React.useEffect( () => {
    //     let timeoutId: number;
    //     timeoutId = window.setTimeout( () => alterScaling(itemsList.current),150);

    //     return () => {
    //         if (timeoutId) window.clearTimeout(timeoutId)
    //     }
    //     // itemsList.current = { ...itemsList.current };
    // }, [_items, sectionWidth]);

    // React.useEffect( () => {
    //     let timeoutId: number;
    //     timeoutId = window.setTimeout( () => alterScaling(itemsList.current),150);

    //     return () => {
    //         if (timeoutId) window.clearTimeout(timeoutId)
    //     }
    //     // itemsList.current = { ...itemsList.current };
    // }, [itemsWidthChange]);

    // React.useEffect( () => {
    //     const totalItemsWidth = Object.values(itemsWidthList.current).reduce( (total, width) => {
    //         return total + width || 0
    //     }, 0);
    //     if ( totalItemsWidth && sectionWidth && totalItemsWidth >= sectionWidth) {
    //         // markAsScaled(true);
    //     } else {
    //         // markAsScaled(false);
    //     }
    // }, [itemsWidthList.current, sectionWidth]);

    const renderedItem = React.useMemo( () => {
        return !isScaled ? _items : <ActionBarAltSection items={_items}/>;
    }, [isScaled, _items]);

    return (_items.length || hasCenteredItems) ? <div className={actionBarSectionClass} ref={ref}>
        {renderedItem}
    </div> : null
};

export default ActionBarSection;