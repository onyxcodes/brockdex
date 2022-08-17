import React from 'react';

import { connect } from 'react-redux';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';

import { getPokemon } from '../../features/pokeapi/pokemon';

import Modal, { ModalProps } from '../Modal';
import Bar from '../../components/Bar';
import PropDetail, { PropDetailListLayout }  from '../../components/PropDetail';
import { ActionBarItemProps } from '../../components/ActionBar';


const inlineProps = ['base_experience', 'weight', 'height'];
const listProps = ['types', 'stats', 'abilities'];

const propDetailNames = {
    base_experience: 'Base exeperience',
    weight: 'Weight',
    height: 'Height',
}

const pokemonTypesColor: { [key: string]: string } = {
    'hp': '#FF0000',
    'attack': '#F08030',
    'defense': '#F8D030',
    'special-attack': '#6890F0',
    'special-defense': '#78C850',
    'speed': '#F85888'
};

const pokemonDataLayout: { [key: string]: PropDetailListLayout } = {
    'types': 'row',
    'stats': 'column',
    'abilities': 'row'
}

const propListValues = {
    'types': function(el: {
        type?: { name: string }
    }) {
        let element: JSX.Element = <></>;
        if ( el.type?.name ) {
            let className = 'pokemon-type '.concat(el.type.name);
                element = <div className={className}>
                    {el.type.name}
                </div>;
        } // else log error
        return (element);
    },
    'stats': function(el: {
        'base_stat'?: number,
        'effort'?: number,
        'stat'?: {
            'name'?: string,
            'url'?: string
        }
    }) {
        let element: JSX.Element = <></>;
        if ( el.stat?.name && el.base_stat ) {
            let className = 'pokemon-stat',
                maxValue= 255,
                color = pokemonTypesColor[el.stat.name];
            element = <div className={className}>
                <span className='pokemon-stat-label'>{el.stat.name}</span>
                <Bar value={el.base_stat} maxValue={maxValue} color={color}/>
            </div>;
        } // else log error
        return (element);
    },
    'abilities': function(el: {
        'ability'?: {
            'name'?: string,
            'url'?: string
        },
        'is_hidden'?: boolean,
        'slot'?: number
    }) {
        let element: JSX.Element = <></>;
        if ( el.ability?.name && el.is_hidden ) {
            let className = 'pokemon-ability';
            element = <span className={className}>
                {el.ability.name}{el.is_hidden && ' '.concat(' (hidden)')}
            </span>;
        } // else log error
        return element;
    }
}

const renderPropsDetails = (
    props: {[key: string]: any},
    inlineProps: string[] = [],
    listProps: string[] = []
): (JSX.Element | undefined)[]  => {
    let details: (JSX.Element | undefined)[] = [];
    if (props) details = Object.entries(props).map( ( [key, value], index) => {
        if ( inlineProps.includes(key) ) {
            return <PropDetail 
                key={index}
                propType='string'
                propNameMap={propDetailNames}
                propName={key}
                value={value}
            />
        } else if ( listProps.includes(key) ) {
            return <PropDetail 
                key={index}
                propType='list'
                propListLayout={pokemonDataLayout[key]}
                propName={key}
                propNameMap={propDetailNames}
                propValueMap={propListValues}
                value={value}
            />
        }
    });
    return details;
}

interface PokeModalProps extends ModalProps {
    id?: number;
    name: string;
    pokemon?: { [key: string]: any };
    getPokemon: (id?: number, name?: string) => void;
    getBtmBarItems?: (element: {}) => ActionBarItemProps[];
};

const PokeModal = (props: PokeModalProps) => {
    const { id, name, pokemon, getPokemon, getBtmBarItems } = props;
    
    React.useEffect(() => { if (name && !id) getPokemon(undefined, name)}, [name, id]);

    const heroImg = pokemon?.sprites?.other['official-artwork']?.front_default;
    return(
        <Modal 
            title={name}
            heroImg={heroImg}
            btmActionBarItems={getBtmBarItems && pokemon && getBtmBarItems(pokemon)}
            {...props}
        >
            {pokemon && renderPropsDetails({...pokemon}, inlineProps, listProps)}
        </Modal>
    )
}

// TODO: Change to hooks
function mapStateToProps({pokemon}: any, ownProps: { id: number; data: any; }) {
    let pokemonData = pokemon,
        loading = false;
    if ( ownProps.id ) pokemonData = ownProps.data;
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
  
export default connect(mapStateToProps, mapDispatchToProps)(PokeModal);