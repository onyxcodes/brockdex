import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { listPokemon } from "../../features/pokeapi";

import Loader from "../../components/Loader";
import Card from "../../components/Card";
import ActionBar from "../../components/ActionBar";

// TODO: component that accept different size configurations
// and displays a card for each data.entries passed to this
// support pagination and items per page conf
class ListView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // at first load data
        this.props.listPokemon();
    }

    fetchNext() {
        if ( this.props.pokeapi && this.props.pokeapi?.next ) {
            this.props.listPokemon(
                this.props.pokeapi.next.offset,
                this.props.pokeapi.next.limit
            )
        } // else throw Error
    }

    fetchPrevious() {
        if ( this.props.pokeapi && this.props.pokeapi?.previous ) {
            this.props.listPokemon(
                this.props.pokeapi.previous.offset,
                this.props.pokeapi.previous.limit
            )
        } // else throw Error
    }

    render() {
        const { pokeapi, openDetails, isLoading } = this.props;
        return(
            <div className="listView">
                <Loader show={isLoading} />
                {pokeapi?.results?.map( (i, index) => {
                    return <Card key={i.name}
                        openDetails={() => openDetails(i)}
                        title={i.name}
                        size={this.props.size}
                    />
                })}
                <ActionBar position="bottom"
                    items={[
                        { item: <button onClick={() => this.fetchPrevious()} disabled={!pokeapi.previous}>Previous</button>, position: "left"},
                        { item: <button onClick={() => this.fetchNext()} disabled={!pokeapi.next}>Next</button>, position: "right"}
                    ]}
                />
            </div>
        )
    }
}

function mapStateToProps({pokeapi}) {
    let isLoading = true; // this when the compoenent is first mounted
    if (pokeapi && pokeapi?.count) {
        isLoading = false; 
        return { pokeapi, isLoading }
    }
    return { pokeapi: [], isLoading: pokeapi?.loading || isLoading }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({listPokemon}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(ListView);