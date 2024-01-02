import { createServer } from "http";

import express from "express";
import next,{NextApiHandler} from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then( async () => {
    const app = express();
    const server = createServer(app);   

    app.get("*", (req:any, res:any) => nextHandler(req, res));
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
})