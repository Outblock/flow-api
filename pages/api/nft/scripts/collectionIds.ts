const fcl = require('@onflow/fcl');
const config = require('../../tools');

export async function get (address: string, network: string) {
    config.setup(fcl, network);
    const cadence =  `
    import MetadataViews from 0xMetadataViews
    import NFTCatalog from 0xNFTCatalog
    import NFTRetrieval from 0xNFTRetrieval

    pub fun main(ownerAddress: Address) : {String : [UInt64]} {
        let catalog = NFTCatalog.getCatalog()
        let account = getAuthAccount(ownerAddress)

        let items : {String : [UInt64]} = {}

        for key in catalog.keys {
            let value = catalog[key]!
            let tempPathStr = "catalogIDs".concat(key)
            if let tempPublicPath = PublicPath(identifier: tempPathStr) {
                account.link<&{MetadataViews.ResolverCollection}>(
                    tempPublicPath,
                    target: value.collectionData.storagePath
                )

                let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
                if !collectionCap.check() {
                    continue
                }

                let ids = NFTRetrieval.getNFTIDsFromCap(collectionIdentifier : key, collectionCap : collectionCap)

                if ids.length > 0 {
                    items[key] = ids
                }
            }
        }
        return items

    }
    `

    const txResp = await fcl.query({
        cadence: cadence,
        args: (arg :any, t : any) => [arg(address, t.Address)],
      })

    return txResp;

};
