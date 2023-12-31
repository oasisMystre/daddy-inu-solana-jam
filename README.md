# Dinu-jam 

Big daddy Inu Open Source Utility for creating, minting and updating Solana Smart contract by just edit json file.


## Create & Mint 

To create and Mint a NFT 

```shell
dinu-jam create --endpoint=https://solana.devnet.com \
--path=./nft-pack \
--keypair=./my-key-pair.json
```

Update NFT 

update a single NFT pack

```shell
dinu-jam update --endpoint=https://solana.devnet.com \
--path=./nft-pack/dinu-pass.json \
--keypair=./my-key-pair.json
```

## Schema

Dinu-Jam Supported Schema for creating minting NFT

```ts
export type Config = {
  mint: {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints?: {
      percent: number;
    };
    printSupply?: {
      type: "Zero" | "Limited" | "Unlimited";
      limit?: [number | bigint];
    };
    creators?: {
      address: string;
      share: number;
      verified: boolean;
    }[];
  };
  metadata?: {
    mint: string;
    authority: string;
  };
};
```

## Candy machine 

When installing dinu-jam sugar is installed if not exist 

Check [sugar](https://developers.metaplex.com/candy-machine/sugar) documentation on how to use

## hiddenConfig
When using sugar you can set number for more than assets available you have to create multiple assets but hiddenConfig make life easier.

1. Set the hiddenConfig in sugar `config.json`
2. set number to zero 
3. then use dinu-jam to update itemAvailable using this command 

```bash
dinu-jam update-candy-machine \
--keypair=./keypair.json \
--endpoint=https://api.devnet.solana.com \
--itemsAvailable=10000
```

> You can increase candymachine items number by increasing itemsAvailable without having to create 10000 asset configs

## Milestone 

- [x] Create, Mint, Update multiple and single NFT config 
- [x] Support Metaplex candy machine 🚧🚧
- [ ] Faster update by diffing config files 🚧🚧

## Why not use sugar?

Not everyone want to have an extra useless binary on his/her machine.



## Need a smart contractor 

[phone](tel:+2349076931902)
[email](mailto:oasis.mystre@gmail.com)


## Buy me coffee

Solana address: 9N33s3cp6MVwuBCFtLLRcqNnYo6tcfMKQGvVFKWAswiD

Eth address: 0x2Cf8327F1b58788b13d41E11e63bCF8812C4AB8A

Polygon address:
0x2Cf8327F1b58788b13d41E11e63bCF8812C4AB8A
