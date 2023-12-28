import { Umi } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";

export default class BaseDaddyInuImpl {
  public readonly umi: Umi;

  constructor(endpoint: string | Umi) {
    if (typeof endpoint === "string") this.umi = createUmi(endpoint);
    else this.umi = endpoint;

    this.umi.use(mplCandyMachine()).use(mplCandyMachine());
  }
}
