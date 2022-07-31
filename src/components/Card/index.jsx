import React, { Component } from "react"

class Card extends Component {
    render() {
        var cardClasses = this.props.size ? "card".concat(" "+this.props.size) : "card";
        return(
            <div 
                className={cardClasses}
                onClick={() => this.props.openDetails(this.props.id)}
            >
                <div className="card-hero" style={{
                    backgroundColor: this.props.color || "#999999",
                    // backgroundImage: this.props.image 
                }}></div>
                <span className="card-title">{this.props.title}</span>
            </div>
        )
    }
}

export default Card;