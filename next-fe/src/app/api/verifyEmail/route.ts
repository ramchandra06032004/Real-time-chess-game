import { NextResponse } from 'next/server';
import dbConnection from '@/dbConnection/dbConnection';
import User from '@/models/userModel';

export async function POST(request: Request) {
  await dbConnection();

  try {
    const { _id, code } = await request.json();

    if (!_id || !code) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    const decodedID = decodeURIComponent(_id);
    const user = await User.findOne({ _id: decodedID });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.expiryTimeOTP) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return NextResponse.json({ success: true, message: 'Account verified successfully' }, { status: 200 });
    } else if (!isCodeNotExpired) {
      return NextResponse.json({ success: false, message: 'Verification code has expired. Please sign up again to get a new code.' }, { status: 400 });
    } else {
      return NextResponse.json({ success: false, message: 'Incorrect verification code' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error verifying user:', error);
    return NextResponse.json({ success: false, message: 'Error verifying user' }, { status: 500 });
  }
}