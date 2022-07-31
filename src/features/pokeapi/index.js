import list from './list';

export const listPokemon = (count, limit) => dispatch => {
    // THis following variables will be set from configs
    list(count, limit).then( res => {
        if (res) {
            console.log("Preparing to dispatch res", res)
            dispatch({
                type: "LIST",
                // payload: {
                //     count: res.count,
                //     content: res
                // }
                payload: res
            })
        }
    })
}

const initialState = {value: 'Washington Post'};
// const initialState = {value: 'Washington Post'};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case "LIST": {
        return action.payload || null;
    }
    default:
      return state;
  }
}