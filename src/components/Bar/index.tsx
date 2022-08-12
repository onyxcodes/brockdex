import React from "react";

interface BarProps {
    value: number;
    maxValue: number;
    color?: string;
    showMax?: boolean;
    separator?: string;
    // animated?: boolean
}

const Bar = ( props: BarProps ) => {
    const { value, maxValue, color = "black", showMax = false, separator = "/"} = props;

    return (
        <div className="bar-container">
            <div className="bar" style={{
                backgroundColor: color,
                width: `calc(100% * ${value}/${maxValue})`
            }}>
                <div className="bar-value">
                    { showMax ? <>
                        <span>{value}</span>
                        <span>{separator}</span>
                        <span>{maxValue}</span>
                    </> : <span>{value}</span>}
                </div> 
            </div>
        </div>
    )
}

export default Bar;