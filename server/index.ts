import { createServer } from "http";
import {} from "@/common/types/global";
import express from "express";
import next,{NextApiHandler} from "next";
import { Server } from "socket.io";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then( async () => {
    const app = express();
    const server = createServer(app);   

    const io = new Server<ClientToServerEvents,ServerToClientEvents>(server);
    app.get("/health" , async (_,res) => {
        res.send("ok")
    })
    io.on("connention", (socket) => {
        console.log("conneciton")

        socket.on("draw", (moves:any, options:any) => {
            console.log("drawing")
            socket.broadcast.emit("socket_draw", moves, options);
        })
        socket.on("disconnect", () => {
            console.log("disconnected")
        })
    })  

    app.all("*", (req:any, res:any) => nextHandler(req, res));
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
})