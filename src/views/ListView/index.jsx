import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { listPokemon } from "../../features/pokeapi";

import Loader from "../../components/Loader";
import Card from "../../components/Card";

// TODO: component that accept different size configurations
// and displays a card for each data.entries passed to this
// support pagination and items per page conf
class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            page: props.paginated ? props.data.page : null
        }
    }
    componentDidMount() {
        // at first load data
        this.props.listPokemon();
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
            </div>
        )
    }
}

function mapStateToProps({pokeapi}) {
    console.log("mapping props from redux", pokeapi);
    let isLoading = true;
    if (pokeapi && pokeapi?.count) {
        isLoading = false; 
        return { pokeapi, isLoading }
    }

    return { pokeapi: [], isLoading}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({listPokemon}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(ListView);