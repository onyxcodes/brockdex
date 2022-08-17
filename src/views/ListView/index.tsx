import React from "react";
import { useDispatch } from "react-redux";
import { PokeDataDetailed, updateDetailedList } from "../../features/pokeapi/detailedList";

import Loader from "../../components/Loader";
import PokeCard from "../../components/PokeCard";
import ActionBar from "../../components/ActionBar";

export interface PokeDataShallow {
    name: string; url: string
};

const objIsEmpty = ( obj: { [key: string]: any } ) => {
    for (var i in obj) return false;
    return true
}

interface ListViewProps {
    list: PokeDataShallow[];
    loading: boolean;
    previous?: { offset?: number; limit?: number};
    next?: { offset?: number; limit?: number };
    listPokemon: (offset?: number, limit?: number, query?: string) => void;
    query?: string;
    detailedList: { [key: string]: PokeDataDetailed };
    loadingList: boolean;
    loadingListSuccess: boolean;
    getPokemonList: (list: PokeDataShallow[]) => void;
    // TODO: change to exported inferface, since it's reused
    openDetails: ( el: { [key: string]: any } ) => void;
}

const processListData = ( 
    list: PokeDataShallow[], 
    detailedList:  { [key: string]: PokeDataDetailed }, 
    onClick: (arg: any) => void ) => 
{
    let processedList: { [key: string]: PokeDataDetailed } = {};
    let listComponents = list?.map( (i, index) => {

        let _current = detailedList[i.name],
            current = { ..._current };
        if (current && _current) {
            // Attach props
            current.next = list?.[index+1]?.name;
            current.previous = list?.[index-1]?.name;
            processedList[i.name] = current;
        }
        
        return <PokeCard key={i.name}
            openDetails={onClick}
            list={detailedList}
            next={_current && current.next}
            previous={_current && current.previous}
            id={i.name}
            title={i.name}
        />
    });
    return { processedList, listComponents }
}

const ListView = ( props: ListViewProps ) => {
    const { 
        list, loading, previous, next, query, listPokemon,
        detailedList, loadingList, loadingListSuccess, getPokemonList,
        openDetails
    } = props;

    const dispatch = useDispatch();

    // const [ listSet, markListSet ] = React.useState(false);
    const [ offset, setOffset ] = React.useState(0);
    const [ limit, setLimit ] = React.useState(28);
    const [ localQuery, setLocalQuery ] = React.useState("");
    const [ listIsProcessed, setListProcessed ] = React.useState(false);

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
        listPokemon(offset, limit, localQuery)
    }, [offset, limit, localQuery]);

    // If result list ( with minimum information ) was loaded
    // attempt to load also detailed list
    React.useEffect( () => {
        if ( list.length && !loadingList && !loadingListSuccess ) {
            getPokemonList(list);
            setListProcessed(false);
            // markListSet(false); // probably this
        }
    }, [list, loadingList, loadingListSuccess]);

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

    const { processedList, listComponents } = React.useMemo( () =>
        processListData(list, detailedList, openDetails), [list, detailedList]
    );

    React.useEffect( () => {
        if ( !objIsEmpty(processedList) && !listIsProcessed) {
            dispatch(updateDetailedList(processedList));
            setListProcessed(true);
        };
    }, [processedList])
    
    return(
        <div className="listView">
            <Loader show={loading} />
            {listComponents}
            <ActionBar position="bottom"
                items={[
                    { item: <button onClick={() => fetchPrevious()} disabled={!previous}>Previous</button>, position: "left"},
                    { item: <button onClick={() => fetchNext()} disabled={!next}>Next</button>, position: "right"}
                ]}
            />
        </div>
    )
}

export default ListView;
