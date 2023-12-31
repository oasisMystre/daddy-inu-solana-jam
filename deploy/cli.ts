import { program } from "commander";
import { readFileSync } from "fs";

import  type { Cache } from "./type";
import { createMint, updateMint } from "./deploy";
import { initialize, loadConfigs, walkDirectory } from "./utils";

program
  .name("Big Daddy Inu (BDI) NFT Minter")
  .description(
    "Create and update Solana NFT data with just a single json config"
  )
  .version("1.0");

program
  .command("create")
  .requiredOption("--endpoint <string>", "solana rpc endpoint")
  .requiredOption("--keypair <string>", "solana wallet keypair secret")
  .requiredOption("--path <string>", "nft config directory or file")
  .action(async (options) => {
    const { keypair, path, endpoint } = options;
    console.log("Dinu initializing 💤");
    const dinu = initialize(keypair, endpoint);

    const configs = loadConfigs(walkDirectory(path));
    const promise = configs
      .filter(([config]) => config.metadata === undefined)
      .map((args) => createMint(dinu, ...args));
    console.log("minting 🗡....");

    await Promise.all(promise).catch(console.log);
    console.log("mint successful");
  });

program
  .command("update")
  .requiredOption("--endpoint <string>", "solana rpc endpoint")
  .requiredOption("--keypair <type>", "solana wallet keypair secret")
  .requiredOption("--path <string>", "nft pack config directory or file")
  .action(async (options) => {
    const { keypair, path, endpoint } = options;
    const dinu = initialize(keypair, endpoint);

    const configs = loadConfigs(walkDirectory(path));
    const promise = configs
      .filter(([config]) => config.metadata !== null)
      .map(([config]) => updateMint(dinu, config));

    await Promise.all(promise);
  });

program
  .command("update-candy-machine")
  .requiredOption("--endpoint <string>", "solana rpc endpoint")
  .requiredOption("--keypair <path>", "solana wallet keypair secret")
  .option("--address <string>", "candy machine addresss")
  .option("--itemsAvailable <number>", "candy machine available number")
  .action(async (options) => {
    let { keypair, endpoint, address, itemsAvailable } = options;
    if (!address) {
      const cacheFile = readFileSync("./cache.json", "utf-8");
      const cache: Cache = JSON.parse(cacheFile);
      address = cache.program.candyMachine;
    }

    const dinu = initialize(keypair, endpoint);
    console.log("updating candy machine 💤");

    await dinu.updateCandyMachine(address, {
      itemsAvailable,
    });

    console.log("candy machine update successfully ✅");
  });

program.parse();
