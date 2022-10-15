import React from "react";
import './index.scss';

type PropDetailList = any[];
export type PropDetailListLayout = "row" | "column";
type PropDetailListValue = (el: {[key: string]: any}) => JSX.Element;

const renderList = (
    list: PropDetailList,
    extractor: PropDetailListValue,
    layout: PropDetailListLayout = "row"
)  => {
    let className = "propDetail-value-container ".concat(layout);
    let result = <ul className={className}>
        {list.map( (el, i) => {
            return <li key={i} className="propDetail-value">
                {extractor(el)}
            </li>
        })}
    </ul>
    return result;
}

export interface PropDetailProps {
    propName: string;
    propType: string;
    propListLayout?: PropDetailListLayout;
    propNameMap?: {[key: string]: string};
    propValueMap?: {[key: string]: PropDetailListValue}
    value: any;
}

const PropDetail = ( props: PropDetailProps ) => {
    const {propName, propType, propNameMap, propValueMap, propListLayout, value} = props;
    let prop: JSX.Element, 
        detailClasses = "propDetail";
    switch(propType) {
        case "string":
        case "number":
            detailClasses = detailClasses.concat(" inline");
            prop = <div className={detailClasses}>
                <span className="title">
					{propNameMap && propNameMap[propName] || propName}
				</span>
                <div className="propDetail-value">{value}</div>
            </div>
            break;
        case "text":
            prop = <div className={detailClasses}>
                <span className="title">
					{propNameMap && propNameMap[propName] || propName}
				</span>
                <div className="propDetail-value">{value}</div>
            </div>
            break;
        case "list":
            let extractor = propValueMap && propValueMap[propName];
            if ( value instanceof Array && extractor ) {
                prop = <div className={detailClasses}>
                    <span className="title">
                        {propNameMap && propNameMap[propName] || propName}
                    </span>
                    {renderList(value, extractor, propListLayout)}
                </div>
            } else throw new Error("PropDetail - For list prop types, value must be an array and extractor function should be defined");
            break;
        default:
            return null;
    }
    return(
        <>
         {prop}
        </>
    )
}

export default PropDetail;