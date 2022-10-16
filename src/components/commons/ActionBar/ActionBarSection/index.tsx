import React from 'react';
import useElementWidth from 'hooks/useElementWidth';
import { ActionBarItemProps } from 'components/commons/ActionBar';
import ActionBarItem, { ActionBarItemRef } from 'components/commons/ActionBar/ActionBarItem';
import Button from 'components/commons/Button';
import useSidebar from 'hooks/useSidebar';

import './index.scss';

interface ActionBarAltSection {
    items: JSX.Element[];
    title?: string;
}
const ActionBarAltSection = ( props: ActionBarAltSection ) => {
    const { items, title } = props;

    const [ gotRef, markRefPresence ] = React.useState(false); 

    // Reference to the html div containing this section
    const ref = React.useRef<HTMLDivElement | null>(null);

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


    // Re-access and alter items list to change the section ref
    const _items = React.useMemo( () => items.map( element => {
        return <element.type
            key={element.key}
            {...element.props}
            siblingWeight={1}
            sectionRef={ref}
        />
    }), [items]);

    const { Sidebar, open: openSidebar } = useSidebar();

    return <>
        <Button title={title} shape='circle' iconName='ellipsis-v' onClick={openSidebar}/>
        { <Sidebar>
            <div ref={refSetter} className='actionbar-section-content'>{_items}</div>
        </Sidebar> }
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

    // Reference that will get populated with the items of this section
    const itemsList = React.useRef<{
        [key: string]: HTMLElement | null
    }>({});

    // State obj that mirrors above reference conten, just because refs changes
    // can't be tracked in array of deps of react hooks, while a state update does
    const [_itemsList, updateItemsList ] = React.useState(itemsList.current);

    // 
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

    // TODO: Explain how refs alone can't be used in array deps
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
    }, []);

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

        const sectionItems = items.map( i => {
            if (i?.position === type) {
                trueIndex++;
                return <ActionBarItem
                    item={i.item}
                    title={i.title}
                    uniqueKey={i.key}
                    key={i.key}
                    sectionRef={ref}
                    setReady={addItemRef}
                    scale={i.scale}
                    alt={i.alt}
                />
            } else if (!hasCenteredItems && i?.position === 'center') {
                markCenterItemPresence(true);;
            } 
            // Even though there's the following filter, ts still thinks there may be undef values
        }).filter( e => e !== undefined ) as JSX.Element[];

        // The section items length is used to set the siblingWeight, used for the item scaling function
        // TODO: It would be better to supply a specific weight based on the element size
        if (sectionItems.length) console.log(`section at ${type} has n. items`, sectionItems.length)
        return sectionItems
            .map( element => {
                return <element.type
                    key={element.key}
                    {...element.props}
                    siblingWeight={sectionItems.length}
                />
            })
            
    }, [items]);

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