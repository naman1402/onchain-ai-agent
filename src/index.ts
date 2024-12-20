import OpenAi, { OpenAI } from "openai";
import { createAssistant } from "./openai/createAssistant";
import { createThread } from "./openai/createThread";
import { createRun } from "./openai/createRun";

async function main() {
    
    const message = "Hello, My Assistant"
    const client = new OpenAI();
    const assistant = await createAssistant(client)
    const thread = await createThread(client, message);
    const run = await createRun(client, thread, assistant.id);
    console.log("hello world")
}

main() 