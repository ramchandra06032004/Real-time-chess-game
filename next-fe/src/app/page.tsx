"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import chessImage from "../../public/chess_board.webp";

const Landing = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                    <div className="flex justify-center">
                        <img src={chessImage.src} className="max-w-full rounded-lg shadow-lg" alt="Chess Board" />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-5xl font-bold mb-4">Play Chess Online</h1>
                        <p className="text-lg mb-6">Join our community and play chess with players from around the world.</p>
                        <Button onClick={() => router.push("/play")}
                        >
                            Play Online
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;