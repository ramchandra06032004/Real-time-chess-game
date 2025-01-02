"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button/button";
import exp from "constants";
import chessImage from "../../public/chess_board.png"

const Landing = () => {
    const router=useRouter();
    return <div>
        <div className="pt-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex justify-center">
                    <img src={chessImage.src} className="max-w-96"  />
                </div>
                <div className="">
                    <div>
                        <h1 className="text-5xl font-bold text-white">Play Chess Online </h1>
                    </div>
                    <div className="mt-4">
                        <Button onClick={()=>{
                            router.push("/play")
                    }}> Play Online</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Landing;