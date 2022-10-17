import React from 'react';
import './index.scss';

import { useSelector, useDispatch } from "react-redux";

import Modal, { ModalProps } from 'components/commons/Modal';
import Bar from 'components/commons/Bar';
import PropDetail, { PropDetailListLayout }  from 'components/custom/PropDetail';
import { ActionBarItemProps } from 'components/commons/ActionBar';
import { getPokemon, resetPokemon, setFocusedPokemon, PokemonState } from "features/pokeapi/pokemon";
import { AppState } from "store";
import { DetailedListState, PokeDataDetailed } from "features/pokeapi/detailedList";
import { FavoritesState, addToFavorites, removeFromFavorites } from 'features/favoritesMgt';
import Button from 'components/commons/Button';

import logger from 'utils/logger';


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
        if ( el.ability?.name ) {
            let className = 'pokemon-ability';
            element = <span className={className}>
                {el.ability.name}{el.is_hidden && ' '.concat(' (hidden)')}
            </span>;
        }
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

interface PokeModalProps {
    // placeholder
};

const PokeModal = (props: PokeModalProps) => {
    
    const dispatch = useDispatch();

    const doGetPokemon = (name: string) => {
        return dispatch(getPokemon(name));
    }

    const doResetPokemon = () => {
        return dispatch(resetPokemon());
    }

    const pokemonData = useSelector<AppState, PokemonState["data"]>(s => s.pokemon.data),
        name = pokemonData?.name,
        id = pokemonData?.id;

    const detailedList = useSelector<AppState, DetailedListState['results']>(s => s.detailedList.results);

    // NOTE: store objects naming is just temporary
    const favorites = useSelector<AppState, FavoritesState['favorites']>( s => s.favorites.favorites );

    const doFocusPokemon = React.useCallback( ( _pokemonData: PokeDataDetailed) => {
        dispatch(setFocusedPokemon(_pokemonData))
    }, [dispatch]);

    React.useEffect(() => { if (name && !id) doGetPokemon(name)}, [name, id]);

    // TODO: Removing inline function with more specific callback,
    // since the arguments are available in the context
    const getNavigation = React.useCallback( (): ActionBarItemProps[] => {
        return [
            {
                item: <Button
                    disabled={!pokemonData?.next}
                    onClick={() => doFocusPokemon(detailedList[pokemonData?.next])}>Next
                </Button>, position: "right", key: 'nav-next'
            },
            {
                item: <Button
                    disabled={!pokemonData?.previous}
                    onClick={() => doFocusPokemon(detailedList[pokemonData?.previous])}>Previous
                </Button>, position: "left", key: 'nav-text'
            }
        ]
    }, [pokemonData, detailedList]);

    const heroImg = pokemonData?.sprites?.other['official-artwork']?.front_default;

    const doAddToFavorites = React.useCallback( () => {
        return name && dispatch(addToFavorites(name))
    }, [dispatch, name]);

    const doRemoveFromFavorites = React.useCallback( () => {
        return name && dispatch(removeFromFavorites(name))
    }, [dispatch, name]);

    const getActionBarItems = React.useCallback( () => {
        logger.debug(favorites, 'PokeModal - got favorites');
        const add = { 
            item: <Button iconName='star' type='primary' onClick={doAddToFavorites}>Add</Button>, position: "right",
            title: 'Add to favorites',
            key: 'favorite-add'
        }
        const remove = {
            item: <Button iconName='star-o' type='primary' onClick={doRemoveFromFavorites}>Remove</Button>,
            position: "right",
            title: 'Remove from favorites',
            key: 'favorite-remove'
        }
        if (name) return [
            !favorites.includes(name) ? add : remove
        ]; else return []
    }, [favorites, name]) as () => ActionBarItemProps[];

    return(
        <Modal
            visible={!!pokemonData}
            closeModal={doResetPokemon}
            title={name}
            btmActionBarItems={getNavigation}
            topActionBarItems={getActionBarItems}
        >
            <div className='pokemon-data f fd-row mfd-col'>
                { heroImg && <div 
                    className="pokemon-hero-container"
                >   <div className="hero r-4-5"
                        style={{
                            backgroundImage: 
                                "url("+heroImg+")"
                        }}
                    >
                    &nbsp;
                    </div>
                </div> }
                <div className="pokemon-details">
                    {pokemonData && renderPropsDetails({...pokemonData}, inlineProps, listProps)}
                </div>
            </div>
        </Modal>
    )
}

export default PokeModal;