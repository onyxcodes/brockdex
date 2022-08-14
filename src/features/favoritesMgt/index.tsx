
class FavoritesMgt {
    favorites: (number | string)[];
    favoritesKey: string;
    constructor( favorites: (number | string)[] = [], favoritesKey = "favorites") {
        this.favorites = favorites;
        this.favoritesKey = favoritesKey;
    }
    
    getFavorites() {
        let favorites: (number | string)[] = [];
        try {
            let _favorites = localStorage.getItem("favorites");
            if (_favorites) favorites = JSON.parse(_favorites);
        } catch (e) {
            console.log("getFavorites - problem while fetching or parsing favorites", e);
        }
        return favorites;
    }

    updateFavorites( favorites: (number | string)[] ) {
        let favoritesStr: string =  JSON.stringify(favorites)
        localStorage.setItem(this.favoritesKey, favoritesStr);
        this.favorites = favorites;
        return true;
    }

    addToFavorites( id: number | string ) {
        if (id) {
            let favorites = this.getFavorites();
            if ( !favorites.includes(id) ) {
                favorites.push(id);
                this.updateFavorites(favorites);
            } else console.log("addToFavorites - attention, favorite with id `"+id+"` already present", favorites);
            return favorites;
        } else throw new Error("addToFavorites - missing id parameter");
    }

    removeFromFavorites(id: number) {
        if (id) {
            let favorites = this.getFavorites();
            let found = false;
            favorites = favorites.filter( element => {
                if (!found) found = element === id;
                return element !== id;
            });
            if ( found ) {
                this.updateFavorites(favorites);
            } else console.log("removeFromFavorites - attention, favorite with id `"+id+"` was not found", favorites);
            return favorites;
        } else throw new Error("removeFromFavorites - missing id parameter");
    }
}

export default FavoritesMgt;