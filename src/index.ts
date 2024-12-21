import OpenAi, { OpenAI } from "openai";
import { createAssistant } from "./openai/createAssistant";
import { createThread } from "./openai/createThread";
import { createRun } from "./openai/createRun";
import "dotenv/config";
import { performRun } from "./openai/performRun";

async function main() {
    
    const message = "Hello, My Assistant. Can you tell me that balance of this wallet address 0xc232baceb4f642b5acc96529c7Af7dE73d638C28"
    const client = new OpenAI();
    const assistant = await createAssistant(client)
    const thread = await createThread(client, message);
    const run = await createRun(client, thread, assistant.id);
    const output = await performRun(run, client, thread);
    console.log(output);
}

main() 