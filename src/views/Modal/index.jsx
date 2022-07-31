import React, { Component } from "react";
import ActionBar from "../../components/ActionBar";

class Modal extends Component {
    // TODO: on component mount fetch deatils through given id
    render() {
        var modalClasses = this.props.size ? "modal".concat(" "+this.props.size) : "modal";
        var modalFgClasses  = this.props.visible ? "modal-fg".concat(" "+"visible") : "modal-fg";
        return(
            <div className={modalFgClasses}>
                <div className={modalClasses}>
                    <ActionBar position="top"
                        items={[
                            { item: <span>{this.props.content?.name}</span>, position: "center" },
                            { item: <button onClick={() => this.props.closeModal()}>Close</button>, position: "right"}
                        ]}
                    />
                    {/* TODO: Add loader while fetching additional details */}
                    <div style={{ flex: 1}}>Content</div>
                    <ActionBar position="bottom"
                        items={[
                            { item: <button onClick={() => this.props.addToFavorites(this.props.content?.id)}>Add to favorites</button>, position: "right"}
                        ]}
                    />
                </div>
            </div>
        )
    }
}

export default Modal;