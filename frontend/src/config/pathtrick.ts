import pathtrickSbtAbi from '../../integration/PathtrickSBT.abi.json';
import { bscTestnet } from 'viem/chains';
import type { Abi } from 'viem';

export const PATHTRICK_SBT_ADDRESS =
  (process.env.NEXT_PUBLIC_PATHTRICK_SBT_ADDRESS ||
    '0x39632892C33435a76043343Ef17Ac03124627ba9') as `0x${string}`;

export const BNB_TESTNET_CHAIN = bscTestnet;
export const PATHTRICK_SBT_ABI = pathtrickSbtAbi.abi as Abi;

export const BNB_TESTNET_RPC_URLS: string[] = [
  process.env.NEXT_PUBLIC_BNB_TESTNET_RPC_URL,
  'https://data-seed-prebsc-1-s1.binance.org:8545',
  'https://data-seed-prebsc-2-s1.binance.org:8545'
].filter((u): u is string => Boolean(u));

/** JSON-RPC call that tries each RPC endpoint until one succeeds. */
export async function rpcCall(method: string, params: unknown[]): Promise<string> {
  let lastError: unknown;
  for (const url of BNB_TESTNET_RPC_URLS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      });
      const data = await res.json();
      if (typeof data?.result === 'string') return data.result;
      lastError = data?.error;
    } catch (e) {
      lastError = e;
    }
  }
  throw new Error(`All RPC endpoints failed: ${JSON.stringify(lastError)}`);
}
function normalizeApiBaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.replace(/\/api\/?$/, '');

  // Windows browsers sometimes resolve localhost to ::1 while the backend
  // is only listening on IPv4. Normalize localhost to 127.0.0.1 so client
  // fetches do not fail with a network TypeError.
  return trimmed.replace(/^http:\/\/localhost(?::\d+)?/, (match) => match.replace('localhost', '127.0.0.1'));
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_USE_MOCK_BACKEND === 'true'
    ? ''
    : normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL || '');

export async function readApiResponse(response: Response): Promise<Record<string, unknown> | unknown[]> {
  const text = await response.text();
  try {
    return JSON.parse(text) as Record<string, unknown> | unknown[];
  } catch {
    throw new Error(
      response.status === 404
        ? 'Backend API tidak ditemukan. Pastikan NEXT_PUBLIC_API_URL mengarah ke backend.'
        : `Backend mengembalikan respons yang tidak valid (HTTP ${response.status}).`
    );
  }
}

export function getApiError(data: Record<string, unknown> | unknown[], fallback: string): string {
  if (!Array.isArray(data) && typeof data.error === 'string') return data.error;
  return fallback;
}
