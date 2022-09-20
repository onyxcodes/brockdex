import setQuery from './query'
import { createReducer } from '@reduxjs/toolkit'

export interface UIState {
    query:string | null;
}

const initalState = {
    query: null,
} as UIState;

const reducer = createReducer(initalState, builder => { builder
    .addCase(setQuery, (state, action) =>{
        state.query = action.payload;
    })
})

export default reducer;
export { setQuery }