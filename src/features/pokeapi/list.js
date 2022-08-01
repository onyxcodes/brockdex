import axios from "axios";

export default ( offset, limit ) => {
    return new Promise ( (resolve, reject) => {
        axios({
            "method": "GET",
            // "url": "/pokeapi/pokemon",
            "url": "https://pokeapi.co/api/v2/pokemon",
            "headers": {
                "crossorigin":true,
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "*"
            }, "params": {
                "offset":offset,
                "limit":  limit
            }
        })
        .then(({data}) => {
            if (data && data?.results?.length) resolve(data)
        })
        .catch((error) => {
            console.log(error)
        })
    });
}