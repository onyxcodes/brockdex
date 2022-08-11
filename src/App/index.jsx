import React, { Component } from "react";

import ActionBar from "../components/ActionBar";
import SearchBar from "../components/SearchBar";
import ListView from "../views/ListView";
import Modal from "../views/Modal";

import FavoritesMgt from "../features/favoritesMgt";

// interface FavoritesActions {
//     favoriteKey: string;

// }
const favoriteActionBarItems = ( favorites, favoriteKey, add, remove ) => {
    return [
        { 
            item: !favorites.includes(favoriteKey) ? 
            <button onClick={() => add(favoriteKey)}>⭐ Add</button> :
            <button onClick={() => remove(favoriteKey)}>⭐ Remove</button>, position: "right"
        }
    ];
}

const listMoveActionBarItems = ( pokemon, changeContent ) => {
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

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            focusedElement: null,
            searchQuery: null,
            total: null,
            favoritesMgt: new FavoritesMgt(),
            favorites: null,
            favoritesVisible: false,
            list: {},
        }
    }

    updateTotal( total ) {
        let storedTotal = localStorage.getItem("total") ? Number(localStorage.getItem("total")) : null;
        if ( storedTotal && // total already stored
            storedTotal !== total && // update only when different
            !isNaN(total) // given total is a number
        ) {
            localStorage.setItem("total", total);
        } else if ( !storedTotal ) { // in case was not stored yet
            localStorage.setItem("total", total)
        } else if ( !isNaN(total) ) {
            throw Error("Given total is not a number", total);
        } // else // skip update cause not needed
    }

    setPokemonList( list, total ) {
        this.updateTotal(total);
        this.setState({
            list: list
        })
    }

    setSearchQuery(name) {
        this.setState({ searchQuery: name })
    }

    openDetails( element ) {
        this.setState({
            focusedElement: element
        }, () => {
            this.setState({
                showModal: true
            })
        })
    }

    changeContent( elementName ) {
        let element = this.state.list[elementName];
        this.setState({
            showModal: false
        }, () => this.openDetails(element));
    }

    closeModal() {
        this.setState({
            showModal: false
        })
    }

    addToFavorites(elementId) {
        let favorites = this.state.favoritesMgt.addToFavorites(elementId);
        this.setState({ favoritesMgt: new FavoritesMgt(favorites) })
    }

    removeFromFavorites(elementId) {
        let favorites = this.state.favoritesMgt.removeFromFavorites(elementId);
        this.setState({ favoritesMgt: new FavoritesMgt(favorites) })
    }

    render() {
        return (
            <div id="app">
                <ActionBar bgColor="blueviolet" position="top" items={[
                    { item: <SearchBar value={this.state.searchQuery} disabled={this.state.favoritesVisible} setSearchQuery={(name)=> this.setSearchQuery(name)}/>, position: "left" },
                    { item: <span>BrockDex</span>, position: "center" },
                    { item: <button>Favs</button>, position: "right" }
                ]} />
                <ListView 
                    size="medium"
                    query={this.state.searchQuery}
                    total={localStorage.getItem("total")}
                    setPokemonList={(list) => this.setPokemonList(list)}
                    openDetails={(el) => this.openDetails(el)}
                />
                { this.state.showModal ? <Modal
                    id={this.state.focusedElement?.id}
                    name={this.state.focusedElement?.name}
                    visible={this.state.showModal}
                    closeModal={() => this.closeModal()}
                    topActionBarItems={favoriteActionBarItems(
                        this.state.favoritesMgt.getFavorites(),
                        this.state.focusedElement?.name,
                        (elId) => this.addToFavorites(elId),
                        (elId) => this.removeFromFavorites(elId)
                    )}
                    btmActionBarItems={(element) => listMoveActionBarItems(element, (element) => this.changeContent(element))}
                    changeContent={(element) => this.changeContent(element)}
                    data={this.state.focusedElement}
                    size="medium"
                /> : null }
            </div>
        )
    }
}

export default App;