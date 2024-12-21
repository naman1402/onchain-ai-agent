import { Address, parseEther } from "viem";
import { createViemWalletClient } from "../viem/createWalletClient";
import { ToolConfig } from "./allTools";

interface SendTransactionArgs {
    to: Address;
    amount?: string;
}

export const sendTransactionTool: ToolConfig<SendTransactionArgs> = {}