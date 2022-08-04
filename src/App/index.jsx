import React, { Component } from "react";

import ActionBar from "../components/ActionBar";
import SearchBar from "../components/SearchBar";
import ListView from "../views/ListView";
import Modal from "../views/Modal";

import FavoritesMgt from "../features/favoritesMgt";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            focusedElement: null,
            favoritesMgt: new FavoritesMgt(),
            favorites: null,
            favoritesVisible: false,
            list: {}
        }
    }

    setPokemonList( list ) {
        this.setState({
            list: list
        })
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
                    { item: <SearchBar />, position: "left" },
                    { item: <span>BrockDex</span>, position: "center" },
                    { item: <button>Favs</button>, position: "right" }
                ]} />
                <ListView 
                    paginated={false}
                    size="medium"
                    setPokemonList={(list) => this.setPokemonList(list)}
                    openDetails={(el) => this.openDetails(el)}
                />
                { this.state.showModal ? <Modal
                    visible={this.state.showModal}
                    closeModal={() => this.closeModal()}
                    changeContent={(element) => this.changeContent(element)}
                    favorites={this.state.favoritesMgt.getFavorites()}
                    addToFavorites={(elId) => this.addToFavorites(elId)}
                    removeFromFavorites={(elId) => this.removeFromFavorites(elId)}
                    data={this.state.focusedElement}
                    size="medium"
                /> : null }
            </div>
        )
    }
}

export default App;