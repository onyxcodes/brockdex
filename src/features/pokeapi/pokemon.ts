import axios from "axios";
import { createAsyncThunk, createReducer, createAction } from "@reduxjs/toolkit";
import { PokeDataDetailed } from "./detailedList";

export const pokemon = async (name: string) => {
    try {
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/'+ name,{
            'method': 'GET',
            "headers": {
                "crossorigin": true,
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "*"
            }
        });
        if (data?.id) return data;
        else throw Error(`Unexpected response: ${data}`);
    } catch (e) {
        console.log(e)
    }      
}

export const getPokemon = createAsyncThunk(
    'poke/getPokemon',
    async ( name: string, thunkApi ) => {
        let payload: PokeDataDetailed = {
            name
        };
        let res = await pokemon(name);
        if (res) payload = res;
        return res;
    }
);

// TODO: Understand if it can be omitted
export const resetPokemon = createAction('poke/resetPokemon');

export const setFocusedPokemon = createAction('poke/setFocus',
    (data: PokeDataDetailed ) => {
        const payload = data;
        return { payload } 
    }
)

export interface PokemonState {
    loading: boolean;
    data: PokeDataDetailed | null
}
const initialState = {
    loading: false,
    data: null,
} as PokemonState;

const reducer = createReducer( initialState, builder => {
    builder
        .addCase(setFocusedPokemon, (state, action) => {
            state.data = action.payload;
        })
        .addCase(getPokemon.fulfilled, (state, action) => {
            let payload = action.payload;
            state.data = payload;
            state.loading = false;
        })
        .addCase(getPokemon.pending, (state, action) => {
            state.loading = false;
            state.data = initialState.data;
        })
        .addCase(resetPokemon, (state, action) => {
            state.data = initialState.data;
        })
        // .addDefaultCase((state, action) => {
        //     debugger;
        // })
});

export default reducer;