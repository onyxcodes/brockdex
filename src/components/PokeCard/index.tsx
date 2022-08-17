import React from 'react';

import Card, { CardProps }  from '../Card';
import { PokeDataDetailed } from '../../features/pokeapi/detailedList';

// TODO: Consider extracting list's type to specific type
interface PokeCardProps extends CardProps {
    id: string;
    list?: { [key: string]: PokeDataDetailed};
    openDetails?: (data: { [key: string]: any }) => void;
    next?: string;
    previous?: string;
}

const PokeCard = ( props: PokeCardProps ) => {
    const { id, list,
        openDetails, 
        next, previous
    }  = props;
    const [ bgImage, setBgImage ] = React.useState(undefined);
    const [ detailsData, setDetailsData ] = React.useState({
        name: id
    });

    var data: PokeDataDetailed = {
        name: id
    };

    var pokeData = list?.[id];

    React.useEffect( () => {
        if (pokeData) {
            data = {...pokeData};

            data.name = id;
            data.next = next,
            data.previous = previous;

            setBgImage(data?.sprites?.other['official-artwork']?.front_default);
            setDetailsData(data);
        }
    }, [pokeData]);
   
    return (
        <Card
            onClick={() => openDetails && openDetails(detailsData)}
            bgImage={bgImage}
            {...props}
        />
    )
}

export default PokeCard;