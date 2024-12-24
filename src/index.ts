import { OpenAI } from "openai";
import { createAssistant } from "./openai/createAssistant";
import { createThread } from "./openai/createThread";
import { createRun } from "./openai/createRun";
import "dotenv/config";
import { performRun } from "./openai/performRun";
import { createInterface } from "node:readline";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { Assistant } from "openai/resources/beta/assistants.mjs";


/**
 * Creates a new OpenAI client instance.
 */
const client = new OpenAI();

/**
 * Creates a readline interface for reading user input from the console.
 * Enables the creation of a simple CLI-based chat interface.
 */
const r1 = createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Prompts the user with the given query and returns their input as a Promise.
 * Wraps r1.question in a Promise
 * @param query - The question to ask the user.
 * @returns A Promise that resolves with the user's input.
 */
const question = (query: string): Promise<string> => {
    return new Promise((resolve) => r1.question(query, resolve))
}


/**
 * Handles the chat interaction between the user and the AI assistant.
 * @param thread - The OpenAI thread object to use for the chat.
 * @param assistant - The OpenAI assistant object to use for the chat.
 * @returns A Promise that resolves when the chat is complete.
 */
async function chat(thread: Thread, assistant: Assistant): Promise<void> {
    while(true) {
        const userInput = await question("\nYou: ");
        if(userInput.toLowerCase() ===  "exit") {
            r1.close();
            break;
        }

        try {
            // Adds user's message to the conversation thread
            await client.beta.threads.messages.create(thread.id, {
                role: "user",
                content: userInput
            })
            // Perform AI run
            const run = await createRun(client, thread, assistant.id)
            const result = await performRun(run, client, thread)
            // If the assistant's response is text, print it out
            if(result?.type === 'text') {
                console.log("\nAlt: ", result.text.value)
            }

        } catch (error) {
            console.error("error during chat: ", error instanceof Error ? error.message : 'unknown error');
            r1.close();
            break;
        }
    }
}

/**
 * Starts the main chat loop, creating an OpenAI assistant and thread, and handling the chat interaction between the user and the assistant.
 * This function is the entry point for the application.
 */
async function main() {
    try {
        const assistant = await createAssistant(client);
        const thread = await createThread(client);
        console.log("chat has started, type exit to exit");
        await chat(thread, assistant);
    } catch (error) {
        console.error("error during main: ", error instanceof Error ? error.message : 'unknown error');
        r1.close();
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("error during main: ", error instanceof Error ? error.message : 'unknown error');
    process.exit(1);
})