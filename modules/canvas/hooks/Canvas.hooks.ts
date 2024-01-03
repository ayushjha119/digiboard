import { useEffect, useState } from "react"
import { socket } from "@/common/lib/socket"
import options, { useOptions } from "@/common/recoil/options";

let moves: [number, number][] = [];

export const useDraw = (
    
    ctx?: CanvasRenderingContext2D | undefined,
    blocked: boolean,
    movedX: number,
    movedY: number,
) => {
    const options = useOptions();
    const [drawing,setDrawing] = useState(false);
    useEffect(() => {

        if(ctx){
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.lineWidth = options.lineWidth;
            ctx.strokeStyle = options.lineColor;
        }
    })

    const handleStartDrawing = (x: number, y: number) => {
        if(!ctx || blocked) return;

        moves = [[x+movedX,y+]];
        setDrawing(true);
        ctx.beginPath();
        ctx.lineTo(x,y);
        ctx.stroke();
    };
    const handleEndDrawing = () => {
        if(!ctx) return;
        
        socket.emit("draw", moves, options);

        setDrawing(false);
        ctx.closePath();

    }

    const handleDraw = (x: number, y: number) => {
        if(ctx && drawing){
            moves.push([x,y]);
            ctx.lineTo(x,y);
            ctx.stroke();
        }
    }
    return {
        handleDraw,
        handleStartDrawing,
        handleEndDrawing,
        drawing
    }
}