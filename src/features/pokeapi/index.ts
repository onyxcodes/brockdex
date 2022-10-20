
import detailedList, { DetailedListState, getPokemonList } from 'features/pokeapi/detailedList';
import pokemon, { PokemonState, getPokemon } from 'features/pokeapi/pokemon';
import list, { ListState, listPokemon } from 'features/pokeapi/list';

// action creators
export { listPokemon, getPokemonList, getPokemon, list };

// reducers
export { detailedList, pokemon };

// types
export type { DetailedListState, PokemonState, ListState };