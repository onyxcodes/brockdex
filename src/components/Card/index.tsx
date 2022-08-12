import React from "react";

export interface CardProps {
    title: string;
    // TODO: set accepted sizes, and style accordingly
    size?: string;
    classes?: string;
    onClick?: () => void;
    bgColor?: string;
    bgImage?: string;
}
const Card = ( props: CardProps ) => {
    const {
        title, size = "medium", onClick, 
        bgColor = "#999999", bgImage,
        classes = "card"
    } = props;

    let cardClasses = classes;
    cardClasses = size ? cardClasses.concat(" "+size) : cardClasses;

    return(
        <div 
            className={cardClasses}
            onClick={onClick}
        >
            <div className="card-hero" style={{
                backgroundColor: !bgImage && bgColor,
                backgroundImage: bgImage ? "url("+bgImage+")" : null 
            }}></div>
            <span className="card-title">{title}</span>
        </div>
    )
}

export default Card;