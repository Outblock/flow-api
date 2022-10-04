import type { NextApiRequest, NextApiResponse } from 'next'
const collection = require('../scripts/collection');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const network = req.headers.network || req.query.network;
  const collectionIdentifier = req.query.collectionIdentifier
  const result = await collection.get(network, collectionIdentifier);

  const finalReturn = {
    data: result,
    status: 200
  }
  res.status(200).json(finalReturn);
}

