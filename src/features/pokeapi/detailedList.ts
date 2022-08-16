import { pokemon } from "./pokemon";
import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";

// export const detailedList = (list) => dispatch => {
//     dispatch({
//         type: "POKEMON_LIST",
//         payload: {
//             loading: true,
//             success: false,
//             results: []
//         }
//     });
//     var pokemonList = {},
//         loadedCount = 0;
//     // if ( list && list)
//     for ( var i = 0; i < list.length; i++) {
//         var el = list[i];
//         pokemon(null, el.name).then( result => {
//             var k = result.name;
//             pokemonList[k] = result;
//             loadedCount++;
//             if ( list.length === loadedCount ) {
//                 dispatch({
//                     type: "POKEMON_LIST",
//                     payload: {
//                         results: pokemonList,
//                         success: true,
//                         loading: false,
//                         error: result.error,
//                     }
//                 })
//             }
//         });
//     }
// }

export const getPokemonList = createAsyncThunk(
    'poke/detailedList',
    async ( list: any, thunkApi ) => {
        let pokemonList: { [key: string]: any } = {},
        loadedCount = 0,
        payload: {
            results: { [key: string]: any }
        } = {
            results: {},
        };
        // if ( list && list)
        for ( var i = 0; i < list.length; i++) {
            let el = list[i];
            let result = await pokemon(null, el.name);
            // TODO1: improve error catching 
            // and allow async thunk to mgt through its lifecycle
            let k: string = result.name;
            pokemonList[k] = result;
            loadedCount++;
            if ( list.length === loadedCount ) {
                payload = {
                    results: pokemonList,
                }
            }
        }
        return payload;
    }
)

export interface DetailedListState {
    results: {},
    loading: boolean,
    success: boolean, // TODO2: check if still needed
    error: undefined
}

const initialState = {
    results: {},
    loading: false,
    success: false, // TODO2: check if still needed
    error: undefined
}

const reducer = createReducer( initialState, builder => {
    builder
        .addCase(getPokemonList.fulfilled, (state, action) => {
            let payload = action.payload;
            state.loading = false;
            state.success = true;
            state.results = payload.results;
        })
        .addCase(getPokemonList.pending, (state, action) => {
            state.loading = true;
            state.success = false;
            state.results = initialState.results;
        })
})

// export default function reducer(state = null, action) {
//     switch (action.type) {
//         case "POKEMON_LIST": {
//             return action.payload || null
//         }
//         default:
//             return state;
//     }
// }

export default reducer;