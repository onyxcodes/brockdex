import React, { Component } from "react";
import { connect } from "react-redux";
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import { listPokemon } from "../../features/pokeapi/list";
import { getPokemonList } from "../../features/pokeapi/detailedList";

import Loader from "../../components/Loader";
import PokeCard from "../../components/PokeCard";
import ActionBar from "../../components/ActionBar";

interface PokemonShallowList {
    name: string, url: string
}

interface ListViewProps {
    list: PokemonShallowList[];
    loading: boolean;
    previous: { offset: number; limit: number};
    next: { offset: number; limit: number };
    total: number;
    listPokemon: (offset?: number, limit?: number, params?: {
        query?: string, total?: number
    }) => void;
    detailedList: { [key: string]: any };
    loadingList: boolean;
    loadingListSuccess: boolean;
    getPokemonList: (list: PokemonShallowList[]) => void;
    setPokemonList: ( detailtedList: { [key: string]: any }, total: number ) => void;
    // TODO: change to exported inferface, since it's reused
    openDetails: ( el: { [key: string]: any } ) => void;
}

const ListView = ( props: ListViewProps ) => {
    const { 
        list, loading, previous, next, total, listPokemon,
        detailedList, loadingList, loadingListSuccess, getPokemonList,
        setPokemonList, openDetails
    } = props;

    const [ listSet, markListSet ] = React.useState(false);
    const [ query, setQuery ] = React.useState(null);
    const [ offset, setOffset ] = React.useState(0);
    const [ limit, setLimit ] = React.useState(28);

    // Should request pokemon (shallow) list only when
    // offset, limit or query changes 
    React.useEffect( () => {
        listPokemon(offset, limit, { query, total }
    )}, [offset, limit, query]);

    // If result list ( with minimum information ) was loaded
    // attempt to load also detailed list
    React.useEffect( () => {
        if ( list.length && !loadingList && !loadingListSuccess ) {
            getPokemonList(list);
            markListSet(false); // probably this
        }
    }, [list, loadingList, loadingListSuccess]);

    React.useEffect( () => {
        if (loadingListSuccess && detailedList && !listSet) {
            setPokemonList(detailedList, total);
            markListSet(true);
        }
    }, [loadingListSuccess, detailedList, listSet]);

    const fetchNext = () => {
        if (list && next) {
            setOffset(next.offset);
            setLimit(next.limit);
        }
    }

    const fetchPrevious = () => {
        if (list && previous) {
            setOffset(previous.offset);
            setLimit(previous.limit);
        }
    }

    return(
        <div className="listView">
            <Loader show={loading} />
            {list?.map( (i, index) => {
                return <PokeCard key={i.name}
                    openDetails={(data) => openDetails(data)}
                    list={detailedList}
                    next={list?.[index+1]?.name}
                    previous={list?.[index-1]?.name}
                    id={i.name}
                    title={i.name}
                />
            })}

            <ActionBar position="bottom"
                items={[
                    { item: <button onClick={() => fetchPrevious()} disabled={!previous}>Previous</button>, position: "left"},
                    { item: <button onClick={() => fetchNext()} disabled={!next}>Next</button>, position: "right"}
                ]}
            />
        </div>
    )
}

// TODO: Change to redux-hooks
function mapStateToProps({list, detailedList}: { 
    list: { results: [], next: {}, previous: {}, total: number; loading: boolean; error: string | boolean }, 
    detailedList: { results: [], loading: boolean; success: boolean}
}) {
    const props = { 
        list: list?.results || [],
        next: list?.next,
        previous: list?.previous,
        total: list ? list.total : null,
        loading: list ? list.loading : true,
        error: list ? list.error : false,
        detailedList: detailedList?.results || [],
        loadingList: detailedList ? detailedList.loading : false,
        loadingListSuccess: detailedList ? detailedList.success : false,
    };
    return props;
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
    return bindActionCreators({listPokemon, getPokemonList}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(ListView);