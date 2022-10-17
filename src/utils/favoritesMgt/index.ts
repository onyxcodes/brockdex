import logger from 'utils/logger';

// TODO: Needs a major makeover!
class FavoritesMgt {
    favorites: (number | string)[];
    favoritesKey: string;
    constructor( favorites: (number | string)[] = [], favoritesKey = "favorites") {
        this.favorites = favorites || FavoritesMgt.getFavorites();
        this.favoritesKey = favoritesKey;
    }
    
    static getFavorites() {
        let favorites: (number | string)[] = [];
        try {
            let _favorites = localStorage.getItem("favorites");
            if (_favorites) favorites = JSON.parse(_favorites);
        } catch (e: any) {
            logger.debug({error: e},'getFavorites - problem while fetching or parsing favorites');
            throw new Error(e);
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
        let favorites = this.favorites
        if ( !favorites.includes(id) ) {
            favorites.push(id);
            this.updateFavorites(favorites);
        } else logger.debug({favorites}, `addToFavorites - attention, favorite with id '${id}' already present`);
        return favorites;
    }

    removeFromFavorites(id: number | string) {
        let favorites = this.favorites
        let found = false;
        favorites = favorites.filter( element => {
            if (!found) found = element === id;
            return element !== id;
        });
        if ( found ) {
            this.updateFavorites(favorites);
        } else logger.debug({favorites}, `removeFromFavorites - attention, favorite with id '${id}' was not found`);
        return favorites;
    }
}

export default FavoritesMgt;