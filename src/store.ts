import { configureStore, Dispatch } from '@reduxjs/toolkit';
import ui, { UIState } from 'features/ui';
import favorites, { FavoritesState } from 'features/favorites';
import _localStorage from 'utils/localStorage';
import { notificationsMiddleware, notifications, Notifier, removeNotification } from 'utils/notifications';

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

const storeDataUsageConsent = (
  notificationId: string, 
  payload: {
    [key: string]: any;
  }
) => (dispatch: Dispatch) => {
  const { result } = payload;
  _localStorage.set('dataUsageConsent', result);
  // dispatch(removeNotification(notificationId));
}

const { pendingListener, fulfilledListener, rejectedListener, callbackListener } = notificationsMiddleware(
  [getPokemonList, getPokemon, listPokemon],
  {
    actionDescriptors: {
      pending: {
        [getPokemonList.typePrefix]: 'Loading pokemon information..',
        [listPokemon.typePrefix]: 'Loading pokemon list..',
        [getPokemon.typePrefix]: 'Loading pokemon..'
      },
      rejected: {
        [getPokemonList.typePrefix]: 'There was a problem while loading pokemon information..',
        [listPokemon.typePrefix]: 'There was a problem while loading pokemon list..',
        [getPokemon.typePrefix]: 'There was a problem while loading pokemon..'
      }
    },
    callbacks: {
      storeDataUsageConsent: storeDataUsageConsent
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
