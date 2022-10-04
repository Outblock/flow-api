# Flow API

For network, by default the network is `mainnet`, if you want to query in `testnet`
Just add `network=testnet` query on the url
> https://flow.lilico.org/api/nft/collections?network=testnet

## NFT Catalog API

#### All NFT collection
https://flow.lilico.org/api/nft/collections
#### Single NFT
https://flow.lilico.org/api/nft/single?address={address}&id={nftID}&collectionIdentifier={NFTCollectionID}

> https://flow.lilico.org/api/nft/single?address=0x95601dba5c2506eb&id=1343&collectionIdentifier=Flovatar
#### Get all NFT ids under one account
https://flow.lilico.org/api/nft/id?address={address}

> https://flow.lilico.org/api/nft/id?address=0x95601dba5c2506eb
#### NFTs with pagination
https://flow.lilico.org/api/nft/list?address={address}&offset={offset}&limit={limit}

> https://flow.lilico.org/api/nft/list?address=0x95601dba5c2506eb&offset=0&limit=10
#### NFT under one collection with pagination
https://flow.lilico.org/api/nft/collectionList?address={address}&offset={offset}&limit={limit}&collectionIdentifier={NFTCollectionID}

> https://flow.lilico.org/api/nft/collectionList?address=0x95601dba5c2506eb&offset=0&limit=10&collectionIdentifier=Flovatar

#### Generate NFT init transaction 
https://flow.lilico.org/api/nft/generateInit?collectionIdentifier={NFTCollectionID}

> https://flow.lilico.org/api/nft/generateInit?collectionIdentifier=Flovatar

## Transaction Template API
### Query Transaction Template (POST)
> https://flow.lilico.org/api/template
```json
{
    "cadence": "import FungibleToken from 0x9a0766d93b6608b7\ntransaction(amount: UFix64, to: Address) {\nlet vault: @FungibleToken.Vault\nprepare(signer: AuthAccount) {\nself.vault <- signer\n.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!\n.withdraw(amount: amount)\n}\nexecute {\ngetAccount(to)\n.getCapability(/public/flowTokenReceiver)!\n.borrow<&{FungibleToken.Receiver}>()!\n.deposit(from: <-self.vault)\n}\n}",
    "network": "testnet"
}
```
or 

> https://flow.lilico.org/api/template?network=testnet
```json
{
    "cadence_base64":"aW1wb3J0IEZ1bmdpYmxlVG9rZW4gZnJvbSAweDlhMDc2NmQ5M2I2NjA4YjcKdHJhbnNhY3Rpb24oYW1vdW50OiBVRml4NjQsIHRvOiBBZGRyZXNzKSB7CmxldCB2YXVsdDogQEZ1bmdpYmxlVG9rZW4uVmF1bHQKcHJlcGFyZShzaWduZXI6IEF1dGhBY2NvdW50KSB7CnNlbGYudmF1bHQgPC0gc2lnbmVyCi5ib3Jyb3c8JntGdW5naWJsZVRva2VuLlByb3ZpZGVyfT4oZnJvbTogL3N0b3JhZ2UvZmxvd1Rva2VuVmF1bHQpIQoud2l0aGRyYXcoYW1vdW50OiBhbW91bnQpCn0KZXhlY3V0ZSB7CmdldEFjY291bnQodG8pCi5nZXRDYXBhYmlsaXR5KC9wdWJsaWMvZmxvd1Rva2VuUmVjZWl2ZXIpIQouYm9ycm93PCZ7RnVuZ2libGVUb2tlbi5SZWNlaXZlcn0+KCkhCi5kZXBvc2l0KGZyb206IDwtc2VsZi52YXVsdCkKfQp9",
}
```
