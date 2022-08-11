import React from "react";

const renderList = ( list ) => {
    let result = <ul className="propDetail-value-container">
        {list.map( (el, i) => {
            return <li key={i} className="propDetail-value"><span>
                    {el}
            </span></li>
        })}
    </ul>
    return result;
}

const PropDetail = ({propName, propType, propNameMap, value}) => {
    let prop, detailClasses = "propDetail";
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
                {renderList(value)}
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

// class PropDetail extends Component {
    
//     render() {
//         const { propName, propType, value } = this.props;
//         var prop, detailClasses = "propDetail";
//         switch(propType) {
//             case "string":
//             case "number":
//                 detailClasses = detailClasses.concat(" inline");
//                 prop = <div className={detailClasses}>
//                     <span className="title">{propName}</span>
//                     <div className="propDetail-value">{value}</div>
//                 </div>
//                 break;
//             case "text":
//                 prop = <div className={detailClasses}>
//                     <span className="title">{propName}</span>
//                     <div className="propDetail-value">{value}</div>
//                 </div>
//                 break;
//             case "list":
//                 if ( !(value instanceof Array) ) throw new Error("PropDetail - For list prop types, value must be an array");
//                 prop = <div className={detailClasses}>
//                     <span className="title">{propName}</span>
//                     {renderList(value)}
//                 </div>
//                 break;
//             default:
//                 return null;
//         }
//         return(
//            <>
//             {prop}
//            </>
//         )
//     }
// }

export default PropDetail;