import { create } from 'zustand';
import Tool from '../tools/Tool';
interface ToolState {
    tool: Tool | null;
    setTool: (tool: Tool | null) => void;
    setFillColor: (color: string) => void;
    setStrokeColor: (color: string) => void;
    setLineWidth: (width: number) => void;
}

const useToolStore = create<ToolState>((set) => ({
    tool: null,
    setTool: (tool) => set({ tool }),
    setFillColor: (color) =>
        set((state) => {
            if (state.tool) state.tool.fillColor = color;
            return { tool: state.tool };
        }),
    setStrokeColor: (color) =>
        set((state) => {
            if (state.tool) state.tool.strokeColor = color;
            return { tool: state.tool };
        }),
    setLineWidth: (width) =>
        set((state) => {
            if (state.tool) state.tool.lineWidth = width;
            return { tool: state.tool };
        }),
}));

export default useToolStore;