import type { NextApiRequest, NextApiResponse } from 'next'
const collectionIds = require('../scripts/collectionIds');
const collectionList = require('../scripts/collectionList');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const address = req.query.address;
  const network = req.headers.network;
  const result = await collectionIds.get(address, network);
  let nftCount = 0;
  for (const prop in result) {
    nftCount = nftCount + result[prop].length
  }
  const collections = await collectionList.get(network);
  const final = walk(result, collections)
  const finalReturn = {
    data: final,
    status: 200
  }
  res.status(200).json(finalReturn);
}

function walk(v: any, nftCollections: any){
	let collectionsArray: any[] = []
	for (const k in v) {
    if ((v[k].length) > 0) {
      for (const nft in nftCollections) {
        let collection = {
          collection : {},
          ids : [],
          count: 0
        }
        // console.log(nft.contract_name)
        if (nft.toLowerCase() == k.toLowerCase()) {
          collection.collection = nftCollections[nft]
          collection.ids = v[k]

          collection.count = v[k].length
          collectionsArray.push(collection)
        }
      }
    }
  }
	return collectionsArray
}