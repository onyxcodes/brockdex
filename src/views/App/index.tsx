import React from "react";

import ActionBar, { ActionBarItemProps } from "components/commons/ActionBar";
import SearchBar from "components/commons/SearchBar";
import ListView, { PokeDataShallow } from "../ListView";

import FavoritesMgt from "utils/favoritesMgt";
import PokeModal from "components/custom/PokeModal";
import { useSelector, useDispatch } from "react-redux";

import { listPokemon, ListState } from "features/pokeapi/list";
import { getPokemonList, DetailedListState } from "features/pokeapi/detailedList";
import { getPokemon, resetPokemon, PokemonState } from "features/pokeapi/pokemon";

import { AppState } from "store";
import { setQuery, UIState } from "features/ui";

import 'styles/index.scss';

// const favoriteActionBarItems = (
//     favorites: (number | string)[],
//     favoriteKey: number | string,
//     add: () => void,
//     remove: () => void
// ): ActionBarItemProps[] => {
//     return [
//         {
//             item: !favorites.includes(favoriteKey) ?
//                 <button onClick={add}>⭐ Add</button> :
//                 <button onClick={remove}>⭐ Remove</button>, position: "right",
//                 title: 'Favorites'
//         }
//     ];
// }

// const listMoveActionBarItems = (
//     pokemon: { [key: string]: any },
//     changeContent: (element: string) => void
// ): ActionBarItemProps[] => {
//     return [
//         {
//             item: <button
//                 disabled={!pokemon?.next}
//                 onClick={() => changeContent(pokemon?.next)}>Next
//             </button>, position: "right"
//         },
//         {
//             item: <button
//                 disabled={!pokemon?.previous}
//                 onClick={() => changeContent(pokemon?.previous)}>Previous
//             </button>, position: "left"
//         }
//     ]
// }


// TODO: prepare const file for each component and import default state and props values
const App = () => {
    const dispatch = useDispatch();
    // const [modalVisible, showModal] = React.useState(false);
    // const [focusedElement, setFocusedEl] = React.useState<{ [key: string]: any; } | null>(null);
    // const [ searchQuery, setSearchQuery ] = React.useState("");
    // const [favoritesMgt, setFavoritesMgt] = React.useState(new FavoritesMgt());
    // TODO: consider using another state property to determine whether to know that is showing favorites list
    // and therefore disable search features
    const [favoritesShown, setFavoritesVisible] = React.useState(false);

    // Updates total count stored in localStorage with given total, if differs
    const updateTotal = (total: number) => {
        let storedTotal = localStorage.getItem("total") ? Number(localStorage.getItem("total")) : null;
        if (!total || isNaN(total)) {
            console.log(`updateTotal - Given total is not a number or 0: ${total}`);
        } else if (
            storedTotal && // total already stored
            storedTotal !== total // update only when different
        ) {
            localStorage.setItem("total", total.toString());
        } else if (!storedTotal) { // in case was not stored yet
            localStorage.setItem("total", total.toString())
        } // else // skip update cause not needed
    }

    const responseTotal = useSelector<AppState, ListState["total"]>(s => s.list.total);

    const searchQuery = useSelector<AppState, UIState['query']>(s => s.ui.query);

    const setSearchQuery = React.useCallback((query) => {
        dispatch(setQuery(query))
    }, [dispatch])

    // Updates with total number of pokemon, only once when list first loads
    React.useEffect(() => updateTotal(responseTotal), [responseTotal]);

    // The PokeModal will be shown/hidden based on focusedElement presence
    // and current modal state (if is already shown won't trigger)
    // React.useEffect(() => {
    //     (!modalVisible || !focusedElement) && showModal(!!focusedElement);
    //     !focusedElement && doResetPokemon();
    // }, [focusedElement]);

    // When called, adds currently focused el to favorites
    // const addToFavorites = React.useCallback(() => {
    //     if (focusedElement) {
    //         let favorites = favoritesMgt.addToFavorites(focusedElement.name);
    //         setFavoritesMgt(new FavoritesMgt(favorites));
    //     } // else throw error
    // }, [focusedElement?.name]);

    // // When called, removes currently focused el to favorites
    // const removeFromFavorites = React.useCallback(() => {
    //     if (focusedElement) {
    //         let favorites = favoritesMgt.removeFromFavorites(focusedElement.name);
    //         setFavoritesMgt(new FavoritesMgt(favorites));
    //     } // else throw error

    // }, [focusedElement?.name]);

    // const detailedListData = useSelector<AppState, DetailedListState["results"]>(s => s.detailedList.results);

    // const pokemonData = useSelector<AppState, PokemonState["data"]>(s => s.pokemon.data);
    // const pokemonLoad = useSelector<AppState, PokemonState["loading"]>(s => s.pokemon.loading);
    // const doGetPokemon = (name: string) => {
    //     return dispatch(getPokemon(name));
    // }

    // const doResetPokemon = () => {
    //     return dispatch(resetPokemon());
    // }

    return (<div id="app">
        <div id='modal-area'></div>
        <main>
            <ActionBar type='primary' position="top" items={[
                {
                    item: <SearchBar
                        value={searchQuery}
                        disabled={favoritesShown}
                        setSearchQuery={setSearchQuery}
                    />,
                    title: 'Search',
                    position: "left",
                    key: 'searchbar'
                },
                { item: <span>BrockDex</span>, position: "center", key: 'app-logo' },
                { item: <button>Favs</button>, position: "right", key: 'favorite-btn' }
            ]} />
            <ListView
                // query={searchQuery}
                // openDetails={(el) => setFocusedEl(el)}
            />
            <PokeModal
                // id={focusedElement?.id}
                // name={focusedElement?.name}
                // visible={modalVisible}
                // closeModal={() => setFocusedEl(null)}
                // topActionBarItems={favoriteActionBarItems(
                //     favoritesMgt.getFavorites(),
                //     focusedElement?.name,
                //     addToFavorites,
                //     removeFromFavorites
                // )}
                // getBtmBarItems={(element) => listMoveActionBarItems(element, (element) => setFocusedEl(detailedListData[element]))}
                // getPokemon={doGetPokemon}
                // loading={pokemonLoad}
                // pokemon={pokemonData || focusedElement || undefined} 
                />
        </main>
    </div>

    )
}

export default App;