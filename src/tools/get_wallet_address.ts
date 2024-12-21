import { Address } from "viem";
import { createViemWalletClient } from "../viem/createWalletClient";
import { ToolConfig } from "../tools/allTools";

interface GetWalletAddressArgs {}

export const getWalletAddressTool: ToolConfig<GetWalletAddressArgs> = {
    definition: {
        type: "function",
        function: {
            name: "get_wallet_address",
            description: "Get the connected wallet address",
            parameters: {
                type: "object",
                properties: {},
                required: []
            }
        }
    },
    handler: async () => {
        return await getWalletAddress();
    }
}

async function getWalletAddress(): Promise<Address> {
    const walletClient = await createViemWalletClient();
    const [address] = await walletClient.getAddresses();
    return address;
}