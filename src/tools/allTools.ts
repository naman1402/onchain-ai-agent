import { getBalanceTool } from "./get_balance";

/**
 * Defines the configuration for a tool, including its definition and handler function.
 * The `ToolConfig` interface is used to describe the structure of a tool configuration object.
 * 
 * The `definition` property defines the metadata of the tool, including its type, name, description, and parameters.
 * The `handler` property is a function that implements the logic of the tool, taking in arguments of type `T` (default to any if no type is provided)
 * and returning a Promise that resolves to any value.
 */
export interface ToolConfig<T = any> {
    definition:{
        type: `function`;
        function: {
            name: string;
            description: string;
            parameters: {
                type: 'object';
                properties: Record<string, unknown>;
                required: string[];
            }
        }
    };
    handler: (args: T) => Promise<any>;
}


/**
 * Defines a collection of tool configurations, where the keys are the tool names and the values are the corresponding `ToolConfig` objects.
 * This object is exported so that it can be used to access and manage the available tools.
 * Record is used to create objects where keys and values have specific values
 * Record<KeyType, ValueType> => key (string) identifies a tool, and value (toolConfig) describes the tool's definition and handler.
 */
export const tools: Record<string,  ToolConfig> = {
    // add more tools
    get_balance: getBalanceTool
}