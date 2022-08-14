import React from "react";

import ActionBar, { ActionBarItemProps } from "../../components/ActionBar";
import Loader from "../../components/Loader";

export interface ModalProps {
    title?: string;
    children?: (JSX.Element | undefined)[];
    heroImg?: string;
    // TODO: set accepted sizes, and style accordingly
    size?: string;
    visible?: boolean;
    loading?: boolean;
    closeModal: () => void;
    topActionBarItems?: ActionBarItemProps[];
    btmActionBarItems?: ActionBarItemProps[];
};

const Modal = ( props: ModalProps ) => {
    const { 
        title = "Modal", heroImg,
        children,
        size = "medium", visible = false,  loading = false,
        topActionBarItems, btmActionBarItems,
        closeModal
    } = props;

    var modalClasses = size ? "modal".concat(" "+size) : "modal";
    var modalFgClasses  = visible ? "modal-fg".concat(" "+"visible") : "modal-fg";

    return(
        <div className={modalFgClasses}>
            <div className={modalClasses}>
                <ActionBar position="top"
                    items={[
                        { item: <span>{title}</span>, position: "center" },
                        ...(topActionBarItems || []),
                        { item: <button onClick={() => closeModal()}>❌ Close</button>, position: "right"}
                    ]}
                />
                <Loader show={loading} />
                { !loading ? <div className="modal-content">
                    { heroImg && <div 
                        className="hero-container"
                    >   <div className="hero"
                            style={{
                                backgroundImage: 
                                    "url("+heroImg+")"
                            }}
                        >
                        &nbsp;
                        </div>
                    </div> }
                    <div className="modal-content-details">
                        {...(children || [])}
                    </div>
                </div> : <div className="modal-content"></div>}
                {btmActionBarItems && <ActionBar position="bottom"
                    items={[
                        ...btmActionBarItems
                    ]}
                />}
            </div>
        </div>
    );
}
  
export default Modal;