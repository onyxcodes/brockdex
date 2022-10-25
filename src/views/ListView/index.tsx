import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DetailedListState, getPokemonList, PokeDataDetailed, updateDetailedList } from "features/pokeapi/detailedList";
import _localStorage from "utils/localStorage";
import PokeCard from "components/custom/PokeCard";
import list, { listPokemon, ListState, resetList } from "features/pokeapi/list";
import { AppState } from "store";
import { UIState } from "features/ui";
import { Select, Button, List } from 'alenite-design';
import { SelectOption } from 'alenite-design/lib/components/Form/Select';

// import Button from 'components/commons/Button';
export interface PokeDataShallow {
    name: string; url: string
};

const objIsEmpty = ( obj: { [key: string]: any } ) => {
    for (var i in obj) return false;
    return true
}

interface ListViewProps {
    //
}
const ListView = ( props: ListViewProps ) => {
    const { 
        //
    } = props;

    const dispatch = useDispatch();

    const [ offset, setOffset ] = React.useState(0);
    const [ limit, setLimit ] = React.useState(28);
    const [ localQuery, setLocalQuery ] = React.useState("");
    const [ isListReqCompleted, setListReqCompleted ] = React.useState(false);
    const [ isListProcessed, setListProcessed ] = React.useState(false);
    const [ contextList, setContextList ] = React.useState<any[]>([]);
    const [ pageNumber, setPageNumber ] = React.useState(1);
    const [ view, setView ] = React.useState<'page' | 'scroll'>('page');

    const query = useSelector<AppState, UIState["query"]>(s => s.ui.query);

    const listReq = useSelector<AppState, ListState>(s => s.list);
    const list = listReq.results;

    // TODO: Move this somewhere more appropriate, like list
    // Updates total count stored in localStorage with given total, if differs
    const updateTotal = (total: number) => {
        let storedTotal = _localStorage.get('total');
        if (
            total && !storedTotal &&
            storedTotal !== total
        ) {
            localStorage.setItem("total", total.toString());
        }
    }

    const responseTotal = useSelector<AppState, ListState["total"]>(s => s.list.total);

    // Updates with total number of pokemon, only once when list first loads
    React.useEffect(() => updateTotal(responseTotal), [responseTotal]);

    const next = useSelector<AppState, ListState["next"]>(s => s.list.next);
    const previous = useSelector<AppState, ListState["previous"]>(s => s.list.previous);

    const detailedListReq = useSelector<AppState, DetailedListState>(s => s.detailedList);

    const useProcessListData = ( 
        list: PokeDataShallow[], 
        detailedList:  { [key: string]: PokeDataDetailed }, 
    ) => {
    
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
            // Since search query or view mode changed reset offest and limit
            setOffset(0); setLimit(28);
            // Also reset the list
            dispatch(resetList())
        }
    },  [query]);

    // Should request pokemon (shallow) list only when
    // offset, limit or query changes 
    React.useEffect( () => {
        doListPokemon(offset, limit, localQuery)
        // Also update page number, given offset and limit values
        let _pageNumber = Math.ceil((offset + limit) / limit);
        setPageNumber(_pageNumber);
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
        if ( view === 'page' ) {
            setContextList(list.slice(offset, offset + limit))
        } else setContextList(list)
    }, [offset, limit, list, view]);

    const fetchNext = React.useCallback(() => {
        if (list && next) {
            setOffset(next.offset);
            setLimit(next.limit);
        }
    }, [list, next]);

    const fetchPrevious = React.useCallback(() => {
        if (list && previous) {
            setOffset(previous.offset);
            setLimit(previous.limit);
        }
    }, [list, previous]);

    // Method that will be used as callback when 
    const updateProcessedList = React.useCallback( (processedList) => {
        if ( !objIsEmpty(processedList) && !isListProcessed) {
            dispatch(updateDetailedList(processedList));
            setListProcessed(true);
        };
    }, [isListProcessed]);

    const doProcessListData = React.useCallback( (_list: any) => {
        return useProcessListData(_list, detailedListReq.results)
    }, [detailedListReq.results]);

    const onPaginationModeChange = React.useCallback( (selected: SelectOption) => {
        ( selected.value === 'page' || selected.value === 'scroll' ) && setView(selected.value)
    }, []);

    // add loading through hook
    
    return(
        <div className="listView">
            <List 
                infiniteScroll={view === 'scroll'}
                data={contextList}
                pageSize={limit}
                listProcessor={doProcessListData}
                onProcessEnd={updateProcessedList}
                headerItems={[
                    { item: <Select 
                        name='view' label='View mode'
                        options={[
                            { label: 'Page', value: 'page', selected: true },
                            { label: 'Scroll', value: 'scroll' },
                        ]}
                        onChange={onPaginationModeChange}
                    />, position: 'left', key: 'pagination'}
                ]}
                footerItems={ view === 'page' ? [
                    { item: <Button type='primary' onClick={fetchPrevious} disabled={!previous}>Previous</Button>, position: "left", key: 'nav-previous'},
                    { item: <span>{`Page ${pageNumber}`}</span>, position: "center", key: 'nav-page'},
                    { item: <Button type='primary' onClick={fetchNext} disabled={!next}>Next</Button>, position: "right", key: 'nav-next'}
                ] : [{ item: <Button type='primary' onClick={fetchNext} disabled={!next}>More</Button>, position: "center", key: 'nav-more'}]}
            />
        </div>
    )
}

export default ListView;
