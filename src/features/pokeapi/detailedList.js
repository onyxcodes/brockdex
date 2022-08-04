import { pokemon } from "./pokemon";

export const getPokemonList = (list) => dispatch => {
    dispatch({
        type: "POKEMON_LIST",
        payload: {
            loading: list.length ? true : false,
            success: list.length ? false : true,
            results: []
        }
    });
    var pokemonList = {},
        loadedCount = 0;
    for ( var i = 0; i < list.length; i++) {
        var el = list[i];
        pokemon(null, el.name).then( result => {
            var k = result.name;
            pokemonList[k] = result;
            loadedCount++;
            if ( list.length === loadedCount ) {
                dispatch({
                    type: "POKEMON_LIST",
                    payload: {
                        results: pokemonList,
                        success: true,
                        loading: false,
                        error: result.error,
                    }
                })
            }
        });
    }
}

export default function reducer(state = null, action) {
    switch (action.type) {
        case "POKEMON_LIST": {
            return action.payload || null
        }
        default:
            return state;
    }
}