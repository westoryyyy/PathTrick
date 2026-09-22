import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseIdParam = searchParams.get('courseId');
    const userAddress = searchParams.get('address');

    if (!courseIdParam || !userAddress) {
      return NextResponse.json(
        { error: 'Missing courseId or address in query parameters' },
        { status: 400 }
      );
    }

    const courseId = parseInt(courseIdParam);

    // TODO: Di sinilah Backend Anda harus melakukan validasi ke Database!
    // Contoh:
    // const hasPassed = await db.checkUserCompletion(userAddress, courseId);
    // if (!hasPassed) throw new Error("Belum lulus ujian!");
    
    // Ambil data user dari Database (Mock Data untuk sekarang)
    const mockUserName = "Tukiman (Mock DB)";
    const mockCourseName = courseId === 1 ? "Blueprint Master" : "Web3 Starter";
    const completionDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // -------------------------------------------------------------
    // LOGIKA GENERATE EIP-712 SIGNATURE
    // -------------------------------------------------------------
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
    
    if (!adminPrivateKey) {
      console.warn("ADMIN_PRIVATE_KEY is missing. Returning fallback mock signature.");
      return NextResponse.json({
        userName: mockUserName,
        courseName: mockCourseName,
        courseId: courseId,
        completionDate: completionDate,
        signature: "0xMockSignature1234567890abcdef"
      });
    }

    const signer = new ethers.Wallet(adminPrivateKey);

    const domain = {
      name: 'PathTrick',
      version: '1',
      chainId: 97, // BNB Testnet Chain ID
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

    // Tanda tangani data secara kriptografis!
    const signature = await signer.signTypedData(domain, types, value);

    // Kembalikan response lengkap sesuai permintaan Frontend
    return NextResponse.json({
      userName: mockUserName,
      courseName: mockCourseName,
      courseId: courseId,
      completionDate: completionDate,
      signature: signature
    });
    
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
