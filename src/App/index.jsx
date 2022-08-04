import React, { Component } from "react";

import ActionBar from "../components/ActionBar";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import ListView from "../views/ListView";
import Modal from "../views/Modal";

import FavoritesMgt from "../features/favoritesMgt";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showModal: false,
            focusedElement: null,
            favoritesMgt: new FavoritesMgt(),
            favorites: null,
            favoritesVisible: false
        }
    }

    ctrlLoading(loadingState) {
        this.setState({ isLoading: loadingState })
    }

    openDetails( element ) {
        this.setState({
            showModal: true,
            focusedElement: element
        })
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
                    { item: <SearchBar ctrlLoading={(loadingState) => this.ctrlLoading(loadingState)} />, position: "left" },
                    { item: <span>BrockDex</span>, position: "center" },
                    { item: <button>Favs</button>, position: "right" }
                ]} />
                <Loader show={this.state.isLoading} />
                <ListView 
                    paginated={false}
                    size="medium"
                    openDetails={(el) => this.openDetails(el)}
                />
                { this.state.showModal ? <Modal
                    visible={this.state.showModal}
                    closeModal={() => this.closeModal()}
                    changeContent={(element) => this.openDetails(element)}
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