import React, { Component } from "react"

class Card extends Component {
    render() {
        var cardClasses = this.props.size ? "card".concat(" "+this.props.size) : "card";
        return(
            <div 
                className={cardClasses}
                onClick={() => this.props.openDetails(this.props.id)}
            >
                { ( this.props.color || this.props.image ) ? <div className="card-hero" style={{
                    backgroundColor: this.props.color,
                    // backgroundImage: this.props.image 
                }}></div> : null }
                <span className="card-title">{this.props.title}</span>
            </div>
        )
    }
}

export default Card;