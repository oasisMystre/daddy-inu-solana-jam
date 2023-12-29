import { keypairIdentity } from "@metaplex-foundation/umi";

import DaddyInu from "../src/daddy_inu";

import { readdirSync, lstatSync, readFileSync, writeFileSync } from "fs";

import { Config } from "./type";
import { signerIdentity } from "@metaplex-foundation/umi";
import { createSignerFromKeypair } from "@metaplex-foundation/umi";

export const walkDirectory = function (path: string) {
  if (lstatSync(path).isFile()) return [path];

  const dir = readdirSync(path);
  const files: string[] = [];

  for (const path of dir) {
    if (lstatSync(path).isDirectory()) files.concat(walkDirectory(path));
    else files.push(path);
  }

  return files;
};

export const loadConfigs = function (paths: string[]) {
  const configs: [Config, (config: Config) => void][] = [];
  for (const path of paths) {
    const json = readFileSync(path, "utf-8");
    configs.push([
      JSON.parse(json),
      (value: Config) => writeFileSync(path, JSON.stringify(value, null, 2)),
    ]);
  }
  return configs;
};

export function initialize(path: string, endpoint: string) {
  const secret: number[] = JSON.parse(readFileSync(path, "utf-8"));

  const dinu = new DaddyInu(endpoint);
  const keypair = dinu.umi.eddsa.createKeypairFromSecretKey(
    Uint8Array.from(secret)
  );
  const umiSigner = createSignerFromKeypair(dinu.umi, keypair);
  dinu.umi.use(signerIdentity(umiSigner));

  return dinu;
}
