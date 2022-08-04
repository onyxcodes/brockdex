import list from './features/pokeapi/list';
import pokemon from './features/pokeapi/pokemon';
import detailedList from "./features/pokeapi/detailedList"
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    list: list,
    pokemon: pokemon,
    detailedList, detailedList
  },
});