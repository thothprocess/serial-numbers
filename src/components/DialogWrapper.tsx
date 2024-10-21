import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useMedia } from 'react-use';

interface DialogWrapperProps {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const DialogWrapper: React.FC<DialogWrapperProps> = ({
  title,
  children,
  open,
  onOpenChange,
}) => {
  const isDesktop = useMedia('(min-width: 768px)');

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {children}
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button className="w-full" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">{children}</div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button className="w-full" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
