import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { listPokemon } from "../../features/pokeapi/list";
import { getPokemonList } from "../../features/pokeapi/detailedList";

import Loader from "../../components/Loader";
import PokeCard from "../../components/PokeCard";
import ActionBar from "../../components/ActionBar";

const ListView = ( props ) => {
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

function mapStateToProps({list, detailedList}) {
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({listPokemon, getPokemonList}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(ListView);