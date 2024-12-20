import { error } from "console";
import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads/threads";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { handleRunCalls } from "./handleRun";

/**
 * Performs a run in the OpenAI API, handling any required actions and returning the result.
 * After the run is borught into action, this function will perform the action of the run, if no action are required we will return the result of the run or error message if failed
 * @param run - The OpenAI Run object representing the current run.
 * @param client - The OpenAI client instance.
 * @param thread - The OpenAI Thread object associated with the run.
 * @returns The result of the run, which may be an error message or the assistant's response.
 */
export async function performRun(run: Run, client: OpenAI, thread: Thread) {

    // Loops will continue as long as the run requires actions (function calls)
    while(run.status === 'requires_action') {
        run = await handleRunCalls(run, client, thread);
    }
    // In case of failure, return an error message
    if(run.status === 'failed') {
        const errorMessage = `encountered an error: ${run.last_error?.message || 'unknown error'}`;
        console.error("run failed: ", run.last_error)
        await client.beta.threads.messages.create(thread.id, {
            role: "user",
            content: errorMessage
        })
        return {
            type: 'text',
            text: {
                value: errorMessage,
                annotations: []
            }
        }
    }

    // Find the latest message from assistant and return its content, or return a default "no response" message
    const messages = await client.beta.threads.messages.list(thread.id)
    const assistantMessage = messages.data.find(message => message.role === 'assistant')
    return assistantMessage?.content[0] || 
        {type: 'text',
            text: {
                value: 'No response from assistant',
                annotations: []
            }
        }
}