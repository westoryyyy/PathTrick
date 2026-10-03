import pathtrickSbtAbi from '../../integration/PathtrickSBT.abi.json';
import { bscTestnet } from 'viem/chains';
import type { Abi } from 'viem';

export const PATHTRICK_SBT_ADDRESS =
  (process.env.NEXT_PUBLIC_PATHTRICK_SBT_ADDRESS ||
    '0x39632892C33435a76043343Ef17Ac03124627ba9') as `0x${string}`;

export const BNB_TESTNET_CHAIN = bscTestnet;
export const PATHTRICK_SBT_ABI = pathtrickSbtAbi.abi as Abi;
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
