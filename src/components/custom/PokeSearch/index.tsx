import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store';
import { setQuery, UIState } from 'features/ui';

import SearchBar from 'components/commons/SearchBar';

const PokeSearch = () => {
    const dispatch = useDispatch();

    const query = useSelector<AppState, UIState['query']>( s => s.ui.query );

    const setSearchQuery = React.useCallback((query) => {
        dispatch(setQuery(query))
    }, [dispatch]);

    return <SearchBar value={query} onSearch={setSearchQuery} placeholder='Search by name'/>
}

export default PokeSearch;