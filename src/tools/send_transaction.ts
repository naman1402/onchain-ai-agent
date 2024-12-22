import { Address, parseEther } from "viem";
import { createViemWalletClient } from "../viem/createWalletClient";
import { ToolConfig } from "./allTools";

interface SendTransactionArgs {
    to: Address;
    amount?: string;
}

export const sendTransactionTool: ToolConfig<SendTransactionArgs> = {
    definition: {
        type: "function",
        function: {
            name: "send_transaction",
            description: "Send ETH to an address",
            parameters: {
                type: "object",
                properties: {
                    to: {
                        type: "string",
                        pattern: '0x[a-fA-F0-9]{40}$',
                        description: "The recipient address"
                    },
                    amount: {
                        type: "string",
                        description: "The amount to send in ETH",
                        optional: true
                    }
                },
                required: ["to"]
            }
        }
    },
    handler: async ({ to, amount }: SendTransactionArgs) => {
        try {
            const walletClient = await createViemWalletClient();
            const tx = await walletClient.sendTransaction({
                to,
                amount: amount ? parseEther(amount) : undefined
            });

            return tx;
        } catch (error) {
            console.error("Error sending transaction:", error);
            throw error;
        }
    }
}