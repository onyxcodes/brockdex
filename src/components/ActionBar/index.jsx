import React, { Component } from "react"

class ActionBar extends Component {

    render() {
        var barClasses = this.props.position ? "actionbar-container".concat(" "+this.props.position) : "actionbar-container";
        return (
            <div className={barClasses}>
                <div className="actionbar-left">
                    {this.props.items?.map((i, index) => {
                        if (i.position == "left") return (<React.Fragment key={index}>{i?.item}</React.Fragment>)
                    })}
                </div>
                <div className="actionbar-center">
                    {this.props.items?.map((i, index) => {
                        if (i.position == "center") return (<React.Fragment key={index}>{i?.item}</React.Fragment>)
                    })}
                </div>
                <div className="actionbar-right">
                    {this.props.items?.map((i, index) => {
                        if (i.position == "right") return (<React.Fragment key={index}>{i?.item}</React.Fragment>)
                    })}
                </div>
            </div>
           
        )
    }
}

export default ActionBar;