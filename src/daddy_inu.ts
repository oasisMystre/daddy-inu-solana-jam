/// Author: Oguntunde Caleb Fiyinfoluwa <oasis.mystre@gmail.com>

import {
  addConfigLines,
  CandyGuard,
  CandyMachine,
  ConfigLine,
  updateCandyGuard,
  DefaultGuardSetArgs,
} from "@metaplex-foundation/mpl-candy-machine";

import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { create } from "@metaplex-foundation/mpl-candy-machine";
import { generateSigner, some } from "@metaplex-foundation/umi";
import { publicKey } from "@metaplex-foundation/umi";

import BaseDaddyInuImpl from "./impl";

type NFTInput = Omit<Parameters<typeof createNft>[1], "mint" | "authority">;
type CreateInput = Omit<
  Parameters<typeof create>[1],
  | "candyMachine"
  | "collectionMint"
  | "tokenStandard"
  | "collectionUpdateAuthority"
>;

export default class DaddyInu extends BaseDaddyInuImpl {
  async createNFT(nftInput: NFTInput) {
    const mint = generateSigner(this.umi);
    const authority = generateSigner(this.umi);

    await createNft(this.umi, {
      mint,
      authority,
      ...nftInput,
    }).sendAndConfirm(this.umi);

    return [mint, authority];
  }

  async createCandyMachine(
    [mint, authority]: Awaited<ReturnType<typeof this.createNFT>>,
    createInput: CreateInput
  ) {
    const candyMachine = generateSigner(this.umi);
    await (
      await create(this.umi, {
        candyMachine,
        authority: mint.publicKey,
        collectionMint: mint.publicKey,
        collectionUpdateAuthority: authority,
        tokenStandard: TokenStandard.NonFungible,
        ...createInput,
        creators: [
          {
            address: this.umi.identity.publicKey,
            verified: true,
            percentageShare: 1,
          },
          ...createInput.creators,
        ],
        configLineSettings: some({
          prefixName: "",
          prefixUri: "",
          nameLength: 8,
          uriLength: 32,
          isSequential: true,
          ...createInput.configLineSettings,
        }),
      })
    )
    .sendAndConfirm(this.umi);

    return candyMachine;
  }

  insertNFTItems(
    candyMachine: CandyMachine,
    items: ConfigLine[],
    index?: number
  ) {
    return addConfigLines(this.umi, {
      candyMachine: publicKey(candyMachine.publicKey),
      index: index ?? candyMachine.itemsLoaded,
      configLines: items,
    }).sendAndConfirm(this.umi);
  }

  updateCandyGuards(
    candyGuard: CandyGuard,
    guards: Partial<DefaultGuardSetArgs>
  ) {
    return updateCandyGuard(this.umi, {
      candyGuard: candyGuard.publicKey,
      guards: {
        ...candyGuard.guards,
        ...guards,
      },
      groups: candyGuard.groups,
    });
  }
}
