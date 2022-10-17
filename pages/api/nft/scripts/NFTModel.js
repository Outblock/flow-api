function model() {
    return `
    pub struct NFT {
        pub let id : UInt64
        pub let name : String
        pub let description : String
        pub let thumbnail : String
        pub let externalURL : String
        pub let contractAddress: Address
        pub let collectionID : String
        pub let collectionName : String
        pub let collectionContractName : String
        pub let collectionDescription: String
        pub let collectionSquareImage : String
        pub let collectionBannerImage : String
        pub let collectionExternalURL : String
        pub let royalties: [MetadataViews.Royalty]
        pub let traits: [MetadataViews.Trait]

        init(
            id: UInt64,
            name : String,
            description : String,
            thumbnail : String,
            externalURL : String,
            contractAddress: Address,
            collectionID : String,
            collectionName : String,
            collectionContractName: String,
            collectionDescription : String,
            collectionSquareImage : String,
            collectionBannerImage : String,
            collectionExternalURL : String,
            royalties : [MetadataViews.Royalty],
            traits: [MetadataViews.Trait]
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.externalURL = externalURL
            self.contractAddress = contractAddress
            self.collectionID = collectionID
            self.collectionName = collectionName
            self.collectionContractName = collectionContractName
            self.collectionDescription = collectionDescription
            self.collectionSquareImage = collectionSquareImage
            self.collectionBannerImage = collectionBannerImage
            self.collectionExternalURL = collectionExternalURL
            self.royalties = royalties
            self.traits = traits
        }
    }
    `
}

function query() {
    return `
    for view in views {
        if view.id == tokenID {
            let displayView = view.display
            let externalURLView = view.externalURL
            let collectionDataView = view.collectionData
            let collectionDisplayView = view.collectionDisplay
            let royaltyView = view.royalties
            let traitsView = view.traits
            if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
                // Bad NFT. Skipping....
                return nil
            }
            return NFT(
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
        }
    }

    `
}

function append() {
    return `
    for view in views {
        let displayView = view.display
        let externalURLView = view.externalURL
        let collectionDataView = view.collectionData
        let collectionDisplayView = view.collectionDisplay
        let royaltyView = view.royalties
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
                collectionID: collectionIdentifier,
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
    `
}

module.exports = {
    model,
    query,
    append
}