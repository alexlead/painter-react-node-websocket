import { create } from 'zustand';

interface CanvasState {
    canvas: HTMLCanvasElement | null;
    socket: WebSocket | null;
    sessionid: string | null;
    undoList: string[];
    redoList: string[];
    username: string;

    // Actions
    setSessionId: (id: string) => void;
    setSocket: (socket: WebSocket) => void;
    setUsername: (username: string) => void;
    setCanvas: (canvas: HTMLCanvasElement) => void;
    pushToUndo: (data: string) => void;
    pushToRedo: (data: string) => void;
    undo: () => void;
    redo: () => void;
}

const useCanvasStore = create<CanvasState>((set, get) => ({
    canvas: null,
    socket: null,
    sessionid: null,
    undoList: [],
    redoList: [],
    username: "",

    setSessionId: (id) => set({ sessionid: id }),
    setSocket: (socket) => set({ socket }),
    setUsername: (username) => set({ username }),
    setCanvas: (canvas) => set({ canvas }),

    pushToUndo: (data) =>
        set((state) => ({ undoList: [...state.undoList, data] })),

    pushToRedo: (data) =>
        set((state) => ({ redoList: [...state.redoList, data] })),

    undo: () => {
        const { canvas, undoList } = get();
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (undoList.length > 0) {
            const newUndoList = [...undoList];
            const dataUrl = newUndoList.pop();
            const currentCanvasData = canvas.toDataURL();

            set((state) => ({
                undoList: newUndoList,
                redoList: [...state.redoList, currentCanvasData]
            }));

            const img = new Image();
            img.src = dataUrl!;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    },

    redo: () => {
        const { canvas, redoList } = get();
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (redoList.length > 0) {
            const newRedoList = [...redoList];
            const dataUrl = newRedoList.pop();
            const currentCanvasData = canvas.toDataURL();

            set((state) => ({
                redoList: newRedoList,
                undoList: [...state.undoList, currentCanvasData]
            }));

            const img = new Image();
            img.src = dataUrl!;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        }
    }
}));

export default useCanvasStore;