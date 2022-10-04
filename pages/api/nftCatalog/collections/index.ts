import type { NextApiRequest, NextApiResponse } from 'next'
const collectionList = require('../scripts/collectionList');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const network = req.headers.network;
  const collections = await collectionList.get(network);

  const finalReturn = {
    data: collections,
    status: 200
  }
  res.status(200).json(finalReturn);
}

