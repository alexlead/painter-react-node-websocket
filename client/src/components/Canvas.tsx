import React, { useEffect, useRef, useState } from 'react';
import useCanvasStore from "../store/useCanvasStore";
import useToolStore from "../store/useToolStore";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";

import { useParams } from "react-router-dom";
import axios from 'axios';

interface ICanvasProps {
}


interface DrawMessage {
    method: 'draw' | 'connection';
    username?: string;
    id: string;
    figure: {
        type: 'brush' | 'rect' | 'finish';
        x: number;
        y: number;
        width: number;
        height: number;
        color: string;
    };
}

const Canvas: React.FunctionComponent<ICanvasProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const [modal, setModal] = useState<boolean>(true);
    const params = useParams<{ id: string }>();

    // Zustand Selectors
    const {
        username, setUsername, setCanvas,
        setSocket, setSessionId, pushToUndo
    } = useCanvasStore();

    const { setTool } = useToolStore();

    useEffect(() => {
        if (canvasRef.current) {
            setCanvas(canvasRef.current);
            const ctx = canvasRef.current.getContext('2d');

            axios.get(`http://localhost/api/image?id=${params.id}`)
                .then(response => {
                    const img = new Image();
                    img.src = response.data;
                    img.onload = () => {
                        if (canvasRef.current && ctx) {
                            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                        }
                    };
                })
                .catch(error => {
                    if (error.response && error.response.status === 404) {
                        console.log("No existing canvas found, starting with a blank one.");
                    } else {
                        console.error("Error loading canvas:", error);
                    }
                });
        }
    }, [params.id, setCanvas]);

    useEffect(() => {
        if (username && canvasRef.current && params.id) {
            const socket = new WebSocket(`ws://localhost/api`);

            setSocket(socket);
            setSessionId(params.id);
            setTool(new Brush(canvasRef.current, socket, params.id));

            socket.onopen = () => {
                console.log('Connection established');
                socket.send(JSON.stringify({
                    id: params.id,
                    username: username,
                    method: "connection"
                }));
            };

            socket.onmessage = (event) => {
                const msg: DrawMessage = JSON.parse(event.data);
                switch (msg.method) {
                    case "connection":
                        console.log(`user ${msg.username} is connected`);
                        break;
                    case "draw":
                        drawHandler(msg);
                        break;
                }
            };
        }
    }, [username, params.id]);

    const drawHandler = (msg: DrawMessage) => {
        const figure = msg.figure;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y);
                break;
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color);
                break;
            case "finish":
                ctx.beginPath();
                break;
        }
    };

    const mouseDownHandler = () => {
        if (canvasRef.current) {
            pushToUndo(canvasRef.current.toDataURL());
            axios.post(`http://localhost/api/image?id=${params.id}`, {
                img: canvasRef.current.toDataURL()
            }).then(response => console.log("Saved:", response.data));
        }
    };

    const connectHandler = () => {
        if (usernameRef.current?.value) {
            setUsername(usernameRef.current.value);
            setModal(false);
        }
    };

    return (
        <div className="canvas flex items-center justify-center bg-gray-200 h-full overflow-hidden">
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black opacity-50"></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md mx-auto my-6 z-50">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">

                            {/* Header */}
                            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Введите ваше имя
                                </h3>
                            </div>

                            {/* Body */}
                            <div className="relative p-6 flex-auto">
                                <input
                                    type="text"
                                    ref={usernameRef}
                                    placeholder="Ваше имя..."
                                    className="w-full px-3 py-2 text-gray-700 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && connectHandler()}
                                />
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end p-4 border-t border-solid border-gray-200 rounded-b">
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none transition-all duration-150 ease-linear"
                                    type="button"
                                    onClick={connectHandler}
                                >
                                    Enter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <canvas
                onMouseDown={mouseDownHandler}
                ref={canvasRef}
                width={600}
                height={400}
                className="bg-white shadow-2xl cursor-crosshair border border-gray-400"
            />
        </div>
    );;
}
export default Canvas;