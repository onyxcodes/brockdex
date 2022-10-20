import { configureStore } from '@reduxjs/toolkit';
import ui, { UIState } from 'features/ui';
import favorites, { FavoritesState } from 'features/favoritesMgt';

import { notificationsMiddleware, notifications, Notifier } from 'utils/notifications';

import {
	detailedList, DetailedListState, getPokemonList,
	pokemon, PokemonState, getPokemon,
	list, ListState, listPokemon,
} from 'features/pokeapi';

export type AppState = {
  list: ListState;
  detailedList: DetailedListState;
  pokemon: PokemonState;
  favorites: FavoritesState;
  ui: UIState,
  notifications: Notifier.NotificationObject[]
}

const { pendingListener, fulfilledListener, rejectedListener, callbackListener } = notificationsMiddleware(
  [getPokemonList, getPokemon, listPokemon],
  {
    actionDescriptors: {
      [getPokemonList.typePrefix]: 'Loading pokemon information..',
      [listPokemon.typePrefix]: 'Loading pokemon list..',
      [getPokemon.typePrefix]: 'Loading pokemon..'
    }
  }
);

export const store = configureStore({
  reducer: {
    ui,
    notifications,
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
		rejectedListener.middleware,
    callbackListener.middleware
	)
});

export const getNotifications = (state: AppState) => state.notifications;
