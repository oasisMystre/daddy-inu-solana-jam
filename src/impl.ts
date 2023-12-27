import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey, Umi } from "@metaplex-foundation/umi";
import {
  fetchCandyMachine,
  fetchCandyGuard,
  mplCandyMachine,
  CandyGuard,
  CandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";

export default class BaseDaddyInuImpl {
  public readonly umi: Umi;

  constructor(endpoint: string | Umi) {
    if (typeof endpoint === "string") this.umi = createUmi(endpoint);
    else this.umi = endpoint;

    this.umi.use(mplCandyMachine()).use(mplCandyMachine());
  }

  async fetchCandyMachineAndGuard(
    candyMachineAddress: string
  ): Promise<[CandyMachine, CandyGuard]> {
    const candyMachine = await fetchCandyMachine(
      this.umi,
      publicKey(candyMachineAddress)
    );

    const candyGuard = await fetchCandyGuard(
      this.umi,
      candyMachine.mintAuthority
    );

    return [candyMachine, candyGuard];
  }
}
