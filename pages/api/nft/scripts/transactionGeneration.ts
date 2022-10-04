const fcl = require('@onflow/fcl');
const config = require('../../tools');

export async function get (network: string, collectionIdentifier:string) {
    config.setup(fcl, network);
    const cadence =  `
    import TransactionGeneration from 0xTransactionGeneration

    pub fun main(tx: String, collectionIdentifier: String) : String {
      return TransactionGeneration.getTx(tx: tx, params: {
          "collectionIdentifier": collectionIdentifier
      })!
    }`

    const txResp = await fcl.query({
        cadence: cadence,
        args: (arg :any, t : any) => [arg('CollectionInitialization', t.String), arg(collectionIdentifier, t.String)],
      });

    return txResp;

};
