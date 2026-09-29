import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.roleId !== 'string' || !['dreamer', 'chaser'].includes(body.roleId)) {
    return NextResponse.json({ error: 'roleId tidak valid.' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    roleId: body.roleId,
    mode: 'local-demo',
  });
}
