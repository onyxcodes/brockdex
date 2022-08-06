import axios from "axios";

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

export const listPokemon = (offset = 0, limit = 24, searchParams = {query: null, total: null}) => dispatch => {
    // The first dispatch is to mark that we are going to request the list of pokemon names
    // on its response, we are going to mark the call as completed
    dispatch({
        type: "LIST",
        payload: {
            loading: true
        }
    });
    // This second dispatch is to reset the action to the store that contains the detailed list and keeps track of its the status
    dispatch({
        type: "POKEMON_LIST",
        payload: {
            loading: false,
            success: false,
            results: null
        }
    })
    if ( !searchParams.query ) { // npt passin a query
        list(offset, limit).then( res => {
            if (res) {
                dispatch({
                    type: "LIST",
                    payload: {
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
                    }
                });
            }
        })
    } else if ( searchParams.total ) {
        list(0, searchParams.total).then( res => {
            if (res) {
                var reg = new RegExp(searchParams.query, "i");
                var index_m = 0; // tracks count of matching results
                var newResults = res.results.filter( el => {
                    let matches = reg.test(el.name);
                    if (matches) index_m++;
                    return matches && index_m > offset && index_m <= (offset + limit)
                });

                dispatch({
                    type: "LIST",
                    payload: {
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
                    }
                });

            }
        });
    }
}

export default function reducer(state = null, action) {
  switch(action.type) {
    case "LIST": {
        return action.payload || null;
    }
    default:
      return state;
  }
}