import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MaskedSerialNumberProps {
  serial: string;
}

export const MaskedSerialNumber: React.FC<MaskedSerialNumberProps> = ({
  serial,
}) => {
  const [isMasked, setIsMasked] = useState(true);

  const toggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const getMaskedValue = (serial: string) => {
    if (serial.length <= 12) return serial;
    const firstFour = serial.slice(0, 4);
    const lastFour = serial.slice(-4);
    return `${firstFour}...${lastFour}`;
  };

  return (
    <div className="bg-muted p-1 text-center">
      <Button variant="ghost" onClick={toggleMask}>
        {isMasked ? getMaskedValue(serial) : serial}
      </Button>
    </div>
  );
};
