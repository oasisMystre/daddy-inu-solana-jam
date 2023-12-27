/// Author: Oguntunde Caleb Fiyinfoluwa <oasis.mystre@gmail.com>

import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import {
  CandyGuard,
  CandyMachine,
  fetchCandyGuard,
  fetchCandyMachine,
  mintV2,
} from "@metaplex-foundation/mpl-candy-machine";
import {
  createUmi,
  transactionBuilder,
  generateSigner,
  publicKey,
} from "@metaplex-foundation/umi";
import BaseDaddyInuImpl from "./impl";

type MintNFTOptionInput = Omit<
  Parameters<typeof mintV2>[1],
  | "nftMint"
  | "candyMachine"
  | "collectionMint"
  | "collectionAuthority"
  | "tokenStandard"
>;

export default class DaddyInuMinter extends BaseDaddyInuImpl {
  constructor() {
    super(createUmi());
  }

  async mintNFT(
    candyMachineAndGuard: [CandyMachine, CandyGuard],
    input?: MintNFTOptionInput
  ) {
    const nftMint = generateSigner(this.umi);
    const [candyMachine, candyGuard] = candyMachineAndGuard;

    return await transactionBuilder()
      .add(setComputeUnitLimit(this.umi, { units: 800_000 }))
      .add(
        mintV2(this.umi, {
          nftMint,
          candyGuard: candyGuard.publicKey,
          candyMachine: candyMachine.publicKey,
          collectionMint: candyMachine.collectionMint,
          collectionUpdateAuthority: candyMachine.authority,
          tokenStandard: candyMachine.tokenStandard,
          ...input,
        })
      )
      .sendAndConfirm(this.umi);
  }
}
