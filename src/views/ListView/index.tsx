import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DetailedListState, getPokemonList, PokeDataDetailed, updateDetailedList } from "../../features/pokeapi/detailedList";

import Loader from "../../components/Loader";
import PokeCard, { PokeCardProps } from "../../components/PokeCard";
import ActionBar from "../../components/ActionBar";
import { CardProps } from "../../components/Card";
import list, { listPokemon, ListState, resetList } from "../../features/pokeapi/list";
import { AppState } from "../../stores";
import { UIState } from "../../features/ui";
import { off } from "process";
export interface PokeDataShallow {
    name: string; url: string
};

const objIsEmpty = ( obj: { [key: string]: any } ) => {
    for (var i in obj) return false;
    return true
}



const useProcessListData = ( 
    list: PokeDataShallow[], 
    detailedList:  { [key: string]: PokeDataDetailed }, 
    onClick: (arg: any) => void ) => 
{

    const [ processedList, setProcessedList ]= React.useState<{ [key: string]: PokeDataDetailed }>({})
    const [ listComponents, setListComponents ] = React.useState<JSX.Element[]>([])

    React.useEffect( () => {
        let _processedList: { [key: string]: PokeDataDetailed } = {};
        setListComponents(list?.map( (i, index) => {

            let _current = detailedList[i.name],
                current = { ..._current };
            if (current && _current) {
                // Attach props
                current.next = list?.[index+1]?.name;
                current.previous = list?.[index-1]?.name;
                _processedList[i.name] = current;
            }
            
            return <PokeCard key={i.name}
                openDetails={onClick}
                list={detailedList}
                next={_current && current.next}
                previous={_current && current.previous}
                id={i.name}
                title={i.name}
            />
        }));
        setProcessedList(_processedList)
    }, [list, detailedList])
    
    return { processed: processedList, elements: listComponents }
}

interface PageProps {
    list: any[];
    listProcessor: (arg: any) => {
        processed: { [key: string]: any };
        elements: JSX.Element[]
    };
    onProcessEnd: (arg: any) => void;
}
const Page = ( props: PageProps ) => {
    const { list, listProcessor, onProcessEnd
    } = props;

    const { processed, elements } = listProcessor(list);

    onProcessEnd(processed);

    return <>
        {elements}
    </>
}

const useInfinitePages = (
    list: any[],
    pageSize: number,
    listProcessor: (arg: any) => {
        processed: { [key: string]: any };
        elements: JSX.Element[]
    },
    onProcessEnd: (arg: any) => void
) => {
    let pageNumber = Math.ceil(list.length / pageSize);
    let pages: JSX.Element[] = [];
    for ( var i = 0; i < pageNumber; i++ ) {
        let listSubset = list.slice( i * pageSize, i * pageSize + pageSize );
        let page = <Page key={i} list={listSubset} 
            listProcessor={listProcessor}
            onProcessEnd={onProcessEnd}
        />
        pages.push(page)
    }
    return pages
}

interface ListViewProps {
    query?: string;
    infiniteScroll?: boolean;
    openDetails: ( el: { [key: string]: any } ) => void;
}
const ListView = ( props: ListViewProps ) => {
    const { 
        openDetails,
        infiniteScroll = false
    } = props;

    const dispatch = useDispatch();

    const [ offset, setOffset ] = React.useState(0);
    const [ limit, setLimit ] = React.useState(28);
    const [ localQuery, setLocalQuery ] = React.useState("");
    const [ isListReqCompleted, setListReqCompleted ] = React.useState(false);
    const [ isListProcessed, setListProcessed ] = React.useState(false);
    const [ contextList, setContextList ] = React.useState<any[]>([])

    const query = useSelector<AppState, UIState["query"]>(s => s.ui.query);

    const listReq = useSelector<AppState, ListState>(s => s.list);
    const list = listReq.results;
    const loading = useSelector<AppState, ListState["loading"]>(s => s.list.loading);

    const next = useSelector<AppState, ListState["next"]>(s => s.list.next);
    const previous = useSelector<AppState, ListState["previous"]>(s => s.list.previous);

    const detailedListReq = useSelector<AppState, DetailedListState>(s => s.detailedList);
    
    // May be redundant
    const doListPokemon = (offset?: number, limit?:number, query?:string) => {
        return dispatch(listPokemon({offset, limit, query}));
    };
    const doGetPokemonList = ( list: PokeDataShallow[] ) => {
        return dispatch(getPokemonList(list));
    }

    React.useEffect( () => {
        if (query || query === "") {
            setLocalQuery(query);
            // Since search query changed reset offest and limit
            setOffset(0); setLimit(28);
            // Also reset the list
            dispatch(resetList())
        }
    },  [query]);

    // Should request pokemon (shallow) list only when
    // offset, limit or query changes 
    React.useEffect( () => {
        doListPokemon(offset, limit, localQuery)
    }, [offset, limit, localQuery]);

    // mark completition of shallow list request
    React.useEffect( () => {
        if (listReq.success && !listReq.loading) {
            setListReqCompleted(true)
        } else setListReqCompleted(false)
    }, [listReq.loading, listReq.success])

    // If result list ( with minimum information ) was loaded
    // attempt to load also detailed list
    React.useEffect( () => {
        let listSubset = list.slice(offset, offset + limit);
        if ( isListReqCompleted && !detailedListReq.loading && !detailedListReq.success ) {
            doGetPokemonList(listSubset);
            setListProcessed(false);
        }
    }, [isListReqCompleted]);

    // contextList is equal to the complete list when infiniteScroll is enabled
    // if not is limited to current page context and dependant to offset and limit values
    React.useEffect( () => {
        if ( !infiniteScroll ) {
            setContextList(list.slice(offset, offset + limit))
        } else setContextList(list)
    }, [offset, limit, list]);

    // TODO: consider using useCallback!
    const fetchNext = () => {
        if (list && next) {
            setOffset(next.offset);
            setLimit(next.limit);
        } // else manage error
    }

    const fetchPrevious = () => {
        debugger;
        if (list && previous) {
            setOffset(previous.offset);
            setLimit(previous.limit);
        } // else manage error
    }

    // Method that will be used as callback when 
    const updateProcessedList = React.useCallback( (processedList) => {
        if ( !objIsEmpty(processedList) && !isListProcessed) {
            dispatch(updateDetailedList(processedList));
            setListProcessed(true);
        };
    }, [isListProcessed]);

    
    return(
        <div className="listView">
            <Loader show={loading} />
            {/* If infinite scroll is enabled make use of custom hook that generates pages,
              * alternatively just show the page relative to current page's context
             */}
            { infiniteScroll ? 
                useInfinitePages(
                    list, 28,
                    (list) => useProcessListData(list, detailedListReq.results, openDetails), 
                    updateProcessedList
                ) :
                <Page list={contextList} 
                    listProcessor={(list) => useProcessListData(list, detailedListReq.results, openDetails)}
                    onProcessEnd={updateProcessedList}
                />
            }
            {/* If infinite scroll is enabled, as of now, show only one button to fetch more data,
            alternatively show page navigation */}
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
