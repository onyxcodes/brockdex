import React from "react";

import Loader from "../Loader";

const FnCard = ( props ) => {
    const { id, list,
        loading, title, size, openDetails, color,
        next, previous
    } = props;

    // The following actually modifies the referenced object in the list passed
    // by the parent component
    // TODO: Check if is a doable practice in React
    var data = list?.[id];
    if (data) {
        data.name = id;
        data.next = next,
        data.previous = previous;
    } else data = { name: id };
    
    var cardClasses = size ? "card".concat(" "+size) : "card";

    return(
        <div 
            className={cardClasses}
            onClick={() => openDetails(data)}
        >
            <Loader show={loading} />
            <div className="card-hero" style={{
                backgroundColor: !data?.sprites?.other["official-artwork"]?.front_default ? color || "#999999" : null,
                backgroundImage: data?.sprites?.other["official-artwork"]?.front_default ? 
                "url("+data?.sprites.other["official-artwork"].front_default+")" : null
            }}></div>
            <span className="card-title">{title}</span>
        </div>
    )
}

export default FnCard;