import React from "react";

type PropDetailList = any[];
type PropDetailListValue = (el: any) => any;

const renderList = (list: PropDetailList, extractor: PropDetailListValue)  => {
    let result = <ul className="propDetail-value-container">
        {list.map( (el, i) => {
            return <li key={i} className="propDetail-value"><span>
                    {extractor(el)}
            </span></li>
        })}
    </ul>
    return result;
}

export interface PropDetailProps {
    propName: string;
    propType: string;
    propNameMap?: {[key: string]: string};
    propValueMap?: {[key: string]: PropDetailListValue}
    value: any;
}
const PropDetail = ( props: PropDetailProps ) => {
    const {propName, propType, propNameMap, propValueMap, value} = props;
    let prop: JSX.Element, 
        detailClasses = "propDetail";
    switch(propType) {
        case "string":
        case "number":
            detailClasses = detailClasses.concat(" inline");
            prop = <div className={detailClasses}>
                <span className="title">
					{propNameMap[propName] || propName}
				</span>
                <div className="propDetail-value">{value}</div>
            </div>
            break;
        case "text":
            prop = <div className={detailClasses}>
                <span className="title">
					{propNameMap[propName] || propName}
				</span>
                <div className="propDetail-value">{value}</div>
            </div>
            break;
        case "list":
            if ( !(value instanceof Array) ) throw new Error("PropDetail - For list prop types, value must be an array");
            prop = <div className={detailClasses}>
                <span className="title">
					{propNameMap[propName] || propName}
				</span>
                {renderList(value, propValueMap[propName])}
            </div>
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