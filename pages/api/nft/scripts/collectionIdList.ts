const fcl = require('@onflow/fcl');
const config = require('../../tools');
const NFTModel = require('./NFTModel');

export async function get (address: string, collectionIds: any, network: string) {
    config.setup(fcl, network);
    const cadence =  `
    import MetadataViews from 0xMetadataViews
    import NFTCatalog from 0xNFTCatalog
    import NFTRetrieval from 0xNFTRetrieval

    <NFTModel>

    pub fun main(ownerAddress: Address, collections: {String : [UInt64]}) : {String : [NFT] } {
        let data : {String : [NFT] } = {}

        let catalog = NFTCatalog.getCatalog()
        let account = getAuthAccount(ownerAddress)
        for collectionIdentifier in collections.keys {
            let value = catalog[collectionIdentifier]!
            if catalog.containsKey(collectionIdentifier) {
                let tempPathStr = "catalog".concat(collectionIdentifier)
                let tempPublicPath = PublicPath(identifier: tempPathStr)!
                account.link<&{MetadataViews.ResolverCollection}>(
                    tempPublicPath,
                    target: value.collectionData.storagePath
                )

                let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)

                if !collectionCap.check() {
                    return data
                }

                let views = NFTRetrieval.getNFTViewsFromIDs(collectionIdentifier : collectionIdentifier, ids: collections[collectionIdentifier]!, collectionCap : collectionCap)

                let items : [NFT] = []

                for view in views {
                        let displayView = view.display
                        let externalURLView = view.externalURL
                        let collectionDataView = view.collectionData
                        let collectionDisplayView = view.collectionDisplay
                        let royaltyView = view.royalties
                        let traitsView = view.traits
                        if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
                            // Bad NFT. Skipping....
                            continue
                        }

                        items.append(
                            NFT(
                                id: view.id,
                                name : displayView!.name,
                                description : displayView!.description,
                                thumbnail : displayView!.thumbnail.uri(),
                                externalURL : externalURLView!.url,
                                contractAddress: value.contractAddress,
                                collectionID: collectionIdentifier,
                                collectionName : collectionDisplayView!.name,
                                collectionContractName: value.contractName,
                                collectionDescription : collectionDisplayView!.description,
                                collectionSquareImage : collectionDisplayView!.squareImage.file.uri(),
                                collectionBannerImage : collectionDisplayView!.bannerImage.file.uri(),
                                collectionExternalURL : collectionDisplayView!.externalURL.url,
                                royalties : royaltyView!.getRoyalties(),
                                traits : traitsView?.traits ?? []
                            )
                        )
                    }

                    data[collectionIdentifier] = items
            }
        }
        return data
    }
    `.replaceAll('<NFTModel>', NFTModel.model())

    const result = await fcl.query({
        cadence: cadence,
        args: (arg :any, t : any) => [arg(address, t.Address), arg(collectionIds, t.Dictionary({key: t.String, value: t.Array(t.UInt64)}))],
      });

    return result;
};