import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { listPokemon } from "../../features/pokeapi/list";
import { getPokemonList } from "../../features/pokeapi/detailedList";

import Loader from "../../components/Loader";
import Card from "../../components/Card";
import ActionBar from "../../components/ActionBar";

class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSet: false,
            query: null,
            offset: 0,
            limit: 24,
            newPageReq: false
        }
    }

    componentDidMount() {
        // at first load data
        this.props.listPokemon();
    }

    componentDidUpdate() {
        if (this.props.query !== this.state.query) {
            // A new search query was provided, track in state
            // and clean offset and limit parameters
            this.setState({ 
                query: this.props.query,
                limit: 24,
                offset: 0
            }, () => {
                this.props.listPokemon(
                    this.state.offset, this.state.limit, {
                    query: this.state.query,
                    total: this.props.total
                });
            });
        }

        if ( this.state.newPageReq ) {
            // new page was requested, before fetching new page's data
            // mark the request flag to false to avoid loops
            this.setState({ newPageReq: false }, () => {
                this.props.listPokemon(
                    this.state.offset, this.state.limit, {
                    query: this.state.query,
                    total: this.props.total
                });
            })
        }
        
        // If result list ( with minimum information ) was loaded
        // attempt to load also detailed list
        if ( this.props.list?.results && 
            !this.props.loadingList && // avoids when is already loading
            !this.props.loadingListSuccess // avoids when load was already completed
        ) {
            // Send the request for a new detailed list
            this.props.getPokemonList(this.props.list.results);
            // Since we just sent out the request for loading a new detailed list
            
            this.setState({ 
                listSet: false, // the relative lists setter flag must be set to false
            })
        }
        
        // If detailed list was successfully loaded, pass to parent comp
        if ( this.props.loadingListSuccess &&
            this.props.list?.results &&
            this.props.detailedList?.results && // TODO: improve to avoid updating state for empty lists
            !this.state.listSet // avoid when already passed
        ) {
                this.props.setPokemonList(this.props.detailedList?.results, this.props.total)
                this.setState({ listSet: true })
            
        };
    }

    fetchNext() {
        if ( this.props.list && this.props.list?.next ) {
            this.setState({
                offset: this.props.list.next.offset,
                limit: this.props.list.next.limit,
                newPageReq: true,
            })
        } // else throw Error
    }

    fetchPrevious() {
        if ( this.props.list && this.props.list?.previous ) {
            this.setState({
                offset: this.props.list.previous.offset,
                limit: this.props.list.previous.limit,
                newPageReq: true
            })
        } // else throw Error
    }

    render() {
        const { list, detailedList, openDetails, loading } = this.props;
        return(
            <div className="listView">
                <Loader show={loading} />
                {list?.results?.map( (i, index) => {
                    return <Card key={i.name}
                        openDetails={(data) => openDetails(data)}
                        list={detailedList?.results}
                        next={ list.results?.[index+1]?.name }
                        previous={ list.results?.[index-1]?.name }
                        id={i.name} // based on api response structure, it matches name
                        title={i.name}
                        size={this.props.size}
                    />
                })}

                <ActionBar position="bottom"
                    items={[
                        { item: <button onClick={() => this.fetchPrevious()} disabled={!list.previous}>Previous</button>, position: "left"},
                        { item: <button onClick={() => this.fetchNext()} disabled={!list.next}>Next</button>, position: "right"}
                    ]}
                />
            </div>
        )
    }
}

function mapStateToProps({list, detailedList}) {
    const props = { 
        list: list || [],
        total: list ? list.total : null,
        loading: list ? list.loading : true,
        error: list ? list.error : false,
        detailedList: detailedList || [],
        loadingList: detailedList ? detailedList.loading : false,
        loadingListSuccess: detailedList ? detailedList.success : false,
    };
    return props;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({listPokemon, getPokemonList}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(ListView);