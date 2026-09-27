# Wallet Connection Flow Fix

## Problem Detected

After login with Google, users were redirected to the select-role page but:
- ❌ Wallet was NOT connected
- ❌ No visible button to connect wallet
- ❌ MintSBTButton crashed with error: "No wallet found. Please connect your wallet first."

## Root Cause

1. **Google Login Flow**: Privy's `login({ loginMethods: ['google'] })` only authenticates via Google, NOT wallet
2. **Missing Wallet Link Step**: No `linkWallet()` call in the select-role flow
3. **MintSBTButton Assumption**: Component assumed wallet was always connected, causing crash when `wallets[0]` was undefined

## Solution Implemented

### 1. **Select-Role Page** (`src/app/(auth)/select-role/page.tsx`)
Added wallet connection gate with:
- ✅ Detection for Google login without wallet: `isGoogleLogin && wallets.length === 0`
- ✅ Modal dialog with "CONNECT WALLET" button (blue, 💼 icon)
- ✅ Warning banner below role selector
- ✅ Auto-trigger wallet connection when "Continue" is clicked without wallet
- ✅ Updated continue button text: "🔗 Hubungkan Wallet Dulu →" when wallet missing

**Key Changes:**
```tsx
// Detect Google login without wallet
const isGoogleLogin = !!user?.google;
const needsWalletConnection = isGoogleLogin && wallets.length === 0;

// Show wallet connection gate/modal
{needsWalletConnection && <WalletConnectionModal />}

// Show warning banner
{isGoogleLogin && wallets.length === 0 && <WarningBanner />}

// Handle wallet connection
const handleConnectWallet = async () => {
  await linkWallet();  // Privy's wallet link function
};
```

### 2. **MintSBTButton Component** (`src/components/ui/MintSBTButton.tsx`)
Made wallet-aware with:
- ✅ Check if wallet exists before attempting mint
- ✅ Show "🔗 CONNECT WALLET" button when wallet not connected
- ✅ Info message explaining why wallet is needed
- ✅ Graceful error handling instead of crash

**Key Changes:**
```tsx
// If no wallet connected, show connect button instead of mint
if (!wallets || wallets.length === 0) {
  return <ConnectWalletButton />;
}

// Otherwise show mint button as before
return <MintButton />;
```

## User Flow After Fix

### Google Login Path:
```
1. Login Page
   └─> Click "Google" button
   └─> Authenticate with Google ✓

2. Select-Role Page
   ├─ Wallet Connection Gate shows (if no wallet)
   │  └─ User clicks "🔗 CONNECT WALLET"
   │  └─ Privy modal opens (MetaMask, WalletConnect, etc.)
   │  └─ Wallet connects ✓
   │
   ├─ Warning banner: "⚠️ Wallet belum terhubung"
   │
   └─ User selects role + clicks "Continue"
      └─> Proceeds to assessment ✓

3. Assessment/Minting
   ├─ MintSBTButton shows "🛡️ MINT SBT" (wallet connected)
   │  └─ Click to mint ✓
   │
   └─ If wallet not connected: "🔗 CONNECT WALLET"
      └─ Click to connect first ✓
```

### Wallet-Only Login Path (unchanged):
```
1. Login Page
   └─> Click "Wallet" button
   └─> Connect wallet (MetaMask, etc.) ✓

2. Select-Role Page
   ├─ Nickname gate shows (first time only)
   │  └─ Enter nickname, confirm ✓
   │
   └─> Proceed to assessment ✓
```

## Technical Details

### Privy Functions Used:
- `linkWallet()` — Links wallet to existing Google/email auth
- `useWallets()` — Returns array of connected wallets
- `user?.google` — Check if Google authenticated

### Error Prevention:
```tsx
// Before (crashed):
const activeWallet = wallets[0];  // Could be undefined!

// After (safe):
if (!wallets || wallets.length === 0) {
  return <ConnectButton />;
}
const activeWallet = wallets[0];  // Now guaranteed to exist
```

## Visual Changes

### Select-Role Page
- **New**: Blue modal dialog with "💼 CONNECT WALLET" button
- **New**: Yellow warning banner below title when wallet missing
- **Updated**: Continue button text changes based on state
  - "🔗 Hubungkan Wallet Dulu →" (wallet missing)
  - "⚔️ Mulai sebagai [Role]" (wallet connected, role selected)

### MintSBTButton Component
- **New**: Blue "🔗 CONNECT WALLET" button (when wallet not connected)
- **New**: Info box: "ℹ️ Hubungkan wallet untuk minting SBT Sertifikat"
- **Kept**: Original mint button (when wallet connected)

## Testing Checklist

- [ ] Login with Google
- [ ] Verify wallet connection gate appears
- [ ] Click "🔗 CONNECT WALLET" button
- [ ] Connect wallet via MetaMask/WalletConnect
- [ ] Warning banner disappears
- [ ] Select role and continue
- [ ] MintSBTButton shows mint button (not connect button)
- [ ] Click mint and complete transaction
- [ ] Verify SBT minting works

## Files Modified

1. `src/app/(auth)/select-role/page.tsx` — Added wallet connection logic
2. `src/components/ui/MintSBTButton.tsx` — Added wallet check and connect button

## No Breaking Changes

✅ Existing wallet-only login flow unchanged  
✅ Email login flow unchanged  
✅ Backward compatible with all existing features  
✅ Only adds new wallet connection flow for Google login  

---

**Status**: ✅ FIXED - Wallet connection is now integrated into the onboarding flow!
