import { createListenerMiddleware, isRejected, isPending, isFulfilled, nanoid } from '@reduxjs/toolkit';
import { listPokemon, getPokemon, getPokemonList } from 'features/pokeapi';

import { notify, Notification, clearNotification } from 'features/ui';

const isPokeRejectedAction = isRejected( listPokemon, getPokemon, getPokemonList );

const rejectedListener = createListenerMiddleware();

rejectedListener.startListening({
	matcher: isPokeRejectedAction,
	effect: async (action, listenerApi) => {
		const dispatch = listenerApi.dispatch;
		const actionType = action.type.replace('/rejected','');

        // Clears corresponding pending notification
        dispatch(clearNotification(action.meta.requestId));

		// Prepare and dispatch error notification
		let errNotification: Notification = {
			id: nanoid(),
			level: 'error',
			message: `Something went wrong while processing your request - (${actionType})`,
			clearable: true,
			timestamp: new Date().getTime(),
			actions: [{
				label: 'Try again',
				globalFnName: 'reattemptAction',
				payload: {
					action
				}
			}]
		}
		dispatch(notify(errNotification));

		// TODO: log error with pino's logger
	}
});

const isPokePendingAction = isPending( listPokemon, getPokemon, getPokemonList );

const pendingListener = createListenerMiddleware();

const actionMessage: {
	[key: string]: string;
} = {
	'poke/detailedList': 'Loading pokemon information..',
	'poke/list': 'Loading pokemon list..',
	'poke/getPokemon': 'Loading pokemon..'
}

pendingListener.startListening({
	matcher: isPokePendingAction,
	effect: async (action, listenerApi) => {
		const dispatch = listenerApi.dispatch;
		const actionType = action.type.replace('/pending','');
		
		// Prepare and dispatch loading notification
		let loadingNotification: Notification = {
			id: action.meta.requestId,
			level: 'pending',
			message: actionMessage[actionType] || 'Loading..',
			clearable: false,
			timestamp: new Date().getTime(),
		}
		dispatch(notify(loadingNotification));
		// TODO: log error with pino's logger
	}
});

const isPokefulfilledAction = isFulfilled( listPokemon, getPokemon, getPokemonList );

const fulfilledListener = createListenerMiddleware();

fulfilledListener.startListening({
	matcher: isPokefulfilledAction,
	effect: async (action, listenerApi) => {
		const dispatch = listenerApi.dispatch;
		
        // Clears corresponding pending notification
		dispatch(clearNotification(action.meta.requestId));
	}
});

export { pendingListener, rejectedListener, fulfilledListener };