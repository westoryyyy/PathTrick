import { createPublicClient, http, Hex, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { bscTestnet } from "viem/chains";
import { env } from "../config/env";

if (!env.SIGNER_PRIVATE_KEY) {
  throw new Error("SIGNER_PRIVATE_KEY belum di-set di environment variables.");
}

// Signer account untuk EIP-712
export const signerAccount = privateKeyToAccount(env.SIGNER_PRIVATE_KEY as Hex);

// Public client untuk read-only contract calls (nonces, hasCertificate)
export const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http("https://bsc-testnet-rpc.publicnode.com"),
});

// Minimal ABI untuk fungsi yang kita butuhkan
const PATHTRICK_ABI = parseAbi([
  "function nonces(address user, uint256 courseId) view returns (uint256)",
  "function hasCertificate(address user, uint256 courseId) view returns (bool)",
]);

const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS as Hex;

/**
 * Baca nonce user untuk courseId tertentu dari contract.
 */
export async function getNonce(userAddress: string, courseId: bigint): Promise<bigint> {
  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: PATHTRICK_ABI,
    functionName: "nonces",
    args: [userAddress as Hex, courseId],
  }) as Promise<bigint>;
}

/**
 * Cek apakah user sudah punya sertifikat on-chain untuk courseId ini.
 */
export async function checkHasCertificate(userAddress: string, courseId: bigint): Promise<boolean> {
  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: PATHTRICK_ABI,
    functionName: "hasCertificate",
    args: [userAddress as Hex, courseId],
  }) as Promise<boolean>;
}

/**
 * Generate EIP-712 Signature untuk mintCertificate.
 * Sesuai dengan konfigurasi di PathtrickSBT.sol — sekarang include nonce & deadline.
 *
 * @param userAddress  Address dompet user yang akan menerima NFT
 * @param courseId     ID course (onChainId) — BigInt
 * @param nonce        Nonce user untuk courseId ini — dari contract.nonces()
 * @param deadline     Unix timestamp detik — signature expired setelah ini
 * @returns Hex string signature (0x...)
 */
export async function generateMintSignature(
  userAddress: string,
  courseId: bigint,
  nonce: bigint,
  deadline: bigint
): Promise<string> {
  const domain = {
    name: "PathtrickSBT",
    version: "1",
    chainId: BigInt(env.CHAIN_ID),
    verifyingContract: CONTRACT_ADDRESS,
  } as const;

  const types = {
    MintCertificate: [
      { name: "user", type: "address" },
      { name: "courseId", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  } as const;

  const message = {
    user: userAddress as Hex,
    courseId,
    nonce,
    deadline,
  };

  const signature = await signerAccount.signTypedData({
    domain,
    types,
    primaryType: "MintCertificate",
    message,
  });

  return signature;
}
