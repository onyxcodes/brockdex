import React from "react";

export interface CardProps {
    key: string;
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
                backgroundColor: !bgImage && bgColor || undefined,
                backgroundImage: bgImage ? "url("+bgImage+")" : undefined 
            }}></div>
            <span className="card-title">{title}</span>
        </div>
    )
}

export default Card;