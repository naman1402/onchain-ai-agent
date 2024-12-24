import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads/threads.mjs";

/// @dev Step 2

/**
 * Creates a new thread in the OpenAI API and adds an initial message to it.
 * Thread is a sequence of interactions between user and assistant.
 * Each message contributes to the context, making it easier to handle multi-step or complex interactions. 
 * @param client - The OpenAI API client instance.
 * @param message - The initial message to be added to the new thread.
 * @returns The newly created thread.
 */
export async function createThread(client: OpenAI, message?: string): Promise<Thread> {
    const thread = await client.beta.threads.create()

    if (message) {
        await client.beta.threads.messages.create(thread.id, {
            role: "user",
            content: message
        })
    }

    return thread;
}