const fcl = require('@onflow/fcl');
const config = require('../../tools');
const NFTModel = require('./NFTModel');

export async function get(network:string, owner: string, id: string, collectionIdentifier:string) {
    config.setup(fcl, network);
    const cadence =  `
    import MetadataViews from 0xMetadataViews
    import NFTCatalog from 0xNFTCatalog
    import NFTRetrieval from 0xNFTRetrieval

    <NFTModel>

    pub fun main(ownerAddress: Address, collectionIdentifier : String, tokenID: UInt64) : NFT? {
            let catalog = NFTCatalog.getCatalog()

            assert(catalog.containsKey(collectionIdentifier), message: "Invalid Collection")
            
            let account = getAuthAccount(ownerAddress)
            
            let value = catalog[collectionIdentifier]!
            let tempPathStr = "catalog".concat(collectionIdentifier)
            let tempPublicPath = PublicPath(identifier: tempPathStr)!
            account.link<&{MetadataViews.ResolverCollection}>(
                tempPublicPath,
                target: value.collectionData.storagePath
            )
            let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
            assert(collectionCap.check(), message: "MetadataViews Collection is not set up properly, ensure the Capability was created/linked correctly.")
            let views = NFTRetrieval.getNFTViewsFromCap(collectionIdentifier : collectionIdentifier, collectionCap : collectionCap)
            
            <NFTQuery>
            
            panic("Invalid Token ID")
    }
    `
    .replaceAll('<NFTModel>', NFTModel.model())
    .replaceAll('<NFTQuery>', NFTModel.query())

    const txResp = await fcl.query({
        cadence: cadence,
        args: (arg :any, t : any) => [arg(owner, t.Address), arg(collectionIdentifier, t.String), arg(id, t.UInt64)],
      });

    return txResp;

}