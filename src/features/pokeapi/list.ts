import axios from 'axios';
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { PokeDataShallow } from '../../views/ListView';
import { resetDetailedList } from './detailedList';

interface ListResponse {
    count: number;
    results: {
        name: string;
        url: string;
    }[];
    next: any;
    previous: any;
}

// TODO: parametrize endpoint
const list = async ( offset: number, limit: number ) => {
    try {
        const { data } = await axios.get<ListResponse>('https://pokeapi.co/api/v2/pokemon', {
            'method': 'GET',
            'headers': {
                'crossorigin':true,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': '*'
            }, 'params': {
                'offset':offset,
                'limit':  limit
            }
        });
        if (data && data?.results?.length) return(data);
        else throw Error(`Unexpected response: ${data}`);
    } catch (e: any) {
        console.log(e);
        throw new Error(e);
    }
}

interface ListPayload {
    results: PokeDataShallow[],
    total: number,
    next: {
        offset: number;
        limit: number
    } | null,
    previous: {
        offset: number;
        limit: number
    } | null,
}

export const resetList = createAction('poke/resetList');

export const listPokemon = createAsyncThunk(
    'poke/list',
    async (args: {
        offset?: number;
        limit?: number;
        query?: string;
    }, thunkAPI) => {
        const { offset = 0, limit = 24, query = ''} = args;

        // Reset the action to the reducer that handles detailed list 
        // and keeps track of its the status
        thunkAPI.dispatch(resetDetailedList());
        
        let payload: ListPayload = {
            total: 0,
            results: [],
            next: null,
            previous: null
        };
        if ( !query || query === '' ) { // not passin a query
            // Check if already in memory
            let res = await list(offset, limit);
            if (res) {
                payload = {
                    total: res.count,
                    results: res.results,
                    next: res.next ? {
                        offset: (offset || 0) + limit,
                        limit: limit
                    } : null,
                    previous: res.previous ? {
                        offset: (offset || 0) - limit,
                        limit: limit
                    } : null
                };
            }
        } else if ( query && query !== '' ) {
            let total = Number(localStorage.getItem('total'));
            // Reset view by resettting list and detailedList
            // thunkAPI.dispatch(resetList());
            let res = await list(0, total);
            if (res) {
                var reg = new RegExp(query, 'i');
                var index_m = 0; // tracks count of matching results
                var newResults = res.results.filter( el => {
                    let matches = reg.test(el.name);
                    if (matches) index_m++;
                    return matches && index_m > offset && index_m <= (offset + limit)
                });
                payload = {
                    total: res.count,
                    results: newResults,
                    next: newResults.length < index_m ? {
                        offset: (offset || 0) + limit,
                        limit: limit
                    } : null,
                    previous: offset ? {
                        offset: (offset || 0) - limit,
                        limit: limit
                    } : null
                };
            }
        }
        return payload;
    }
)

export interface ListState extends ListPayload {
    loading: boolean;
    error: undefined;
    success: boolean;
}

const initialState = {
    results: [],
    total: 0,
    loading: false,
    error: undefined,
    next: null,
    previous: null,
    success: false
} as ListState;

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(resetList, (state, action) => {
            return initialState;
        })
        .addCase(listPokemon.fulfilled, (state, action) => {
            const { offset, limit, query } = action.meta.arg;
            let payload = action.payload;
            state.loading = initialState.loading;
            state.total = payload.total;
            state.results.splice(offset || 0, limit || 0, ...payload.results);
            state.next = payload.next;
            state.previous = payload.previous;
            state.success = true;
        })
        .addCase(listPokemon.pending, (state, action) => {
            state.loading = true;
            state.success = initialState.success;
            state.error = initialState.error;
        })
        .addCase(listPokemon.rejected, (state, action) => {
            state.loading = false;
            state.success = initialState.success;
            debugger;
            // state.error = ;
        })
});

export default reducer;

