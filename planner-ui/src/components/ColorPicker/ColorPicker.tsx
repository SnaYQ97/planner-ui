import { Button } from '@components/ui/button';

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
  error?: boolean;
}

const PRESET_COLORS = [
  '#2563eb', // niebieski
  '#16a34a', // zielony
  '#dc2626', // czerwony
  '#9333ea', // fioletowy
  '#ea580c', // pomarańczowy
  '#0d9488', // turkusowy
  '#4f46e5', // indygo
  '#be123c', // różowy
  '#854d0e', // brązowy
  '#475569', // szary
];

export const ColorPicker = ({ selectedColor, onSelect, error }: ColorPickerProps) => {
  return (
    <div className={`grid grid-cols-5 gap-2 ${error ? 'border-destructive' : ''}`}>
      {PRESET_COLORS.map((color) => (
        <Button
          key={color}
          type="button"
          className={`w-8 h-8 rounded-full p-0 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-ring' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  );
}; 