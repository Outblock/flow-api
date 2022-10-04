import type { NextApiRequest, NextApiResponse } from 'next'
const collectionIds = require('../scripts/collectionIds');
const collectionIdList = require('../scripts/collectionIdList');
const utilities = require('../utilities');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const address = req.query.address;
  const offset = req.query.offset;
  const limit = req.query.limit;
  const network = req.headers.network;
  
  const result = await collectionIds.get(address, network);
  let nftCount = 0;
  for (const prop in result) {
    nftCount = nftCount + result[prop].length
  }
  const paginated = await utilities.pagination(result,limit,offset);
  
  const collectionParam = {key:'', value:[]}
  let tempArray: any[] = []
  for (const k in paginated) {
    collectionParam.key = k
    collectionParam.value = paginated[k]
    const result = await collectionIdList.get(address, collectionParam,network);
    tempArray.push(...result[k]);
  }

  const processed = await utilities.nftMedia(tempArray);

  const nftReturn = {
    nfts: processed,
    nftCount: nftCount
  }
  const finalReturn = {
    data: nftReturn,
    status:200
  }
  res.status(200).json(finalReturn);
}
