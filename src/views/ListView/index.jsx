import React, { Component } from "react";
import Card from "../../components/Card";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { listPokemon } from "../../features/pokeapi";

// TODO: component that accept different size configurations
// and displays a card for each data.entries passed to this
// support pagination and items per page conf
class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            page: props.paginated ? props.data.page : null
        }
    }
    componentDidMount() {
        // at first load data
        this.props.listPokemon();
    }

    render() {
        const { pokeapi, openDetails } = this.props;
        return(
            <div className="listView">
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
    console.log("mapping props from redux", pokeapi)
        if (pokeapi && pokeapi?.count) {
        return { pokeapi }
    }
    return { pokeapi: [] }
}

function mapDispatchToProps(dispatch) {
return bindActionCreators({listPokemon}, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(ListView);