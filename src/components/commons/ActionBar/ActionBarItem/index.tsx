import React, { ForwardedRef, MutableRefObject } from 'react';
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
    sectionRef?: MutableRefObject<HTMLDivElement | null>;
    setReady?: ( arg: any ) => void;
}
export type ActionBarItemRef = {
    element: HTMLDivElement | null;
    key: string | number;
}
const ActionBarItem = ( props: ActionBarItem ) => {
    const {
        item, scale = true,
        scaleFactor = 1,
        uniqueKey,
        title,
        sectionRef,
        alt = <ActionBarAltItem item={item} title={title} />,
        siblingWeight = scaleFactor,
        setReady,
    } = props;
    const ref = React.useRef<HTMLDivElement | null>(null);
 
    // Describes whethere the item should be scaled or not
    const [ scaling, setScaled ] = React.useState<{
        value: boolean | null;
        width: number
    }>({
        value: null,
        width: 0
    });

    // Keeps track of original width before scaling
    // Needed to understand when it shoulg go back to original form
    const [originalWidth, setOriginalWidth ] = React.useState(ref.current?.clientWidth || 0); 

    // As soon as we get a hold of the div's reference, gets its width and store it
    React.useEffect( () => { 
        if (ref.current?.clientWidth && !originalWidth ) {
            // console.log('recalc original item width', ref.current.clientWidth);
            setOriginalWidth(ref.current.clientWidth);
        }
    }, [item]);

   

    const sectionWidth = useElementWidth(sectionRef?.current);

    React.useEffect( () => {
        if (uniqueKey === 'favorite-add' ) debugger;
    }, [sectionRef])
    

    // If scaling is enabled and configured correctly, checks if it should switch to scaled form
    React.useLayoutEffect( () => {
        // console.log('calculating for scaling', { originalWidth, sectionWidth: sectionWidth, item: uniqueKey, scaling: scaling})
        console.log({uniqueKey, sectionWidth, originalWidth, siblingWeight})
        if ( scale && scaleFactor && sectionWidth && siblingWeight && originalWidth ) {
            if ( !scaling.value && originalWidth * scaleFactor > sectionWidth / siblingWeight ) {
                setScaled({value: true, width: 0})
                console.log(`item original width exceeds sectionRef's`, scaling);
            } else if ( (scaling.value || scaling.value == null) && originalWidth * scaleFactor <= sectionWidth / siblingWeight ) {
                setScaled({value: false, width: 0})
                console.log('disabling scaling', { originalWidth, sectionWidth: sectionWidth, item: uniqueKey});
            } 
        } else if ( !scale ) {
            setScaled({value: false, width: 0})
        }
    }, [originalWidth, scale, scaleFactor, sectionWidth, uniqueKey]);

    const currentWidth = useElementWidth(ref.current, 'offsetWidth');


    // const customRef = React.useMemo( () => ({
    //     element: ref.current,
    //     key: uniqueKey
    // }), [currentWidth, ref]); // ref may be omitted since currentWidth depends on it

    const renderedItem = React.useMemo( () => {
        return !scaling.value ? item : alt;
    }, [scaling, item, alt]);

    React.useEffect( () => {
        const width = ref.current?.clientWidth || 0;
        if ( (scaling.value === true || scaling.value === false) && scaling.width !== width ) {
            // console.log({currentWidth, element: ref.current, width});
            setScaled({ value: scaling.value, width });
        }
    }, [scaling, ref]);

    React.useEffect( () => {
        const customRef = {
            element: ref.current,
            key: uniqueKey
        }
        let timeoutId: number;
        if (renderedItem && scaling.width ) {
            timeoutId = window.setTimeout( () => setReady && setReady(customRef), 500);
        }
        // setReady && setReady(customRef)

        return () => {
            if (timeoutId) window.clearTimeout(timeoutId)
        }
    }, [renderedItem, scaling]);
    
    return <div ref={ref} className="actionbar-item p025 f jcc">{renderedItem}</div>
}

export default ActionBarItem;