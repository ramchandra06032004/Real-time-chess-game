import dbConnection from "@/dbConnection/dbConnection";
import Game from "@/models/gameModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { player1, player2 } = await request.json();

    const newGame = new Game({
      player1,
      player2,
    });
    await newGame.save();

    const p1 = await User.findById(player1);
    const p2 = await User.findById(player2);

    p1.Games.push(newGame._id);
    p2.Games.push(newGame._id);
    await p1.save();
    await p2.save();

    return NextResponse.json(
      {
        gameId: newGame._id,

        success: true,
        message: "Game saved successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error saving game:", error);
    return NextResponse.json(
      { success: false, message: "Error saving game" },
      { status: 500 }
    );
  }
}
