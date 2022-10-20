import { isAsyncThunkAction, AnyAction, AsyncThunk, Dispatch } from '@reduxjs/toolkit';
import { store } from 'store';
import { listPokemon, getPokemonList, getPokemon } from 'features/pokeapi';

import logger from 'utils/logger';

/**
 * @description: Given an action, it get tested against a set of possibile action creators
 * If found, return the original creator for that action
 */
const getActionCreator = ( action: AnyAction, creators: AsyncThunk<any, any, {}>[] ) => {
	for ( const creator of creators ) {
		const isCurrentAction = isAsyncThunkAction(creator);
		if ( isCurrentAction(action)) {
			logger.debug({type: creator.typePrefix}, 'getActionCreator - found action');
			return creator;
		}
	}
}

const globalFunctions: {
    [key: string]: (...args: any[]) => (dispatch: Dispatch<any>) => void;
} = {
    // test: (notificationId: string) => {
    //     logger.debug({notificationId}, 'test - called for notification');
    // },
    reattemptAction: (notificationId: string, {action}) => (dispatch) => {
        logger.debug({action}, 'reattemptAction - called for action');
        const actionCreator = getActionCreator(action, [listPokemon, getPokemonList, getPokemon]);
        if ( isAsyncThunkAction(action) && actionCreator ) {
            dispatch(actionCreator(action.meta.arg));
        }
    }
}

export { globalFunctions };