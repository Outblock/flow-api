## Flow API
---

### Single nft

https://flow.lilico.org/api/nft/single?address={address}&id={nftID}&collectionIdentifier={NFTCollectionID}

Example:
> https://flow.lilico.org/api/nft/single?address=0x95601dba5c2506eb&id=1343&collectionIdentifier=Flovatar
### Get all NFT ids under one account
> https://flow.lilico.org/api/nft/ids?address={address}

Example
> https://flow.lilico.org/api/nft/ids?address=0x95601dba5c2506eb
### NFTs with pagination
> https://flow.lilico.org/api/nft/list?address={address}&offset={offset}&limit={limit}
Example
> https://flow.lilico.org/api/nft/list?address=0x95601dba5c2506eb&offset=0&limit=10
### NFT under one collection with pagination
> https://flow.lilico.org/api/nft/collectionList?address={address}&offset={offset}&limit={limit}&collectionIdentifier={NFTCollectionID}
Example
> https://flow.lilico.org/api/nft/collectionList?address=0x95601dba5c2506eb&offset=0&limit=10&collectionIdentifier=Flovatar