import { program } from "commander";
import { readFileSync } from "fs";
import { keypairIdentity } from "@metaplex-foundation/umi";

import DaddyInu from "../src/daddy_inu";
import { createMint, updateMint } from "./deploy";
import { loadConfigs, walkDirectory } from "./utils";

function initialize(path: string, endpoint: string) {
  const keypair = readFileSync(path);

  const dinu = new DaddyInu(endpoint);
  const wallet = dinu.umi.eddsa.createKeypairFromSeed(keypair);
  dinu.umi.use(keypairIdentity(wallet));

  return dinu;
}

program
  .name("Big Daddy Inu (BDI) NFT Mintter")
  .description(
    "Create and update Solana NFT data with just a single json config"
  )
  .version("1.0");

program
  .command("create")
  .requiredOption("--enpoint <string>", "solana rpc endpoint")
  .requiredOption("--keypair <string>", "solana wallet keypair secret")
  .requiredOption("--path <string>", "nft config directory or file")
  .action(async (options) => {
    const { keypair, path, endpoint } = options;
    const dinu = initialize(keypair, endpoint);

    const configs = loadConfigs(walkDirectory(path));
    const promise = configs
      .filter(([config]) => config.metadata === null)
      .map((args) => createMint(dinu, ...args));

    await Promise.all(promise);
  });

program
  .command("create")
  .requiredOption("--enpoint <string>", "solana rpc endpoint")
  .requiredOption("--keypair <type>", "solana wallet keypair secret")
  .option("--path <string>", "nft pack config directory or file")
  .action(async (options) => {
    const { keypair, path, endpoint } = options;
    const dinu = initialize(keypair, endpoint);

    const configs = loadConfigs(walkDirectory(path));
    const promise = configs
      .filter(([config]) => config.metadata !== null)
      .map(([config]) => updateMint(dinu, config));

    await Promise.all(promise);
  });

program.parse();
