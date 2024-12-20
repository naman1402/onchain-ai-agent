import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { Thread } from "openai/resources/beta/threads/threads.mjs";


/**
 * Creates a new run in the specified OpenAI thread.
 * Run is a single instance of executing the assistant's logic.
 * Workflow: receiving input, processing it, and generating an output.
 * In this function we wait for the run to go through different states like in_progress or queued.
 * @param client - The OpenAI client instance.
 * @param thread - The thread in which to create the run.
 * @param assistantId - The ID of the assistant to use for the run.
 * @returns The created run.
 */
export async function createRun(client: OpenAI, thread: Thread, assistantId: string): Promise<Run> {
    let run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
    })
    while(run.status === "in_progress" || run.status === "queued") {
        await new Promise(resolve => setTimeout(resolve, 1000))
        run = await client.beta.threads.runs.retrieve(thread.id, run.id)
    }
    return run;
}