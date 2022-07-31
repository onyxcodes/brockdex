import pokeapi from './features/pokeapi';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    pokeapi: pokeapi,
    // // feeds: feedsearch,
    // feeds: search,
    // auth: firebaseauth
  },
});