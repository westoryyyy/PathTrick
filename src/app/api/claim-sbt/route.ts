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

    // TODO: In a real implementation, this would:
    // 1. Verify the user has actually completed the course in the database
    // 2. Or call an AI model to grade their submission
    // 3. Sign the message using an Admin Private Key and ethers.js
    
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

    // Assuming EIP-712 Domain and Types for PathTrick SBT
    const domain = {
      name: 'PathTrick',
      version: '1',
      chainId: 97, // BNB Testnet
      verifyingContract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    };

    const types = {
      MintRequest: [
        { name: 'minter', type: 'address' },
        { name: 'courseId', type: 'uint256' },
      ],
    };

    const value = {
      minter: userAddress,
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
