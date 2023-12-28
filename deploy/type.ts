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
