import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { listPokemon } from "../../features/pokeapi/list";
import { getPokemonList } from "../../features/pokeapi/detailedList";

import Loader from "../../components/Loader";
import Card from "../../components/Card";
import ActionBar from "../../components/ActionBar";

// TODO: component that accept different size configurations
// and displays a card for each data.entries passed to this
// support pagination and items per page conf
class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSet: false
        }
    }

    componentDidMount() {
        // at first load data
        this.props.listPokemon();
    }

    componentDidUpdate() {
        
        if ( this.props.list?.results && 
            !this.props.loadingList &&
            !this.props.loadingListSuccess
        ) {
            this.props.getPokemonList(this.props.list.results);
        }
        if ( this.props.loadingListSuccess && 
            this.props.detailedList?.results && // TODO: improve to avoid updating state for empty lists
            !this.state.listSet ) {
                this.props.setPokemonList(this.props.detailedList?.results)
                this.setState({ listSet: true })
            
        };
    }

    fetchNext() {
        if ( this.props.list && this.props.list?.next ) {
            this.props.listPokemon(
                this.props.list.next.offset,
                this.props.list.next.limit
            )
        } // else throw Error
    }

    fetchPrevious() {
        if ( this.props.list && this.props.list?.previous ) {
            this.props.listPokemon(
                this.props.list.previous.offset,
                this.props.list.previous.limit
            )
        } // else throw Error
    }

    render() {
        const { list, detailedList, openDetails, loading } = this.props;
        return(
            <div className="listView">
                <Loader show={loading} />
                {list?.results?.map( (i, index) => {
                    // TODO: consider saving results in current page into an array
                    // therefore it can be used to fetch next and previous from modals
                    // obviously dont compute it here..
                    return <Card key={i.name}
                        openDetails={(data) => openDetails(data, detailedList?.results)} // TODO: fix
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
    return { 
        list: list || [],
        detailedList: detailedList || [],
        loadingList: detailedList ? detailedList.loading : false,
        loadingListSuccess: detailedList ? detailedList.success : false,
        loading: list ? list.loading : true,
        error: list ? list.error : false
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({listPokemon, getPokemonList}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(ListView);