import React from "react";

import ActionBar, { ActionBarItemProps } from "../components/ActionBar";
import SearchBar from "../components/SearchBar";
import ListView from "../views/ListView";

import FavoritesMgt from "../features/favoritesMgt";
import PokeModal from "../views/PokeModal";


const favoriteActionBarItems = ( 
    favorites: (number | string)[],
    favoriteKey: number | string, 
    add: () => void,
    remove: () => void
): ActionBarItemProps[] => {
    return [
        { 
            item: !favorites.includes(favoriteKey) ? 
            <button onClick={() => add()}>⭐ Add</button> :
            <button onClick={() => remove()}>⭐ Remove</button>, position: "right"
        }
    ];
}

const listMoveActionBarItems = (
    pokemon: { [key: string]: any },
    changeContent: ( element: string ) => void
): ActionBarItemProps[] => {
    return [
        { item: <button 
            disabled={!pokemon?.next}
            onClick={() => changeContent(pokemon?.next)}>Next
        </button>, position: "right"},
        { item: <button
            disabled={!pokemon?.previous}
            onClick={() => changeContent(pokemon?.previous)}>Previous
        </button>, position: "left"}
    ]
}

const App = () => {
    const [ modalVisible, showModal ] = React.useState(false);
    const [ focusedElement, setFocusedEl ] = React.useState(null);
    const [ searchQuery, setSearchQuery ] = React.useState("");
    const [ total, setTotal ] = React.useState(null); // TODO: consider setting 0 as init val
    const [ favoritesMgt , setFavoritesMgt ] = React.useState(new FavoritesMgt());
    // TODO: consider using another state property to determine whether to know that is showing favorites list
    // and therefore disable search features
    const [ favoritesShown, setFavoritesVisible ] = React.useState(false);
    const [ list, setList ] = React.useState<{[key: string]: any}>();

    // Updates total count stored in localStorage with given total, if differs
    const updateTotal = ( total: number ) => {
        let storedTotal = localStorage.getItem("total") ? Number(localStorage.getItem("total")) : null;
        if ( !total || isNaN(total) ) {
            console.log(`updateTotal - Given total is not a number: ${total}`);
        } else if ( 
            storedTotal && // total already stored
            storedTotal !== total // update only when different
        ) {
            localStorage.setItem("total", total.toString());
        } else if ( !storedTotal ) { // in case was not stored yet
            localStorage.setItem("total",  total.toString())
        } // else // skip update cause not needed
    }

    // Updates with total number of pokemon, only once when list first loads
    React.useEffect( () => updateTotal(total), [total] );

    // The PokeModal will be shown/hidden based on focusedElement presence
    // and current modal state (if is already shown won't trigger)
    React.useEffect( () => {
        ( !modalVisible || !focusedElement ) && showModal(!!focusedElement);
    }, [focusedElement]);

    // When called, adds currently focused el to favorites
    const addToFavorites = () => {
        let favorites = favoritesMgt.addToFavorites(focusedElement.name);
        setFavoritesMgt(new FavoritesMgt(favorites));
    }

    // When called, removes currently focused el to favorites
    const removeFromFavorites = () => {
        let favorites = favoritesMgt.removeFromFavorites(focusedElement.name);
        setFavoritesMgt(new FavoritesMgt(favorites));
    }

    return (<div id="app">
        <ActionBar bgColor="blueviolet" position="top" items={[
            { 
                item: <SearchBar 
                    value={searchQuery} 
                    disabled={favoritesShown} 
                    setSearchQuery={setSearchQuery}
                />,
                position: "left" 
            },
            { item: <span>BrockDex</span>, position: "center" },
            { item: <button>Favs</button>, position: "right" }
        ]} />
        <ListView 
            query={searchQuery}
            setPokemonList={(list, total) => { setList(list); setTotal(total) }}
            openDetails={(el) => setFocusedEl(el)}
        />
        { modalVisible && <PokeModal
            id={focusedElement?.id}
            name={focusedElement?.name}
            visible={modalVisible}
            closeModal={() => setFocusedEl(null)}
            topActionBarItems={favoriteActionBarItems(
                favoritesMgt.getFavorites(),
                focusedElement?.name,
                () => addToFavorites(),
                () => removeFromFavorites()
            )}
            getBtmBarItems={(element) => listMoveActionBarItems(element, (element) => setFocusedEl(list[element]))}
            data={focusedElement} /> }
    </div>)
}

export default App;