import list, { listPokemon }from '../features/pokeapi/list';
import pokemon, { getPokemon } from '../features/pokeapi/pokemon';
import detailedList, { getPokemonList } from "../features/pokeapi/detailedList"
import { configureStore, createListenerMiddleware, isRejected } from '@reduxjs/toolkit';

// Create the middleware instance and methods
const failListenerMW = createListenerMiddleware();

const isARequestAction = isRejected( listPokemon, getPokemon, getPokemonList );

failListenerMW.startListening({
  // actionCreator: AnyAction,
  matcher: isARequestAction,
  effect: async (action, listenerApi) => {
    console.log("Request was rejected, logging", action);
  }
});


export const store = configureStore({
  reducer: {
    list,
    pokemon,
    detailedList
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
    .prepend(failListenerMW.middleware)
});
