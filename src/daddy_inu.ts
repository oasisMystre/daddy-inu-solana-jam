/// Author: Oguntunde Caleb Fiyinfoluwa <oasis.mystre@gmail.com>
import {
  createNft,
  fetchMetadataFromSeeds,
  updateV1,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  addConfigLines,
  updateCandyMachine,
  fetchCandyMachine,
  fetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { generateSigner } from "@metaplex-foundation/umi";
import { publicKey } from "@metaplex-foundation/umi";

import BaseDaddyInuImpl from "./impl";

type NFTInput = Omit<Parameters<typeof createNft>[1], "mint" | "authority">;
type CandyMachineUpdateInput = Partial<
  Parameters<typeof updateCandyMachine>[1]["data"]
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

  async updateNFT(
    mintAddress: string,
    params: Omit<Parameters<typeof updateV1>[1], "mint">
  ) {
    const mint = publicKey(mintAddress);
    const initialMetadata = await fetchMetadataFromSeeds(this.umi, { mint });

    return updateV1(this.umi, {
      mint,
      ...params,
      data: { ...initialMetadata, ...params.data },
    }).sendAndConfirm(this.umi);
  }

  async fetchCandyMachine(address: string) {
    return fetchCandyMachine(this.umi, publicKey(address));
  }

  async updateCandyMachine(address: string, input: CandyMachineUpdateInput) {
    const candyMachine = await this.fetchCandyMachine(address);

    return (
      await updateCandyMachine(this.umi, {
        candyMachine: candyMachine.publicKey,
        data: {
          ...candyMachine.data,
          ...input,
        },
      })
    ).sendAndConfirm(this.umi);
  }
}
