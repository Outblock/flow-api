const fcl = require('@onflow/fcl');
const config = require('../../tools');
const cacheData = require("memory-cache");

const CacheKey = 'CollectionList'

const pagnation = async (start: any, end: any) => {
    const cadence =  `
    import NFTCatalog from 0xNFTCatalog

    pub fun main(batch : [UInt64]): {String : NFTCatalog.NFTCatalogMetadata} {
        let catalog = NFTCatalog.getCatalog()
        let catalogIDs = catalog.keys
        var data : {String : NFTCatalog.NFTCatalogMetadata} = {}
        var i = batch[0]
        while i < batch[1] {
            data.insert(key: catalogIDs[i], catalog[catalogIDs[i]]!)
            i = i + 1
        }
        return data
    }
    `

    return await fcl.query({
        cadence: cadence,
        args: (arg :any, t : any) => [arg([String(start), String(end)], t.Array(t.UInt64))],
    });
}

const getCount = async () => {
    const cadence =  `
    import NFTCatalog from 0xNFTCatalog

    pub fun main(): Int {
        let catalog = NFTCatalog.getCatalog()
        let catalogIDs = catalog.keys
        return catalogIDs.length
    }
    `

    return await fcl.query({
        cadence: cadence
    });
}

const extendObj = (obj1: any, obj2: any) => {
    for (var key in obj2){
        if(obj2.hasOwnProperty(key)){
            obj1[key] = obj2[key];
        }
    }

    return obj1;
}

const fetchList = async (network: string) => {
    config.setup(fcl, network);

    const count = await getCount() as number;
    const limit = 50
    const split = Math.floor(count / limit);
    const range = Array.from(Array(split).keys()).map(i => {
        const start = i * limit
        return pagnation(start, (start + limit))
    })
    range.push(pagnation(split*limit, split*limit+(count % limit)))
    const result = await Promise.all(range)
    const reduce = result.reduce((acc, item) => acc = extendObj(acc, item), {})
    return reduce
}

export async function get(network: string) {
    const path = network + '/' + CacheKey
    const value = cacheData.get(path);
    if (value) {
        return value;
    } else {
        const hours = 1;
        const res = await fetchList(network);
        cacheData.put(path, res, hours * 1000 * 60 * 60);
        return res;
    }
};
