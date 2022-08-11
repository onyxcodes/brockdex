import React from "react";
import { connect, useSelector } from "react-redux";
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import { getPokemon } from "../../features/pokeapi/pokemon";

import ActionBar from "../../components/ActionBar";
import Loader from "../../components/Loader";
import PropDetail from "../../components/PropDetail";

import { ActionBarItemProps } from "../../components/ActionBar"

interface PropDetailRenderProps {
    [key: string]: any;
}

// TODO: Consider extracting into localization file
const propDetailNames = {
    base_experience: "Base exeperience",
    weight: "Weight",
    height: "Height",
}

const propListValues = {
    "types": function(el: {
        type: { name: string }
    }) {
        let className = "pokemon-type ".concat(el.type.name);
        return (<div className={className}>
            {el.type.name}
        </div>);
    }
}

const renderPropsDetails = (props: PropDetailRenderProps) => {
    let details;
    if (props) details = Object.entries(props).map( ( [key, value], index) => {
        if ( ["base_experience", "weight", "height"].includes(key) ) {
            return <PropDetail 
                key={index}
                propType="string"
                propNameMap={propDetailNames}
                propName={key}
                value={value}
            />
        } else if ( ["types"].includes(key) ) {
            return <PropDetail 
                key={index}
                propType="list"
                propName={key}
                propNameMap={propDetailNames}
                propValueMap={propListValues}
                value={value}
            />
        }
    });
    return details;
}

interface ModalProps {
    id?: number;
    name: string;
    size: string;
    topActionBarItems?: ActionBarItemProps[];
    btmActionBarItems?: (element: {}) => ActionBarItemProps[];
    visible: boolean;
    closeModal: () => void;
    loading: boolean;
    pokemon: PropDetailRenderProps;
    getPokemon: (id: number, name: string) => void;
};

const Modal = ( props: ModalProps ) => {
    const { 
        id, name, 
        size = "medium", visible = false, closeModal,
        topActionBarItems, btmActionBarItems,
        loading, pokemon, getPokemon
    } = props;
    React.useEffect(() =>  name && !id && getPokemon(null, name), [name, id]);

    var modalClasses = size ? "modal".concat(" "+size) : "modal";
    var modalFgClasses  = visible ? "modal-fg".concat(" "+"visible") : "modal-fg";

    return(
        <div className={modalFgClasses}>
            <div className={modalClasses}>
                <ActionBar position="top"
                    items={[
                        { item: <span>{name}</span>, position: "center" },
                        ...topActionBarItems,
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
                        {renderPropsDetails({propDetailNames, propListValues,...pokemon})}
                    </div>
                </div> : <div className="modal-content"></div>}
                <ActionBar position="bottom"
                    items={[
                        ...btmActionBarItems(pokemon)
                    ]}
                />
            </div>
        </div>
    );
}

// TODO: Change to hooks
function mapStateToProps({pokemon}: any, ownProps: { data: any; }) {
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