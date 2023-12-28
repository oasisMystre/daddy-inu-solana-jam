/// Author Oguntunde Caleb Fiyinfoluwa <oasis.mystre@gmail.com>

import {
  Creator,
  Data,
  printSupply,
} from "@metaplex-foundation/mpl-token-metadata";

import type { Config } from "./type";
import DaddyInu from "../src/daddy_inu";
import { percentAmount } from "@metaplex-foundation/umi";
import { Amount } from "@metaplex-foundation/umi";
import { publicKey } from "@metaplex-foundation/umi";
import { some } from "@metaplex-foundation/umi";

const noops = (...args: any) => void 0;

/// pass in config and save to path
type Writer = (config: Config) => void;

export function loadMint(config: Config) {
  const { mint } = config;
  let _creators: Creator[] = [];
  let _printSupply: any = null;
  let _sellerFeeBasisPoints: Amount<"%", 2> = null;

  if (mint.printSupply) {
    switch (mint.printSupply.type) {
      case "Limited":
        _printSupply = printSupply(
          mint.printSupply.type,
          mint.printSupply.limit!
        );
      case "Unlimited":
        _printSupply = printSupply(mint.printSupply.type as "Unlimited");
      case "Zero":
        _printSupply = printSupply(mint.printSupply.type as "Zero");
    }
  }

  if (mint.sellerFeeBasisPoints) {
    _sellerFeeBasisPoints = percentAmount(mint.sellerFeeBasisPoints.percent);
  }

  if (mint.creators) {
    _creators = mint.creators.map((creator) => ({
      address: publicKey(creator.address),
      share: creator.share,
      verified: creator.verified,
    }));
  }

  return {
    name: mint.name,
    uri: mint.uri,
    symbol: mint.symbol,
    sellerFeeBasisPoints: _sellerFeeBasisPoints,
    printSupply: _printSupply,
    creators: _creators,
  };
}

export async function createMint(
  dinu: DaddyInu,
  config: Config,
  writer: Writer = noops
) {
  const [mintSigner, authoritySigner] = await dinu.createNFT(loadMint(config));

  config.metadata = {
    mint: mintSigner.publicKey,
    authority: authoritySigner.publicKey,
  };

  return writer(config);
}

export async function updateMint(dinu: DaddyInu, config: Config) {
  const { mint, metadata } = config;
  const updateMint = loadMint(config);

  const data: Data = {
    name: mint.name,
    symbol: mint.symbol,
    uri: mint.uri,
    sellerFeeBasisPoints: mint.sellerFeeBasisPoints.percent,
    creators: some(updateMint.creators),
  };

  await dinu.updateNFT(metadata.mint, { data });
}
