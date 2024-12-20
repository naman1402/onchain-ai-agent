import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { tools } from "../tools/allTools";

/**
 * Handles the execution of tool calls for a given run in an OpenAI thread.
 * This function is responsible for executing the required tool calls for a given run, handling any errors that may occur, and submitting the tool outputs back to the OpenAI client.
 * 
 * @param run - The run object containing the tool calls to be executed.
 * @param client - The OpenAI client instance used to interact with the OpenAI API.
 * @param thread - The thread object associated with the run.
 * @returns The updated run object with the tool outputs.
 */
export async function handleRunCalls(run: Run, client: OpenAI, thread: Thread): Promise<Run> {
    // assistant will know all the tools that are available
    const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls;
    if(!toolCalls) return run;

    // creates an array of promises that wil process all tool calls in parallel using Promise.all
    const toolOutputs = await Promise.all(toolCalls.map(async (tool) => {
        // this tools is from allTools.ts
        const toolConfig = tools[tool.function.name];
        if(!toolConfig) {
            console.error(`Tool ${tool.function.name} not found`);
            return null;
        }
        // Parse all function arguments to JSON, call the tool's handler with argument and return successful result with toolID and output
        try{
            const args = JSON.parse(tool.function.arguments);
            const output = await toolConfig.handler(args);
            return {
                tool_call_id: tool.id,
                output: String(output)
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                tool_call_id: tool.id,
                output: `Error: ${errorMessage}`
            };
        }
    }))

    const validOutputs = toolOutputs.filter(Boolean) as OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[];
    if(validOutputs.length === 0) {
        return run;
    }

    return client.beta.threads.runs.submitToolOutputsAndPoll(thread.id, run.id, {tool_outputs: validOutputs});

}