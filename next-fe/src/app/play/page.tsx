"use client";
import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import { Button } from "@/components/ui/button";
import { ChessBoard } from "@/components/chessboard/chessboard";
import { useSockets } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import MoveSound from "../../../public/move.wav";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const VIDEO_CALL = "video_call";

const Game = () => {
  const moveAudio = new Audio(MoveSound);
  const { data: session } = useSession();
  const socket = useSockets();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [color, setColor] = useState("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

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
          startVideoCall();
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

  const startVideoCall = async () => {
    // Enumerate devices to find the built-in camera
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    const builtInCamera = videoDevices.find(
      (device) =>
        device.label.toLowerCase().includes("integrated") ||
        device.label.toLowerCase().includes("built-in")
    );

    // Use the built-in camera if found, otherwise use the default camera
    const constraints = {
      video: builtInCamera ? { deviceId: builtInCamera.deviceId } : true,
      audio: true,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setLocalStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            type: VIDEO_CALL,
            payload: { candidate: event.candidate },
          })
        );
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    setPeerConnection(pc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket?.send(
      JSON.stringify({
        type: VIDEO_CALL,
        payload: { offer },
      })
    );
  };

  const handleVideoCallMessage = async (message: any) => {
    if (message.offer) {
      await peerConnection?.setRemoteDescription(
        new RTCSessionDescription(message.offer)
      );
      const answer = await peerConnection?.createAnswer();
      await peerConnection?.setLocalDescription(answer);
      socket?.send(
        JSON.stringify({
          type: VIDEO_CALL,
          payload: { answer },
        })
      );
    } else if (message.answer) {
      await peerConnection?.setRemoteDescription(
        new RTCSessionDescription(message.answer)
      );
    } else if (message.candidate) {
      await peerConnection?.addIceCandidate(
        new RTCIceCandidate(message.candidate)
      );
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
            </>
          ) : (
            <>
              <div>Waiting for opponent</div>
            </>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-1/2 rounded-xl"
          />
          
        </div>
      </div>
    </div>
  );
};

export default Game;
