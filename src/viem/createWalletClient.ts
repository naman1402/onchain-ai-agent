import { Address, createWalletClient, custom, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abstractTestnet } from "viem/chains";
import "dotenv/config";
import { eip712WalletActions } from "viem/zksync";

/**
 * Creates a Viem wallet client with a private key-derived account, configured for the abstract testnet chain and using the HTTP transport.
 * used for read-write interactions, where user's private key is required to sign transactions. 
 * Used in scenarios where user authentication and authorization are required.
 * The wallet client is extended with the EIP-712 wallet actions. (For ZkSync chain)
 * EIP-712 is a standard for typed structured data signing.
 * zkSync incorporates account abstraction and features like meta-transactions, paymasters and permit-based token approvals. These features often rely on EIP-712 
 * for structured data signing.
 * @returns {Promise<WalletClient>} A Viem wallet client instance.
 */
export function createViemWalletClient() {

    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
    return createWalletClient({
        account,
        chain: abstractTestnet,
        transport: http()
    }).extend(eip712WalletActions())
}