import React from "react";

import './index.scss';

const Loader = ( props: { show: boolean } ) => {
    const { show = false } = props;
    return (
        show ? <div className="loader">Loading</div> : <></>
    );
}

export default Loader;