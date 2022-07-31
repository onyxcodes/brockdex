import React, { Component } from "react";

import ActionBar from "../components/ActionBar";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import ListView from "../views/ListView";
import Modal from "../views/Modal";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showModal: false,
            focusedElement: null
        }
    }

    ctrlLoading(loadingState) {
        this.setState({ isLoading: loadingState })
    }

    openDetails( element ) {
        console.log("REached app trigger modal", element)
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
        if (elementId) {
            var storedFavorites;
            try {
                storedFavorites = JSON.parse(localStorage.getItem("favorites"));
            } catch (e) {
                storedFavorites = null;
            }
            if (!storedFavorites) {
                var favorites = JSON.stringify([elementId]);
                localStorage.setItem("favorites", favorites);
                console.log("Set fot the first time favorites", JSON.parse(localStorage.getItem("favorites")));
            } else {
                // check if element is already in favorites
                // altough btn that calls this function should already be disabled
                var favorites = [...storedFavorites];
                if ( !favorites.includes(elementId) ) {
                    favorites.push(elementId);
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    console.log("Favorites updated",  JSON.parse(localStorage.getItem("favorites")));
                } else {
                    console.log("Favorites unchanged", JSON.parse(localStorage.getItem("favorites")));
                }
                
            }
        } else console.log("missing element id")
    }

    render() {
        return (
            <div id="app">
                <ActionBar position="top" items={[
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
                <Modal
                    visible={this.state.showModal}
                    closeModal={() => this.closeModal()}
                    addToFavorites={(elId) => this.addToFavorites(elId)}
                    content={this.state.focusedElement}
                    size="medium"
                />
            </div>
        )
    }
}

export default App;