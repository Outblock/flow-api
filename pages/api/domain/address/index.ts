import type { NextApiRequest, NextApiResponse } from 'next'
const fcl = require('@onflow/fcl');
const config = require('../../tools');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const network = req.body.network || req.query.network || 'mainnet'
    config.setup(fcl, network)
    var name = req.query.name as string;
    name = name.split('.')[0]

    const result = await fcl.query({
        cadence: `
        import FIND from 0xFind
        import Flowns from 0xFlowns
        import Domains from 0xDomains

        pub fun queryflowns(name: String, root: String) : Address? {
            let prefix = "0x"
            let rootHahsh = Flowns.hash(node: "", lable: root)
            let namehash = prefix.concat(Flowns.hash(node: rootHahsh, lable: name))
            var address = Domains.getRecords(namehash)
            return address
        }

        pub fun main(name: String) : {String: Address} {
            let dict: {String: Address} = {}
            if let find = FIND.status(name).owner {
                dict["find"] = find
            }

            if let fn = queryflowns(name: name, root: "fn") {
                dict["fn"] = fn
            }

            if let meow = queryflowns(name: name, root: "meow") {
                dict["meow"] = meow
            }

            return dict
        }
        `,
        args: (arg :any, t : any) => [arg(name, t.String)],
    })

    res.status(200).json({
        data: result,
        status: 200
    })
}