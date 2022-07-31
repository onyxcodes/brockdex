import React, { Component } from "react";

import ActionBar from "../components/ActionBar";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import ListView from "../views/ListView";
import Modal from "../views/Modal";

const exampleData = {
    entries: [
        {
            id: 1,
            name: "Bulbasaur",
            color: "#999999",
            image: "src/assets/images/bb_green.png"
        },
        {
            id: 2,
            name: "Empoleon",
            color: "#999999",
            image: "../assets/images/empoleon_blue.png"
        },
        {
            id: 3,
            name: "Geodude",
            color: "#999999",
            image: "../assets/images/geodude_gray.png"
        },
        {
            id: 4,
            name: "Mr. mime",
            color: "#999999",
            image: "../assets/images/mr_mime_rose.png"
        },
        {
            id: 5,
            name: "Torchic",
            color: "#999999",
            image: "../assets/images/torchic_orange.png"
        },
        {
            id: 6,
            name: "Togepi",
            color: "#999999",
            image: "../assets/images/togepi_yellow.png"
        },
        {
            id: 7,
            name: "Magneton",
            color: "#999999",
            image: "../assets/images/magneton_gray.png"
        },

    ]
}

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
                    data={exampleData} 
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