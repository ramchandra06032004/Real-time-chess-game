"use client";
import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import { Button } from "@/components/ui/button";
import { ChessBoard } from "@/components/chessboard/chessboard";
import { useSockets } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import MoveSound from "../../../public/move.wav";
import { io, Socket } from "socket.io-client";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const VIDEO_CALL = "video_call";

const URL = "http://localhost:3000";

const Game = () => {
  const moveAudio = new Audio(MoveSound);
  const { data: session } = useSession();
  const socket = useSockets();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [color, setColor] = useState("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = async (event: any) => {
      const message = JSON.parse(event.data);
      console.log(message);
      setColor(message.payload.color);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          setStarted(true);
          setWaiting(false);
          console.log("Game initialized");
          break;
        case MOVE:
          moveAudio.play();
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move Made");
          break;
        case GAME_OVER:
          console.log("Game over");
          break;
        case VIDEO_CALL:
          handleVideoCallMessage(message.payload);
          break;
      }
    };
  }, [socket]);

  const handleVideoCallMessage = async (payload: any) => {
    const { type, sdp, candidate } = payload;
    if (type === "offer") {
      const pc = createPeerConnection();
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket?.send(JSON.stringify({ type: "answer", sdp: answer }));
    } else if (type === "answer") {
      await peerConnection?.setRemoteDescription(new RTCSessionDescription(sdp));
    } else if (type === "candidate") {
      await peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();
    
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            socket?.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
            console.log("ICE candidate sent:", event.candidate);
        }
    };

    pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        console.log("Remote stream set.");
    };

    pc.oniceconnectionstatechange = () => {
        console.log(`ICE connection state: ${pc.iceConnectionState}`);
    };

    if (localStream) {
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
        console.log("Local tracks added to peer connection.");
    } else {
        console.warn("No local stream available to add tracks.");
    }

    setPeerConnection(pc);
    return pc;
};

const startVideoCall = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
        console.log("Local stream set.");

        const pc = createPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("Local SDP offer created and set.");

        socket?.send(JSON.stringify({ type: "offer", sdp: offer }));
        console.log("Offer sent to signaling server.");
    } catch (error) {
        console.error("Error starting video call:", error);
    }
};

  if (!socket) return <div>Connecting ...........</div>;

  return (
    <div className="justify-center flex">
      <div className="pt-8 w-full">
        <div className="col-span-4 w-full flex justify-center">
          <ChessBoard
            chess={chess}
            setBoard={setBoard}
            socket={socket}
            board={board}
          />
        </div>
        <div className="col-span-2 items-center w-full flex justify-center mt-6">
          {!started && !waiting ? (
            <Button
              onClick={() => {
                if (session) {
                  const userId = session.user._id;
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                      payload: { userId },
                    })
                  );
                  setWaiting(true);
                }
              }}
              className="h-14 w-28 text-2xl"
            >
              Play
            </Button>
          ) : started ? (
            <>
              <div>your color is {color}</div>
              <Button onClick={startVideoCall} className="h-14 w-28 text-2xl">
                Start Video Call
              </Button>
              <video ref={localVideoRef} autoPlay playsInline />
              <video ref={remoteVideoRef} autoPlay playsInline />
            </>
          ) : (
            <>
              <div>Waiting for opponent</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;