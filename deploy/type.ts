export type Config = {
  mint: {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints?: {
      percent: number;
    };
    printSupply?: {
      type: "Zero" | "Limited" | "Unlimited";
      limit?: [number | bigint];
    };
    creators?: {
      address: string;
      share: number;
      verified: boolean;
    }[];
  };
  metadata?: {
    mint: string;
    authority: string;
  };
};

export type Cache = {
  program: {
    candyMachine: string;
    candyGuard: string;
    candyMachineCreator: string;
    collectionMint: string;
  };
  items: {
    [key: string]: {
      name: string;
      image_hash: string;
      image_link: string;
      metadata_hash: string;
      metadata_link: string;
      onChain: boolean;
    };
  };
};
