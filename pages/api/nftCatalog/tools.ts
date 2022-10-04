const { send: httpSend }  = require('@onflow/transport-http');
import config from "./config.json";

export function setup(fcl: any, net: any) {
	if (net === 'testnet') {
		fcl.config().put('sdk.transport', httpSend);
		fcl.config().put("accessNode.api", config.AccessNode.testnet);
		fcl.config().put("0xNonFungibleToken", '0x631e88ae7f1d7c20');
		fcl.config().put("0xFungibleToken", '0x9a0766d93b6608b7');
		fcl.config().put("0xMetadataViews", '0x631e88ae7f1d7c20');
		fcl.config().put("0xNFTCatalog", '0x324c34e1c517e4db');
		fcl.config().put("0xNFTRetrieval", '0x324c34e1c517e4db');
		fcl.config().put("0xTransactionGeneration", '0x830c495357676f8b');
	} else {
		fcl.config().put('sdk.transport', httpSend);
		fcl.config().put("accessNode.api", config.AccessNode.mainnet);
		fcl.config().put("0xNonFungibleToken", '0x1d7e57aa55817448');
		fcl.config().put("0xFungibleToken", '0xf233dcee88fe0abe');
		fcl.config().put("0xMetadataViews", '0x1d7e57aa55817448');
		fcl.config().put("0xNFTCatalog", '0x49a7cda3a1eecc29');
		fcl.config().put("0xNFTRetrieval", '0x49a7cda3a1eecc29');
		fcl.config().put("0xTransactionGeneration", '0xe52522745adf5c34');
	}
}

