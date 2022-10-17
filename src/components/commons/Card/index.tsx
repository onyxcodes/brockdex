import React from "react";
import './index.scss';

export interface CardProps {
    key: string;
    title: string;
    // TODO: set accepted sizes, and style accordingly
    size?: string;
    className?: string;
    onClick?: (args: any) => void;
    bgColor?: string;
    bgImage?: string;
}
const Card = ( props: CardProps ) => {
    const {
        title, size = "medium", onClick, 
        bgColor = "#999999", bgImage,
        className
    } = props;

    let cardClass = `card ${size} m1`;

    return(
        <div 
            className={cardClass}
            onClick={onClick}
        >
            <div className="card-hero" style={{
                backgroundRepeat: bgImage ? 'no-repeat' : undefined,
                backgroundSize: bgImage ? 'contain' : undefined,
                backgroundPosition: bgImage ? 'center' : undefined,
                backgroundImage: bgImage ? "url("+bgImage+")" : undefined 
            }}></div>
            <span className="card-title">{title}</span>
        </div>
    )
}

export default Card;