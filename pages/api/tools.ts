const { send: httpSend }  = require('@onflow/transport-http');
import config from "./config.json";

export function setup(fcl: any, net: any) {
	if (net === 'testnet') {
		fcl.config()
		.put('sdk.transport', httpSend)
		.put("accessNode.api", config.AccessNode.testnet)
		.put("0xNonFungibleToken", '0x631e88ae7f1d7c20')
		.put("0xFungibleToken", '0x9a0766d93b6608b7')
		.put("0xMetadataViews", '0x631e88ae7f1d7c20')
		.put("0xNFTCatalog", '0x324c34e1c517e4db')
		.put("0xNFTRetrieval", '0x324c34e1c517e4db')
		.put('0xFind', '0xa16ab1d0abde3625')
		.put('0xFlowns', '0xb05b2abb42335e88')
		.put('0xDomains', '0xb05b2abb42335e88')
		.put('0xFlowToken', '0x7e60df042a9c0868')
		.put('0xFungibleToken', '0x9a0766d93b6608b7')
		.put("0xTransactionGeneration", '0x830c495357676f8b')
		.put('0xFlowFees', '0x912d5440f7e3769e')
		.put('0xStringUtils', '0x31ad40c07a2a9788')
		.put('flow.auditors', [
			'0xf78bfc12d0a786dc', // Flow
			'0x6c0d53c676256e8c'  // Emerald City
		  ])

	} else {
		fcl.config()
		.put('sdk.transport', httpSend)
		.put("accessNode.api", config.AccessNode.mainnet)
		.put("0xNonFungibleToken", '0x1d7e57aa55817448')
		.put("0xFungibleToken", '0xf233dcee88fe0abe')
		.put("0xMetadataViews", '0x1d7e57aa55817448')
		.put("0xNFTCatalog", '0x49a7cda3a1eecc29')
		.put("0xNFTRetrieval", '0x49a7cda3a1eecc29')
		.put('0xFind', '0x097bafa4e0b48eef')
		.put('0xFlowns', '0x233eb012d34b0070')
		.put('0xDomains', '0x233eb012d34b0070')
		.put('0xFlowFees', '0xf919ee77447b7497')
		.put('0xFlowToken', '0x1654653399040a61')
		.put("0xTransactionGeneration", '0xe52522745adf5c34')
		.put('0xStringUtils', '0xa340dc0a4ec828ab')
		.put('flow.auditors', [
			'0xfd100e39d50a13e6', // Flow
			'0x5643fd47a29770e7'  // Emerald City
		  ])
	}
}

