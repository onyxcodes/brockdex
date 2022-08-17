import { pokemon } from "./pokemon";
import { createAction, createAsyncThunk, createReducer } from "@reduxjs/toolkit";

export interface PokeDataDetailed {
    [key: string]: any;
    name: string
}

export const resetDetailedList = createAction('poke/resetDetailedList');
export const updateDetailedList = createAction<{ [key: string]: PokeDataDetailed }>('poke/updateDetailedList');

// TODO3: change list type to PokeShallow []
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
        for ( var i = 0; i < list.length; i++) {
            let el = list[i];
            let result = await pokemon(el.name);
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
        .addCase(resetDetailedList, (state, action) => {
            return initialState;
        })
        .addCase(updateDetailedList, (state, action) => {
            let payload = action.payload;
            state.results = payload;
        })
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
});

export default reducer;