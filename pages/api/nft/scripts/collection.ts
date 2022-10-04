const fcl = require('@onflow/fcl');
const config = require('../../tools');

export async function get(network: string, collectionIdentifier: string) {
    config.setup(fcl, network);
    const cadence =  `
    import NFTCatalog from 0xNFTCatalog

    pub fun main(collectionIdentifier: String): NFTCatalog.NFTCatalogMetadata {
        return NFTCatalog.getCatalog()[collectionIdentifier]!
    }
    `

    const txResp = await fcl.query({
        cadence: cadence,
        args: (arg :any, t : any) => [arg(collectionIdentifier, t.String)],
      });

    return txResp;
};
