import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userAddress, courseId } = await request.json();

    if (!userAddress || courseId === undefined) {
      return NextResponse.json(
        { error: 'Missing userAddress or courseId' },
        { status: 400 }
      );
    }

    // =========================================================================
    // SECURITY TODO: In a REAL production environment connected to a database,
    // this API must verify the user's completion status BEFORE signing.
    // Right now, any user calling this API gets a signature.
    // 
    // Example pseudocode for future implementation:
    // 
    // const userProgress = await db.collection('progress').findOne({ wallet: userAddress });
    // if (!userProgress || !userProgress.completedModules.includes(courseId)) {
    //   return NextResponse.json({ error: 'Misi belum tamat / Progress tidak valid.' }, { status: 403 });
    // }
    // =========================================================================
    
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
    
    if (!adminPrivateKey) {
      // Return a mock signature for demo purposes if no key is provided
      const mockSignature = "0x" + "00".repeat(65);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({
        success: true,
        signature: mockSignature,
        message: "No admin key found. Returning mock signature."
      });
    }

    const { ethers } = require('ethers');
    const signer = new ethers.Wallet(adminPrivateKey);

    // EIP-712 Domain - MUST match the deployed contract exactly
    // Verified via: cast call ... "eip712Domain()" => name: "PathtrickSBT", version: "1", chainId: 97
    const domain = {
      name: 'PathtrickSBT',
      version: '1',
      chainId: 97, // BNB Testnet
      verifyingContract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    };

    // EIP-712 Types - MUST match exactly:
    // Contract line 37: keccak256("MintCertificate(address user,uint256 courseId)")
    // Contract line 98: keccak256(abi.encode(MINT_TYPEHASH, msg.sender, courseId))
    const types = {
      MintCertificate: [
        { name: 'user', type: 'address' },
        { name: 'courseId', type: 'uint256' },
      ],
    };

    const value = {
      user: userAddress,
      courseId: courseId,
    };

    const signature = await signer.signTypedData(domain, types, value);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      signature: signature,
      message: "AI has verified your Boss Fight! You are cleared to mint."
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
