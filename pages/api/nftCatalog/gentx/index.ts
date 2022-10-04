import type { NextApiRequest, NextApiResponse } from 'next'
const transactionGeneration = require('../scripts/transactionGeneration');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const network = req.headers.network;
  const collectionIdentifier = req.query.collectionIdentifier;

  const transaction = await transactionGeneration.get(network, collectionIdentifier);
  const finalReturn = {
    data: transaction,
    status: 200
  }
  res.status(200).json(finalReturn);
}

