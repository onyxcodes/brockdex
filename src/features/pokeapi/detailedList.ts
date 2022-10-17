import { createAction, createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { AppState } from "store";
import { pokemon } from "./pokemon";

export interface PokeDataDetailed {
    [key: string]: any;
    name: string
}

export const resetDetailListStatus = createAction('poke/resetDetailListStatus');
export const updateDetailedList = createAction<{ [key: string]: PokeDataDetailed }>('poke/updateDetailedList');

// TODO3: change list type to PokeShallow []
export const getPokemonList = createAsyncThunk<
    {
        results: {[key: string]: PokeDataDetailed}
    },
    any[],
    {
        /** return type for `thunkApi.getState` */
        state: AppState
    }
>(
    'poke/detailedList',
    async ( list, {getState}) => {
        let pokemonList: { [key: string]: any } = {},
        loadedCount = 0,
        payload: {
            results: { [key: string]: PokeDataDetailed }
        } = {
            results: {},
        };
        
        let currentResults = getState().detailedList.results
        for ( var i = 0; i < list.length; i++) {
            let el = list[i];
            if ( !currentResults.hasOwnProperty(el.name) ) {
                let result = await pokemon(el.name);
                let k: string = result.name;
                pokemonList[k] = result;
            }
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
    results: {
        [key: string]: PokeDataDetailed
    },
    loading: boolean,
    success: boolean, // TODO2: check if still needed
    error: undefined
}

const initialState = {
    results: {},
    loading: false,
    success: false, // TODO2: check if still needed
    error: undefined
} as DetailedListState;

const reducer = createReducer( initialState, builder => {
    builder
        .addCase(resetDetailListStatus, (state, action) => {
            state.loading = initialState.loading;
            state.success = initialState.success;
        })
        .addCase(updateDetailedList, (state, action) => {
            let payload = action.payload;
            state.results = Object.assign(state.results, payload)
        })
        .addCase(getPokemonList.fulfilled, (state, action) => {
            let payload = action.payload;
            state.loading = false;
            state.success = true;
            state.results = Object.assign(state.results, payload.results);
        })
        .addCase(getPokemonList.pending, (state, action) => {
            state.loading = true;
            state.results = state.results;
            state.success = false;
        })
});

export default reducer;