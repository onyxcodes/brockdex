import axios from "axios";
import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";

const list = ( offset, limit ) => {
    return new Promise ( (resolve, reject) => {
        axios({
            "method": "GET",
            "url": "https://pokeapi.co/api/v2/pokemon",
            "headers": {
                "crossorigin":true,
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "*"
            }, "params": {
                "offset":offset,
                "limit":  limit
            }
        })
        .then(({data}) => {
            if (data && data?.results?.length) resolve(data)
        })
        .catch((error) => {
            console.log(error);
            let data = {
                error: error
            }
            resolve(data)
        })
    });
}

// First, create the thunk
const listPokemon = createAsyncThunk(
    'poke/list',
    async (args = {offset: 0, limit: 24, query: ""}, thunkAPI) => {
        const { offset, limit, query } = args;
        // The first dispatch use to be to mark the request as started, 
        // it may be omitted because of createAsyncThunk mgt of promises

        // This second dispatch is to reset the action to the reducer that handles detailed list 
        // and keeps track of its the status
        thunkAPI.dispatch({
            type: "POKEMON_LIST",
            payload: {
                loading: false,
                success: false,
                results: null
            }
        });
        if ( !query || query === "" ) { // not passin a query
            let res = await list(offset, limit);
            if (res) {
                let payload = {
                    loading: false,
                    total: res.count,
                    results: res.results,
                    error: res.error,
                    next: res.next ? {
                        offset: (offset || 0) + limit,
                        limit: limit
                    } : null,
                    previous: res.previous ? {
                        offset: (offset || 0) - limit,
                        limit: limit
                    } : null
                };
                return payload;
            }
        } else if ( query && query !== "" ) {
            let total = Number(localStorage.getItem("total"));
            let res = await list(0, total);
            if (res) {
                var reg = new RegExp(query, "i");
                var index_m = 0; // tracks count of matching results
                var newResults = res.results.filter( el => {
                    let matches = reg.test(el.name);
                    if (matches) index_m++;
                    return matches && index_m > offset && index_m <= (offset + limit)
                });
                let payload = {
                    loading: false,
                    total: res.count,
                    results: newResults,
                    error: res.error,
                    next: newResults.length < index_m ? {
                        offset: (offset || 0) + limit,
                        limit: limit
                    } : null,
                    previous: offset ? {
                        offset: (offset || 0) - limit,
                        limit: limit
                    } : null
                };
                return payload;
            }
        }
    }
)
  
export const doListPokemon = (offset = 0, limit = 24, query = "") => dispatch => {
    return dispatch(listPokemon({offset, limit, query}));
}

const initialState = {
    results: [],
    total: 0,
    loading: true,
    error: undefined,
    next: null,
    previous: null
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(listPokemon.fulfilled, (state, action) => {
            // uses immer internally so it doesn't need to return state
            let payload = action.payload;
            state.loading = false;
            state.results =  payload.results;
            state.next = payload.next;
            state.previous = payload.previous;
        })
        .addCase(listPokemon.pending, (state, action) => {
            return initialState;
            // action is inferred correctly here if using TS
        })
        // .addDefaultCase((state, action) => {
        //     debugger;
        // })
});

export default reducer;

