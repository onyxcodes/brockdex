import React from "react";

/* TODO: make it a more stylish loader 
 * Consider localization meanwhile
*/

const Loader = ( props: { show: boolean } ) => {
    const { show = false } = props;
    return (
        show ? <div className="loader">Loading</div> : <></>
    );
}

export default Loader;