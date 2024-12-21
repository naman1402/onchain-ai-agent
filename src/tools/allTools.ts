import { getBalanceTool } from "./get_balance";

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


export const tools: Record<string,  ToolConfig> = {
    // add more tools, 
    get_balance: getBalanceTool
}