import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/dbConnection/dbConnection";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/mailSender";
export async function POST(request:NextRequest){
    await dbConnection();
    try {
    
        const { username, email, password } = await request.json();
    
        const existingVerifiedUserByUsername = await User.findOne({
          username,
          isVerified: true,
        });
    
        if (existingVerifiedUserByUsername) {
          return Response.json(
            {
              success: false,
              message: 'Username is already taken',
            },
            { status: 400 }
          );
        }
    
        const existingUserByEmail = await User.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        let userId;
        if (existingUserByEmail) {
          if (existingUserByEmail.isVerified) {        
            return NextResponse.json(
              {
                success: false,
                message: 'User already exists with this email',
              },
              { status: 400 }
            );
          } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
            userId = existingUserByEmail._id;
          }
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 1);
    
          const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            expiryTimeOTP: expiryDate,
            isVerified: false,
          });
    
          await newUser.save();
          userId = newUser._id;
        }
    
        // Send verification email
        const emailResponse = await sendVerificationEmail(
          email,
          username,
          verifyCode
        );
        if (!emailResponse.success) {
          return Response.json(
            {
              success: false,
              message: emailResponse.message,
            },
            { status: 500 }
          );
        }
    
        return Response.json(
          {
            success: true,
            message: 'User registered successfully. Please verify your account.',
            _id: existingUserByEmail?._id || userId,
          },
          { status: 201 }
        );
      } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
          {
            success: false,
            message: 'Error registering user',
          },
          { status: 500 }
        );
      }
    }