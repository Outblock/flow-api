import type { NextApiRequest, NextApiResponse } from 'next'
const fcl = require('@onflow/fcl');
const config = require('../tools');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const cadence = req.body.cadence
    const network = req.body.network || req.query.network || 'mainnet'
    config.setup(fcl, network)
    const cadence_base64 = req.body.cadence_base64 || Buffer.from(cadence, 'utf8').toString('base64')

    const data = {
        cadence_base64: cadence_base64,
        network: network.toLowerCase()
    }

    const init = {
        method: 'POST',
        async: true,
        body: JSON.stringify(data),
        headers: {
        Network: network,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
    };

    const response = await fetch('https://flix.flow.com/v1/templates/search', init)
    var template = null
    try {
        template = await response.json();
    } catch {
        return res.status(200).json({
            status: 404,
            message: "No template found",
            data: {
                auditors: [],
                template: null
            }
        })
    }

    const auditorsResponse = await fetch(`https://flix.flow.com/v1/auditors?network=${network}`)
    const auditors = await auditorsResponse.json();

    fcl.config()
        .put('flow.auditors', auditors.map((item: { address: any; }) => item.address))

    const audits = await fcl.InteractionTemplateUtils
        .getInteractionTemplateAudits({
        template: template
        })

    const addresses = Object.keys(audits).filter(address => audits[address])

    if (addresses.length <= 0) {
        return res.status(200).json({
            status: 404,
            message: "Empty auditors",
            data: {
                auditors: [],
                template
            }
        })
    }

    const result = auditors.filter((item: any) => addresses.includes(item.address))

    if (result.length <= 0) {
        return res.status(200).json({
            status: 404,
            message: "No auditors found",
            data: {
                auditors: [],
                template
            }
        })
    }
    
    res.status(200).json({
        status: 200,
        message: "Query transaction template",
        data: {
            auditors: result,
            template
        }
    })
}
