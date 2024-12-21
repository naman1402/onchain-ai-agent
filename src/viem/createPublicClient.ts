import { createPublicClient, http } from 'viem'
import { abstractTestnet } from 'viem/chains'

/**
 * Creates a new Viem public client instance.
 * Used for read-only interactions, it connects to a blockchain node (infura endpoint, alchemy rpc) and 
 * performs tasks like reading data, fetching logs, estimating gas, etc.
 * @returns A new Viem public client instance configured with the abstract testnet chain and HTTP transport.
 */
export function createViemPublicClient() {
    return createPublicClient({
        chain: abstractTestnet,
        transport: http()
    })
}