import React, { ReactElement } from "react";
import { connect, useSelector } from "react-redux";
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import { getPokemon } from "../../features/pokeapi/pokemon";

import ActionBar from "../../components/ActionBar";
import Loader from "../../components/Loader";
import PropDetail from "../../components/PropDetail";

interface PropDetailProps {
    [key: string]: any;
}

const renderPropsDetails = (props: PropDetailProps) => {
    const { data } = props;
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

interface ModalProps {
    id: number;
    name: string;
    size: string;
    visible: boolean;
    favorites: string[];
    addToFavorites: (name: string) => void;
    removeFromFavorites: (name: string) => void;
    closeModal: () => void;
    changeContent: (name: string) => void;
    loading: boolean;
    pokemon: PropDetailProps;
    getPokemon: (id: number, name: string) => void;
};

const Modal = ( props: ModalProps ) => {
    const { id, name, size, visible, favorites, addToFavorites, removeFromFavorites, closeModal, changeContent, loading, pokemon, getPokemon } = props;
    React.useEffect(() =>  name && !id && getPokemon(null, name), [name, id]);

    var modalClasses = size ? "modal".concat(" "+size) : "modal";
    var modalFgClasses  = visible ? "modal-fg".concat(" "+"visible") : "modal-fg";

    return(
        <div className={modalFgClasses}>
            <div className={modalClasses}>
                <ActionBar position="top"
                    items={[
                        { item: <span>{name}</span>, position: "center" },
                        { item: !favorites.includes(name) ? 
                            <button onClick={() => addToFavorites(name)}>⭐ Add</button> :
                            <button onClick={() => removeFromFavorites(name)}>⭐ Remove</button>, position: "right"},
                        { item: <button onClick={() => closeModal()}>❌ Close</button>, position: "right"}
                    ]}
                />
                <Loader show={loading} />
                { !loading ? <div className="modal-content">
                    <div 
                        className="hero-container"
                    >   <div className="hero"
                            style={{
                                backgroundImage: pokemon?.sprites?.other["official-artwork"]?.front_default ? 
                                    "url("+pokemon?.sprites.other["official-artwork"].front_default+")" : null
                            }}
                        >
                        &nbsp;
                        </div>
                    </div>
                    <div className="modal-content-details">
                        {renderPropsDetails(pokemon)}
                    </div>
                </div> : <div className="modal-content"></div>}
                <ActionBar position="bottom"
                    items={[
                        { item: <button disabled={!pokemon?.next} onClick={() => changeContent(pokemon?.next)}>Next</button>, position: "right"},
                        { item: <button disabled={!pokemon?.previous} onClick={() => changeContent(pokemon?.previous)}>Previous</button>, position: "left"}
                    ]}
                />
            </div>
        </div>
    );
}

// TODO: Change to hooks
function mapStateToProps({pokemon}: any, ownProps: { data: any; }) {
    debugger;
    let pokemonData = pokemon,
        loading = false;
    if ( ownProps.data ) pokemonData = ownProps.data;
    else {
        loading = pokemon?.loading || false;
    }
    return { 
        pokemon: pokemonData, 
        loading: loading,
        error: pokemon ? pokemon.error : false
    }
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
    return bindActionCreators({getPokemon}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Modal);