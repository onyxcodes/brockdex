import React, { Component } from "react"

class ActionBar extends Component {
    render() {
        const { position, items, bgColor } = this.props;
        var barClasses = position ? "actionbar-container".concat(" "+position) : "actionbar-container";
        return (
            <div 
                className={barClasses}
                style={{
                    backgroundColor: bgColor
                }}
            >
                <div className="actionbar-left">
                    {items?.map((i, index) => {
                        if (i.position == "left" && i.item) return (<div key={index} className="actionbar-item">{i?.item}</div>)
                    })}
                </div>
                <div className="actionbar-center">
                    {items?.map((i, index) => {
                        if (i.position == "center" && i.item) return (<div key={index} className="actionbar-item">{i?.item}</div>)
                    })}
                </div>
                <div className="actionbar-right">
                    {items?.map((i, index) => {
                        if (i.position == "right" && i.item) return (<div key={index} className="actionbar-item">{i.item}</div>)
                    })}
                </div>
            </div>
           
        )
    }
}

export default ActionBar;