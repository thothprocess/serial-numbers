import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectWrapperProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
}

export const SelectWrapper: React.FC<SelectWrapperProps> = ({
  value,
  onValueChange,
  options,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
