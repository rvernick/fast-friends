

export const getBathrooms = async () => {
var result = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
        method: "POST",
        // The body contains the query
        body: "data="+ encodeURIComponent(`
            [bbox:[-122.5145, 37.7085, -122.3716, 37.8092]
            [out:json]
            [timeout:90]
            ;
            (
                way
                    (
                         30.626917110746,
                         -96.348809105664,
                         30.634468750236,
                         -96.339893442898
                     );
            );
            out geom;
        `)
    },
).then(
    (data)=>data.json()
)
}

/*

[bbox:37.7,-122.5,37.8,-122.3]
            [out:json]
            [timeout:90];


nwr["amenity"="toilets"](37.7,-122.5,37.8,-122.3);

out center;

**/