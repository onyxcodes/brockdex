import React from 'react';

import Card, { CardProps }  from '../Card';

interface PokeCardProps extends CardProps {
    id: string;
    list?: { [key: string]: {
        [key: string]: any
    }};
    openDetails?: (data: { [key: string]: any }) => void;
    next?: string;
    previous?: string;
}

const PokeCard = ( props: PokeCardProps ) => {
    const { id, list,
        openDetails, 
        next, previous
    }  = props;

    // The following actually modifies the referenced object in the list passed
    // by the parent component
    // TODO: Check if is a doable practice in React
    var data = list?.[id];
    if (data) {
        data.name = id;
        data.next = next,
        data.previous = previous;
    } else data = { name: id };
    
    const bgImage = data?.sprites?.other['official-artwork']?.front_default;

    return (
        <Card
            onClick={() => openDetails && openDetails(data)}
            bgImage={bgImage}
            {...props}
        />
    )
}

export default PokeCard;