import type { NextApiRequest, NextApiResponse } from 'next'
const singleNFT = require('../scripts/singleNFT');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {address, id, collectionIdentifier} = req.query;
  const network = req.headers.network;
  const result = await singleNFT.get(network, address, id, collectionIdentifier);

  const finalReturn = {
    data: result,
    status:200
  }
  res.status(200).json(finalReturn);
}
