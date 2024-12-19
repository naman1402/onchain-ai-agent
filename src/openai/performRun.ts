import { error } from "console";
import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads/threads";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";

export async function performRun(run: Run, client: OpenAI, thread: Thread) {
    while(run.status === 'requires_action') {
        run = await handleRunCalls();
    }

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