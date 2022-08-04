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
    
    // TODO: on component mount fetch deatils through given id or name
    componentDidMount() {
        this.props.getPokemon(null, this.props.data?.current);
    }

    openNextDetails(data) {
        let nextdata = {
            current: data.next,
            previous: data.current,
            next: null
        }
        this.props.changeContent(nextdata);
        this.props.getPokemon(null, nextdata?.current);
    }

    openPreviousDetails(data) {
        let prevdata = {
            current: data.previous,
            previous: null,
            next: data.current
        }
        this.props.changeContent(prevdata);
        this.props.getPokemon(null, prevdata?.current);
    }

    render() {
        const { 
            size, visible, closeModal, data, loading, pokemon, 
            favorites, addToFavorites, removeFromFavorites
        } = this.props;
        var modalClasses = size ? "modal".concat(" "+size) : "modal";
        var modalFgClasses  = visible ? "modal-fg".concat(" "+"visible") : "modal-fg";
        debugger;
        return(
            <div className={modalFgClasses}>
                <div className={modalClasses}>
                    <ActionBar position="top"
                        items={[
                            { item: <span>{data?.current}</span>, position: "center" },
                            { item: !favorites.includes(data?.current) ? 
                                <button onClick={() => addToFavorites(data?.current)}>⭐ Add</button> :
                                <button onClick={() => removeFromFavorites(data?.current)}>⭐ Remove</button>, position: "right"},
                            { item: <button onClick={() => closeModal()}>❌ Close</button>, position: "right"}
                        ]}
                    />
                    <Loader show={loading} />
                    { console.log("Got pokemon data", pokemon)}
                    { !loading ? <div className="modal-content">
                        <div 
                            className="hero-container"
                        >   <div className="hero"
                                style={{
                                    backgroundImage: pokemon?.sprites?.other["official-artwork"]?.front_default ? 
                                        "url("+pokemon?.sprites.other["official-artwork"].front_default+")" : ""
                                }}
                            >
                            &nbsp;
                            </div>
                        </div>
                        <div className="modal-content-details">
                            {renderPropsDetails(pokemon)}
                        </div>
                    </div> : <div className="modal-content"></div>}
                    {/* <ActionBar position="bottom"
                        items={[
                            { item: <button disabled={!data.next} onClick={() => this.openNextDetails(data)}>Next</button>, position: "right"},
                            { item: <button disabled={!data.previous} onClick={() => this.openPreviousDetails(data)}>Previous</button>, position: "left"}
                        ]}
                    /> */}
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