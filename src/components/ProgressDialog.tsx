import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface ProgressDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export const ProgressDialog: React.FC<ProgressDialogProps> = ({
  isOpen,
  title,
  description,
  onClose,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 100));
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <Progress value={progress} className="w-full" />
        {progress === 100 && (
          <Button variant="outline" className="mt-4 w-full" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
