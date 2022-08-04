import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';

import { getPokemonList } from "../../features/pokeapi/detailedList";
import Loader from "../Loader";

class Card extends Component {

    render() {
        const { id, list, title, size, openDetails, color, loading, pokemon } = this.props;
        var data = list?.[id];
        var cardClasses = size ? "card".concat(" "+size) : "card";
        return(
            <div 
                className={cardClasses}
                onClick={() => openDetails(list[id] || pokemon)}
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