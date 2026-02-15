import express, { type Request, type Response } from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { WebSocket } from 'ws';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appBase = express();
const wsInstance = expressWs(appBase);
const { app } = wsInstance;
const aWss = wsInstance.getWss();

const PORT = 3000;

app.use(cors())
app.use(express.json());

interface ExtendedWebSocket extends WebSocket {
    id?: string;
}

app.ws('/api', (ws: ExtendedWebSocket) => {
    ws.on('message', (msg: string) => {
        const parsedMsg = JSON.parse(msg);
        switch (parsedMsg.method) {
            case "connection":
                connectionHandler(ws, parsedMsg);
                break;
            case "draw":
                broadcastConnection(ws, parsedMsg);
                break;
        }
    });
});

app.post('/api/image', (req: Request, res: Response) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '');
        const filePath = path.resolve(__dirname, 'files', `${req.query.id}.jpg`);

        if (!fs.existsSync(path.resolve(__dirname, 'files'))) {
            fs.mkdirSync(path.resolve(__dirname, 'files'));
        }

        fs.writeFileSync(filePath, data, 'base64');
        return res.status(200).json({ message: "Loaded" });
    } catch (e) {
        console.error(e);
        return res.status(500).json('error');
    }
});


app.get('/api/image', (req: Request, res: Response) => {
    try {
        const filePath = path.resolve(__dirname, 'files', `${req.query.id}.jpg`);
        const file = fs.readFileSync(filePath);
        const data = `data:image/png;base64,` + file.toString('base64');
        res.json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json('error');
    }
});

// Test endpoint to check if the server is running
app.get('/api', (req: Request, res: Response) => {
    return res.status(200).json({ message: "Server is running!" });
});

app.listen(PORT, () => console.log(`🚀 server started on PORT ${PORT}`));

const connectionHandler = (ws: ExtendedWebSocket, msg: any) => {
    ws.id = msg.id;
    broadcastConnection(ws, msg);
};

const broadcastConnection = (ws: ExtendedWebSocket, msg: any) => {
    aWss.clients.forEach((client: ExtendedWebSocket) => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg));
        }
    });
};