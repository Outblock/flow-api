## Flow API
---

## NFT Catalog API

#### All NFT collection
https://flow.lilico.org/api/nft/collections
#### Single nft
https://flow.lilico.org/api/nft/single?address={address}&id={nftID}&collectionIdentifier={NFTCollectionID}

Example
> https://flow.lilico.org/api/nft/single?address=0x95601dba5c2506eb&id=1343&collectionIdentifier=Flovatar
#### Get all NFT ids under one account
> https://flow.lilico.org/api/nft/ids?address={address}

Example
> https://flow.lilico.org/api/nft/ids?address=0x95601dba5c2506eb
#### NFTs with pagination
> https://flow.lilico.org/api/nft/list?address={address}&offset={offset}&limit={limit}

Example
> https://flow.lilico.org/api/nft/list?address=0x95601dba5c2506eb&offset=0&limit=10
#### NFT under one collection with pagination
> https://flow.lilico.org/api/nft/collectionList?address={address}&offset={offset}&limit={limit}&collectionIdentifier={NFTCollectionID}

Example
> https://flow.lilico.org/api/nft/collectionList?address=0x95601dba5c2506eb&offset=0&limit=10&collectionIdentifier=Flovatar

## Testnet 
Just add `network=testnet` query on the url
> https://flow.lilico.org/api/nft/collections?network=testnet


## Transaction Template API

### Query Transaction Template
> https://flow.lilico.org/api/template
```json
{
    "cadence": "import FungibleToken from 0x9a0766d93b6608b7\ntransaction(amount: UFix64, to: Address) {\nlet vault: @FungibleToken.Vault\nprepare(signer: AuthAccount) {\nself.vault <- signer\n.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!\n.withdraw(amount: amount)\n}\nexecute {\ngetAccount(to)\n.getCapability(/public/flowTokenReceiver)!\n.borrow<&{FungibleToken.Receiver}>()!\n.deposit(from: <-self.vault)\n}\n}",
    "network": "testnet"
}
```