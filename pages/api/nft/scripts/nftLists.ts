const fcl = require('@onflow/fcl');
const config = require('../../tools');
const NFTModel = require('./NFTModel');

export async function get(address: string, collectionId: string[],  network: string) {
    config.setup(fcl, network);
    const cadence =  `
    import MetadataViews from 0xMetadataViews
    import NFTCatalog from 0xNFTCatalog
    import NFTRetrieval from 0xNFTRetrieval

    <NFTModel>
    
    pub fun main(ownerAddress: Address, collectionIdentifiers: [String]) : { String : [NFT] }    {
        let catalog = NFTCatalog.getCatalog()
        let account = getAuthAccount(ownerAddress)
        
        let data : {String : [NFT] } = {}
    
        for collectionIdentifier in collectionIdentifiers {
            if catalog.containsKey(collectionIdentifier) {
                let value = catalog[collectionIdentifier]!
                let tempPathStr = "catalog".concat(collectionIdentifier)
                let tempPublicPath = PublicPath(identifier: tempPathStr)!
                account.link<&{MetadataViews.ResolverCollection}>(
                    tempPublicPath,
                    target: value.collectionData.storagePath
                )
                
                let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
                if !collectionCap.check() {
                    continue
                }
                let views = NFTRetrieval.getNFTViewsFromCap(collectionIdentifier : collectionIdentifier, collectionCap : collectionCap)
                
                let items : [NFT] = []
                
                <NFTAppend>
                
                data[collectionIdentifier] = items
            }
        }
    
        return data
    }
    `
    .replaceAll('<NFTModel>', NFTModel.model())
    .replaceAll('<NFTAppend>', NFTModel.append())

    const txResp = await fcl.query({
        cadence: cadence,
        args: (arg :any, t : any) => [arg(address, t.Address), arg(collectionId, t.Array(t.String))],
      });
    console.log()

    return txResp;

};
