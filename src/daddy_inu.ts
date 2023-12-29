/// Author: Oguntunde Caleb Fiyinfoluwa <oasis.mystre@gmail.com>
import {
  createNft,
  fetchMetadataFromSeeds,
  updateV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner } from "@metaplex-foundation/umi";
import { publicKey } from "@metaplex-foundation/umi";

import BaseDaddyInuImpl from "./impl";

type NFTInput = Omit<Parameters<typeof createNft>[1], "mint" | "authority">;

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
}
