import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants.mjs";
import { tools } from "../tools/allTools";

/// @dev Step 1

/**
 * Creates a new OpenAI assistant using the specified client.
 * Assitant is the core AI model that performs tasks. 
 * @param client - The OpenAI client to use for creating the assistant.
 * @returns A Promise that resolves to the created OpenAI assistant.
 */
export async function createAssistant(client: OpenAI): Promise<Assistant> {
    return await client.beta.assistants.create({
        model: "gpt-4o-mini",
        name: "My Assistant",
        instructions: `
            You are a helpful assistant. You are in control of a wallet that you can use to do whatever you want.
            You can use the following tools to help you:
            - get_balance: Get balance of the wallet
            - get_wallet_address: Get your own wallet address
            - send_transaction: Send a transaction to the wallet address
        `,
        tools: Object.values(tools).map(tool => tool.definition),   
    })
}