import FavoritesMgt from 'utils/favoritesMgt';
import { createReducer, createAction } from '@reduxjs/toolkit';

// TODO: Modify favorites mgt add/remove methos to just return the added element
// therefore change the following action creatore to supply as payload the added/removed element
// and change the reducer accordingly

export const addToFavorites = createAction('favorites/add', 
    (arg: string) => {
        const favoritesMgt = new FavoritesMgt(
            FavoritesMgt.getFavorites()
        );
        let favorites = favoritesMgt.addToFavorites(arg);
        return {
            payload: favorites
        }
    }
)

export const removeFromFavorites = createAction('favorites/remove', 
    (arg: string) => {
        const favoritesMgt = new FavoritesMgt(
            FavoritesMgt.getFavorites()
        );
        let favorites = favoritesMgt.removeFromFavorites(arg);
        return {
            payload: favorites
        }
    }
)

export type FavoritesState = {
    favorites: (string | number)[]
}
const initialState = {
    favorites: FavoritesMgt.getFavorites(),
} as FavoritesState;

const reducer = createReducer(initialState, builder => {
    builder
        .addCase(addToFavorites, (state, action) => {
            state.favorites = [...action.payload]
        })
        .addCase(removeFromFavorites, (state, action) => {
            state.favorites = [...action.payload]
        })
})

export default reducer;