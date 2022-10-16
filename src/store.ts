import { configureStore } from '@reduxjs/toolkit';
import ui, { UIState } from 'features/ui';
import favorites, { FavoritesState } from 'features/favoritesMgt';

import {
	detailedList, DetailedListState,
	pokemon, PokemonState,
	list, ListState,
	pendingListener, fulfilledListener, rejectedListener
} from 'features/pokeapi';

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
    .prepend(
		pendingListener.middleware,
		fulfilledListener.middleware,
		rejectedListener.middleware
	)
});
