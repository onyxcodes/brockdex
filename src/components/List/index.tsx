import React from 'react';
import list from '../../features/pokeapi/list';
import ActionBar, { ActionBarItemProps } from '../ActionBar';
import Loader from '../Loader';
import Page from './page';

interface ListProps {
    infiniteScroll?: boolean;
    headerItems?: ActionBarItemProps[];
    footerItems?: ActionBarItemProps[];
    listProcessor: (arg: any) => {
        processed: { [key: string]: any };
        elements: JSX.Element[]
    },
    onProcessEnd: (arg: any) => void;
    loading?: boolean;
    onElementClick?: ( el: { [key: string]: any } ) => void;
    pageSize?: number;
    list: any[];
}
const List = ( props: ListProps ) => {
    const {
        infiniteScroll = false,
        headerItems, footerItems,
        loading = false,
        list, pageSize = 28,
        listProcessor, onProcessEnd,
        onElementClick
    } = props;

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

    return <>
        <Loader show={loading} />
        { headerItems && <ActionBar position="top"
            items={headerItems || []}
        /> }
        {/* If infinite scroll is enabled make use of custom hook that generates pages,
            * alternatively just show the page relative to current page's context
            */}
        { infiniteScroll ? 
            useInfinitePages(
                list, pageSize,
                listProcessor, 
                onProcessEnd
            ) :
            <Page list={list} 
                listProcessor={listProcessor}
                onProcessEnd={onProcessEnd}
            />
        }
        {/* If infinite scroll is enabled, as of now, show only one button to fetch more data,
        alternatively show page navigation */}
        { footerItems && <ActionBar position="bottom"
            items={footerItems}
        /> }
    </>
}

export default List;