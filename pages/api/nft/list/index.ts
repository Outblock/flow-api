import type { NextApiRequest, NextApiResponse } from 'next'
const collectionIds = require('../scripts/collectionIds');
const collectionIdList = require('../scripts/collectionIdList');
const utilities = require('../utilities');
const BN = require('bignumber.js')

const defaultOffset = 0;
const defaultLimit = 30;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {address, offset, limit} = req.query;
  const network = req.headers.network || req.query.network;
  const result = await collectionIds.get(address, network);
  const totalCount = Object.keys(result)
  .map((key) => result[key].length)
  .reduce((acc, item) => acc + item, 0);

  const flatMapResult = Object.keys(result).sort()
  .map((key) => result[key]
        .sort((a: string, b: string) => ( new BN(b) - new BN(a)))
        .map((item: string) => Object.assign({collection: key, id: item}))
  )
  .flatMap(item => item)

  const offsetInt = parseInt(offset as string) || defaultOffset
  const limitInt = parseInt(limit as string) || defaultLimit

  const sliced = flatMapResult.slice(offsetInt, offsetInt + limitInt)

  const paginated = sliced.reduce((acc, item) => {
    if (acc[item.collection] == null) {
      acc[item.collection] = []
    }
    acc[item.collection].push(item.id)
    return acc
  }, {})

  const format = Object.keys(paginated).map((key) => Object.assign({key: key, value: paginated[key]}))
  const nftResult = await collectionIdList.get(address, format, network)
  const nftList = Object.keys(nftResult).map((key) => nftResult[key]).flatMap(item => item)
  const list = nftList.map(utilities.nftMedia)

  const nftReturn = {
    nfts: list,
    nftCount: totalCount
  }
  const finalReturn = {
    data: nftReturn,
    status:200
  }
  res.status(200).json(finalReturn);
}
