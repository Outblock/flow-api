import type { NextApiRequest, NextApiResponse } from 'next'
const fcl = require('@onflow/fcl');
const config = require('../tools');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const network = req.body.network || req.query.network || 'mainnet'
    config.setup(fcl, network)
    var address = req.query.address;

    const result = await fcl.query({
        cadence: `
        import FIND from 0xFind
        import Domains from 0xDomains
        import StringUtils from 0xStringUtils

        pub fun queryDomain(address: Address): [String] {
            let account = getAccount(address)
            let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath)
            
            let domains:[String] = []

            if let collection = collectionCap.borrow() {
                let ids = collection.getIDs()
                for id in ids {
                    let domain = collection.borrowDomain(id: id)
                    let detail = domain.getDetail().name
                    domains.append(detail)
                }
                return domains
            }

            return []
        }

        pub fun main(address: Address) : {String : [String]} {
            let dict: {String : [String]} = {}

            if let name = FIND.reverseLookup(address) {
                dict["find"] = [name]
            }

            let fns = queryDomain(address: address)
            if fns.length > 0 {
                dict["fn"] = []
                dict["meow"] = []
                for fn in fns {
                    let result = StringUtils.split(str: fn, delimiter: ".")
                    let name = result[0]
                    let parent = result[1]
                    dict[parent]!.append(name)
                }
            }

            return dict
        }
        `,
        args: (arg :any, t : any) => [arg(address, t.Address)],
    })

    res.status(200).json({
        data: result,
        status: 200
    })
}