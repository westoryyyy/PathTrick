import pathtrickSbtAbi from '../../integration/PathtrickSBT.abi.json';
import { bscTestnet } from 'viem/chains';
import type { Abi } from 'viem';

export const PATHTRICK_SBT_ADDRESS =
  (process.env.NEXT_PUBLIC_PATHTRICK_SBT_ADDRESS ||
    '0x39632892C33435a76043343Ef17Ac03124627ba9') as `0x${string}`;

export const BNB_TESTNET_CHAIN = bscTestnet;
export const PATHTRICK_SBT_ABI = pathtrickSbtAbi.abi as Abi;
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');

/**
 * Whether the client may continue onboarding when the roles API is unavailable.
 * This is intentionally opt-in for production builds unless the public flag is
 * explicitly enabled.
 */
export function isLocalRoleFallbackEnabled(): boolean {
  const configured = process.env.NEXT_PUBLIC_ALLOW_LOCAL_ROLE_FALLBACK;
  if (configured !== undefined) return configured.toLowerCase() === 'true';

  return process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_APP_ENV === 'demo';
}

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
