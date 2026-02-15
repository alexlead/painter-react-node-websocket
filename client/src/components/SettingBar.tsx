import React, { type ChangeEvent } from 'react';
import useToolStore from "../store/useToolStore";

interface ISettingBarProps {
}

const SettingBar: React.FunctionComponent<ISettingBarProps> = () => {
    const setLineWidth = useToolStore((state) => state.setLineWidth);
    const setStrokeColor = useToolStore((state) => state.setStrokeColor);

    const onChangeLineWidth = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setLineWidth(value);
        }
    };

    const onChangeStrokeColor = (e: ChangeEvent<HTMLInputElement>) => {
        setStrokeColor(e.target.value);
    };
    return (
        <div className="flex items-center h-10 bg-gray-300 shadow-sm px-4 border-b gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2 ">
                <label htmlFor="line-width" className="font-medium">Line width:</label>
                <input
                    className="w-16 px-2 py-0.5 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={onChangeLineWidth}
                    id="line-width"
                    type="number"
                    defaultValue={1}
                    min={1}
                    max={50}
                />
            </div>

            <div className="w-[1px] h-5 bg-gray-200" />

            <div className="flex items-center gap-2">
                <label htmlFor="stroke-color" className="font-medium">Border color:</label>
                <input
                    className="w-8 h-8 cursor-pointer rounded bg-transparent border-none"
                    onChange={onChangeStrokeColor}
                    id="stroke-color"
                    type="color"
                />
            </div>
        </div>
    );
}
export default SettingBar;