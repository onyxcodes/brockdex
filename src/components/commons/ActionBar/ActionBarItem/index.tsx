import React, { ForwardedRef } from 'react';
import './index.scss';

import ActionBarAltItem from 'components/commons/ActionBar/ActionBarAltItem';
import { ActionBarSectionRef } from 'components/commons/ActionBar/ActionBarSection';
import useElementWidth from 'hooks/useElementWidth';

interface ActionBarItem {
    item: JSX.Element;
    title?: string;
    siblingWeight?: number;
    scale?: boolean;
    scaleFactor?: number;
    alt?: JSX.Element;
    uniqueKey: string | number;
    section?: HTMLElement | null;
    // notifyScaleUpdate: () => void;
}
export type ActionBarItemRef = {
    width: number;
    element: HTMLDivElement | null;
    key: string | number;
}
const ActionBarItem = React.forwardRef<ActionBarItemRef, ActionBarItem>( ( props, itemRef ) => {
    const {
        item, scale = false,
        scaleFactor = 1,
        uniqueKey,
        title,
        section,
        alt = <ActionBarAltItem item={item} title={title} />,
        siblingWeight = scaleFactor,
        // notifyScaleUpdate
    } = props;
    const ref = React.useRef<HTMLDivElement | null>(null);
    // const [content, setContent ] = React.useState({
    //     isScaled: false,
    //     item: item
    // }); 

    // Use a reference instead of a state value for better persistence
    // const scaleRef = React.useRef(false);
    // const scaleRef = React.useRef(false);
    const [ isScaled, setScaled ] = React.useState(false);
    const [originalWidth, setOriginalWidth ] = React.useState(ref.current?.clientWidth || 0); 

    // As soon as we get a hold of the div's reference, gets its width and store it
    React.useEffect( () => { 
        if (ref.current?.clientWidth && !originalWidth ) {
            // console.log('recalc original item width', ref.current.clientWidth);
            setOriginalWidth(ref.current.clientWidth);
        }
    }, [item]);

    const sectionWidth = useElementWidth(section);

    // If scaling is enabled and configured correctly, checks if it should switch to scaled item 
    React.useEffect( () => {
        // console.log('calculating for scaling', { originalWidth, sectionWidth: sectionWidth, item: uniqueKey, isScaled: isScaled})
        if ( scale && scaleFactor && sectionWidth && siblingWeight && originalWidth ) {
            if ( !isScaled && originalWidth * scaleFactor >= sectionWidth / siblingWeight ) {
                setScaled(true)
                // console.log(`item original width exceeds section's`, isScaled);
            } else if ( isScaled && originalWidth * scaleFactor < sectionWidth / siblingWeight ) {
                setScaled(false)
                // console.log('disabling scaling', { originalWidth, sectionWidth: sectionWidth, item: uniqueKey});
            }
        }

        // reset to default
        // return () => is(false)
    }, [originalWidth, scale, scaleFactor, sectionWidth, uniqueKey]);

    const currentWidth = useElementWidth(ref.current, 'offsetWidth');

    // Tweaks the exposed ref to supply the updated width
    React.useImperativeHandle( itemRef, () => ({
        width: currentWidth,
        element: ref.current,
        key: uniqueKey
    }), [currentWidth, ref]); // ref may be omitted since currentWidth depends on it

    const renderedItem = React.useMemo( () => {
        return !isScaled ? item : alt;
    }, [isScaled, item, alt]);

    // React.useEffect( () => notifyScaleUpdate && notifyScaleUpdate(), [isScaled]);
    
    return <div ref={ref} className="actionbar-item p025 f jcc">{renderedItem}</div>
});

export default ActionBarItem;