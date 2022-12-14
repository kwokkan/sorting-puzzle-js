import { JSXInternal } from "preact/src/jsx";
import { MinusIcon, PlusIcon } from "./icons";

interface IProps {
    id: string;
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
}

export const NumericPicker = ({ id, label, min, max, value, onChange }: IProps) => {
    const handleDecrement: JSXInternal.MouseEventHandler<HTMLButtonElement> = (element) => {
        onChange(--value);
    };

    const handleIncrement: JSXInternal.MouseEventHandler<HTMLButtonElement> = (element) => {
        onChange(++value);
    };

    return (
        <div className="numeric-picker">
            <label for="id">{label}</label>
            <div className="picker-wrapper">
                <button type="button" className="icon-button" disabled={value === min} onClick={handleDecrement}>
                    <MinusIcon />
                </button>
                <input id={id} type="numeric" readOnly={true} value={value} />
                <button type="button" className="icon-button" disabled={value === max} onClick={handleIncrement}>
                    <PlusIcon />
                </button>
            </div>
        </div>
    );
};
