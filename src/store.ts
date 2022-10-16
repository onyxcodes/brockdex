import list, { listPokemon, ListState }from 'features/pokeapi/list';
import pokemon, { getPokemon, PokemonState } from 'features/pokeapi/pokemon';
import detailedList, { getPokemonList, DetailedListState } from "features/pokeapi/detailedList"
import { configureStore, createListenerMiddleware, isRejected } from '@reduxjs/toolkit';
import ui, { UIState } from 'features/ui';
import favorites, { FavoritesState } from 'features/favoritesMgt';

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

export type AppState = {
  list: ListState;
  detailedList: DetailedListState;
  pokemon: PokemonState;
  favorites: FavoritesState;
  ui: UIState
}


export const store = configureStore({
  reducer: {
    ui,
    list,
    pokemon,
    detailedList,
    favorites
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
    .prepend(failListenerMW.middleware)
});
