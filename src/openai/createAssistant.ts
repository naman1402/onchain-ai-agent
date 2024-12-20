import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants.mjs";

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
        instructions: `...`,
        tools: []
    })
}