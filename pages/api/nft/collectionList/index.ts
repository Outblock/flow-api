import type { NextApiRequest, NextApiResponse } from 'next'
const collectionIds = require('../scripts/collectionIds');
const collectionIdList = require('../scripts/collectionIdList');
const collectionList = require('../scripts/collectionList');
const utilities = require('../utilities')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { address, offset, limit } = req.query;
  const network = req.headers.network;
  const collectionIdentifier = req.query.collectionIdentifier;

  const initResult = await collectionIds.get(address, network);
  let result:any = {}
  for (const prop in initResult) {
    if (prop === collectionIdentifier) {
      result[prop] = initResult[prop]
    }
  }
  let nftCount = 0;
  for (const prop in result) {
    nftCount = nftCount + result[prop].length
  }
  const paginated = await utilities.pagination(result,limit,offset);
  
  const collectionParam = {key:'', value:[]}
  let tempArray: any[] = []
  let final: any[] = []
  for (const k in paginated) {
    collectionParam.key = k
    collectionParam.value = paginated[k]
    const result = await collectionIdList.get(address, collectionParam, network);
    tempArray.push(...result[k]);
  }

  const collections = await collectionList.get(network);
  const processed = await utilities.nftMedia(tempArray);

  const nftReturn = {
    nfts: processed,
    info: collections[String(collectionIdentifier)],
    nftCount: nftCount,
  }
  const finalReturn = {
    data: nftReturn,
    status:200
  }
  res.status(200).json(finalReturn);
}
