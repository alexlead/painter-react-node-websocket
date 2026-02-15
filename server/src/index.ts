import express, { type Request, type Response } from 'express';
import cors from 'cors';


const app = express();
const PORT = 3000;

app.use(cors())
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
    res.json({
        message: "Привет из Node.js + TypeScript!",
        status: "working",
        timestamp: new Date().toISOString()
    });
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`🔗 Через Nginx доступен по http://localhost/api`);
});