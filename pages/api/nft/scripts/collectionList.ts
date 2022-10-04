const fcl = require('@onflow/fcl');
const config = require('../../tools');

export async function get (network: string) {
    config.setup(fcl, network);
    const cadence =  `
    import NFTCatalog from 0xNFTCatalog

    pub fun main(): {String : NFTCatalog.NFTCatalogMetadata} {
        return NFTCatalog.getCatalog()
    }
    `

    const txResp = await fcl.query({
        cadence: cadence
      });

    return txResp;

};
