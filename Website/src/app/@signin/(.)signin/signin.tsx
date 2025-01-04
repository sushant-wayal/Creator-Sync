"use client";

import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ElementRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModelProps {
  children: React.ReactNode;
}

export const Signin : React.FC<ModelProps> = ({ children }) => {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<'dialog'>>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <div className="absolute top-0 left-0 flex justify-center items-center">
      <dialog ref={dialogRef} className="h-fit rounded-[12px] bg-white p-0 relative flex justify-center items-center" onClose={onDismiss}>
        {children}
        <Button variant="destructive" onClick={onDismiss} className="absolute top-2 right-2 p-0 h-8 w-8 cursor-pointer flex justify-center items-center">
          <X size={24} />
        </Button>
      </dialog>
    </div>,
    document.getElementById('modal-root')!
  );
}