import React, { Component } from "react";

import Loader from "../Loader";

class Card extends Component {

    render() {
        const { id, list,
            loading, title, size, openDetails, color,
            next, previous
        } = this.props;
        var data = { name: id, ...list?.[id] };
        if (data) {
            data.next = next,
            data.previous = previous;
        }
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
}

export default Card;