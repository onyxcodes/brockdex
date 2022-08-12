import React from "react";

const Loader = ( props ) => {
    const { show } = props;
    return (
        show && <div className="loader">Loading</div>
    );
}

export default Loader;