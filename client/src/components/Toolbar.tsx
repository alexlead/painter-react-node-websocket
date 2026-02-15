import React, { type ChangeEvent } from 'react';
import useToolStore from "../store/useToolStore";
import useCanvasStore from "../store/useCanvasStore";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Line from "../tools/Line";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";

import {
    MdBrush,
    MdRectangle,
    MdCircle,
    MdLineStyle,
    MdUndo,
    MdRedo,
    MdSave
} from 'react-icons/md';
import { BiSolidEraser } from 'react-icons/bi';

interface IToolbarProps {
}

const Toolbar: React.FunctionComponent<IToolbarProps> = () => {
    const { canvas, socket, sessionid, undo, redo } = useCanvasStore();
    const { setFillColor, setStrokeColor } = useToolStore();

    const setTool = useToolStore((state) => state.setTool);
    const tool = useToolStore((state) => state.tool);

    const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setStrokeColor(color);
        setFillColor(color);
    };

    const download = () => {
        if (!canvas) return;

        const dataUrl = canvas.toDataURL();
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = (sessionid || "canvas") + ".jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleSetTool = (ToolClass: any) => {
        if (canvas) {
            setTool(new ToolClass(canvas, socket, sessionid));
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-gray-800 shadow-sm border-b border-gray-700">
            <button
                className="w-8 h-6 cursor-pointer flex items-center justify-center rounded-md bg-blue-600 hover:bg-gray-100 active:bg-gray-200 text-white hover:text-black transition-colors"
                onClick={() => handleSetTool(Brush)}
            >
                <MdBrush size={20} title="Кисть" />
            </button>

            <button
                className="w-8 h-6 cursor-pointer flex items-center justify-center rounded-md bg-blue-600 hover:bg-gray-100 active:bg-gray-200 text-white hover:text-black transition-colors"
                onClick={() => handleSetTool(Rect)}
            >
                <MdRectangle size={20} title="Прямоугольник" />
            </button>

            <button
                className="w-8 h-6 cursor-pointer flex items-center justify-center rounded-md bg-blue-600 hover:bg-gray-100 active:bg-gray-200 text-white hover:text-black transition-colors"
                onClick={() => handleSetTool(Circle)}
            >
                <MdCircle size={20} title="Круг" />
            </button>

            <button
                className="w-8 h-6 cursor-pointer flex items-center justify-center rounded-md bg-blue-600 hover:bg-gray-100 active:bg-gray-200 text-white hover:text-black transition-colors"
                onClick={() => handleSetTool(Eraser)}
            >
                <BiSolidEraser size={20} title="Ластик" />
            </button>

            <button
                className="w-8 h-6 cursor-pointer flex items-center justify-center rounded-md bg-blue-600 hover:bg-gray-100 active:bg-gray-200 text-white hover:text-black transition-colors"
                onClick={() => handleSetTool(Line)}
            >
                <MdLineStyle size={20} title="Линия" />
            </button>

            <input
                onChange={changeColor}
                type="color"
                className="ml-2 w-8 h-8 cursor-pointer rounded border-none bg-transparent"
            />

            <div className="w-[1px] h-6 bg-gray-600 mx-1" />

            <button
                className="w-8 h-6 cursor-pointer flex items-center justify-center rounded-md bg-blue-600 hover:bg-gray-100 active:bg-gray-200 text-white hover:text-black transition-colors"
                onClick={() => undo()}
            >
                <MdUndo size={20} title="Назад" />
            </button>

            <button
                className="w-8 h-6 cursor-pointer flex items-center justify-center rounded-md bg-blue-600 hover:bg-gray-100 active:bg-gray-200 text-white hover:text-black transition-colors"
                onClick={() => redo()}
            >
                <MdRedo size={20} title="Вперед" />
            </button>

            <button
                className="w-8 h-6 cursor-pointer flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-50 text-white hover:text-black transition-colors"
                onClick={download}
            >
                <MdSave size={20} title="Сохранить" />
            </button>
        </div>
    );
}
export default Toolbar;