import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { getPokemon } from "../../features/pokeapi/pokemon";

import ActionBar from "../../components/ActionBar";
import Loader from "../../components/Loader";
import PropDetail from "../../components/PropDetail";

const renderPropsDetails = (data) => {
    let details;
    if (data) details = Object.entries(data).map( ( [key, value], index) => {
        if ( ["base_experience", "weight", "height"].includes(key) ) {
            return <PropDetail 
                key={index}
                propType="string"
                propName={key}
                value={value}
            />
        } else if ( [""].includes(key) ) {
            return <PropDetail 
                key={index}
                propType="list"
                propName={key}
                value={value}
            />
        }
    });
    return details;
}

class Modal extends Component {
    
    componentDidMount() {
        // Condition allows avoiding calling redux action when data is already present 
        if ( !this.props.data?.id && this.props.id ) this.props.getPokemon(null, this.props.id);
    }

    render() {
        const { 
            size, visible, closeModal, 
            favorites, addToFavorites, removeFromFavorites,
            changeContent
        } = this.props;
        var data = this.props.data || this.props.pokemon;
        var loading = data ? false : this.props.loading;
        // var nextItem = list ? 
        var modalClasses = size ? "modal".concat(" "+size) : "modal";
        var modalFgClasses  = visible ? "modal-fg".concat(" "+"visible") : "modal-fg";
        return(
            <div className={modalFgClasses}>
                <div className={modalClasses}>
                    <ActionBar position="top"
                        items={[
                            { item: <span>{data?.name}</span>, position: "center" },
                            { item: !favorites.includes(data?.name) ? 
                                <button onClick={() => addToFavorites(data?.name)}>⭐ Add</button> :
                                <button onClick={() => removeFromFavorites(data?.name)}>⭐ Remove</button>, position: "right"},
                            { item: <button onClick={() => closeModal()}>❌ Close</button>, position: "right"}
                        ]}
                    />
                    <Loader show={loading} />
                    { !loading ? <div className="modal-content">
                        <div 
                            className="hero-container"
                        >   <div className="hero"
                                style={{
                                    backgroundImage: data?.sprites?.other["official-artwork"]?.front_default ? 
                                        "url("+data?.sprites.other["official-artwork"].front_default+")" : null
                                }}
                            >
                            &nbsp;
                            </div>
                        </div>
                        <div className="modal-content-details">
                            {renderPropsDetails(data)}
                        </div>
                    </div> : <div className="modal-content"></div>}
                    <ActionBar position="bottom"
                        items={[
                            { item: <button disabled={!data?.next} onClick={() => changeContent(data?.next)}>Next</button>, position: "right"},
                            { item: <button disabled={!data?.previous} onClick={() => changeContent(data?.previous)}>Previous</button>, position: "left"}
                        ]}
                    />
                </div>
            </div>
        )
    }
}

function mapStateToProps({pokemon}) {
    return { 
        pokemon, 
        loading: pokemon ? pokemon.loading : true,
        error: pokemon ? pokemon.error : false
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getPokemon}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Modal);