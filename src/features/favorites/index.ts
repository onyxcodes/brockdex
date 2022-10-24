import _localStorage from 'utils/localStorage';
import { createReducer, createAction } from '@reduxjs/toolkit';

export const addToFavorites = createAction('favorites/add', 
    (arg: string) => {
        let favorites = _localStorage.add('favorites', arg);
        return {
            payload: favorites
        }
    }
)

export const removeFromFavorites = createAction('favorites/remove', 
    (arg: string) => {
        let favorites = _localStorage.remove('favorites', arg);
        return {
            payload: favorites
        }
    }
)

export type FavoritesState = {
    favorites: (string | number)[]
}
const initialState = {
    favorites: _localStorage.get('favorites') || [],
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