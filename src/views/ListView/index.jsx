import React, { Component } from "react";
import Card from "../../components/Card";

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
    render() {
        return(
            <div className="listView">
                {this.props.data?.entries.map( (i, index) => {
                    return <Card key={i.id}
                        openDetails={() => this.props.openDetails(i)}
                        image={i.image}
                        color={i.color}
                        title={i.name}
                        size={this.props.size}
                    />
                })}
            </div>
        )
    }
}

export default ListView;