import React from "react";
import { connect } from "react-redux";
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import { getPokemonList } from "../../features/pokeapi/detailedList";

import Loader from "../../components/Loader";
import PokeCard from "../../components/PokeCard";
import ActionBar from "../../components/ActionBar";

export interface PokeDataShallow {
    name: string; url: string
};

interface ListViewProps {
    list: PokeDataShallow[];
    loading: boolean;
    previous?: { offset?: number; limit?: number};
    next?: { offset?: number; limit?: number };
    total?: number;
    listPokemon: (offset?: number, limit?: number, query?: string) => void;
    query?: string;
    detailedList: { [key: string]: any };
    loadingList: boolean;
    loadingListSuccess: boolean;
    getPokemonList: (list: PokeDataShallow[]) => void;
    setPokemonList: ( detailtedList: { [key: string]: any }, total: number ) => void;
    // TODO: change to exported inferface, since it's reused
    openDetails: ( el: { [key: string]: any } ) => void;
}

const ListView = ( props: ListViewProps ) => {
    const { 
        list, loading, previous, next, total = 0, query, listPokemon,
        detailedList, loadingList, loadingListSuccess, getPokemonList,
        setPokemonList, openDetails
    } = props;

    const [ listSet, markListSet ] = React.useState(false);
    const [ offset, setOffset ] = React.useState(0);
    const [ limit, setLimit ] = React.useState(28);
    const [ localQuery, setLocalQuery ] = React.useState("");

    React.useEffect( () => {
        if (query || query === "") {
            setLocalQuery(query);
            // Since search query changed reset offest and limit
            setOffset(0); setLimit(28);
        }
    },  [query]);

    // Should request pokemon (shallow) list only when
    // offset, limit or query changes 
    React.useEffect( () => {
        listPokemon(offset, limit, localQuery
    )}, [offset, limit, localQuery]);

    // If result list ( with minimum information ) was loaded
    // attempt to load also detailed list
    React.useEffect( () => {
        debugger;
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
    }, [loadingListSuccess, detailedList.length, listSet]);

    // TODO: consider using useCallback!
    const fetchNext = () => {
        if (list && next) {
            next.offset && setOffset(next.offset);
            next.limit && setLimit(next.limit);
        }
    }

    const fetchPrevious = () => {
        if (list && previous) {
            previous.offset && setOffset(previous.offset);
            previous.limit && setLimit(previous.limit);
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

// TODO: Finish changing to redux-hooks (missing detailList reducer)
// function mapStateToProps({detailedList}: {
//     detailedList: { results: [], loading: boolean; success: boolean}
// }) {
//     const props = { 
//         detailedList: detailedList?.results || [],
//         loadingList: detailedList ? detailedList.loading : false,
//         loadingListSuccess: detailedList ? detailedList.success : false,
//     };
//     return props;
// }

// function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
//     return bindActionCreators({getPokemonList}, dispatch);
// }
  
// export default connect(mapStateToProps, mapDispatchToProps)(ListView);
export default ListView;
