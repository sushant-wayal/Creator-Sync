"use client";

import { useEffect, useRef } from "react";

interface TooltipProps {
  annotation: {
    id: string;
    timeStamp: number;
    content: string;
  };
  duration: number;
  hoveringAnnotation: string | null;
  playerWidth: number;
}

export const Tooltip : React.FC<TooltipProps> = ({ annotation, duration, hoveringAnnotation, playerWidth }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const fraction = (duration + 98*annotation.timeStamp)/(100*duration);
      if (fraction*playerWidth - (rect.width/2) < 0) {
        tooltipRef.current.style.left = `0px`;
      } else if (fraction*playerWidth + (rect.width/2) > playerWidth) {
        tooltipRef.current.style.left = `${playerWidth - rect.width}px`;
      } else {
        tooltipRef.current.style.left = `${fraction*playerWidth - (rect.width/2)}px`;
      }
    }
  }, [hoveringAnnotation, tooltipRef.current, playerWidth]);
  return (
    <div
      className={`absolute -top-8 w-80 z-10 bg-white border-[1px] border-gray-300 p-4 shadow-md transition-all duration-300 ease-in-out rounded-lg -translate-y-1/2 ${hoveringAnnotation === annotation.id ? "visible" : "hidden"}`}
      style={{
        left: `${(duration + 98*annotation.timeStamp)/(duration)}%`,
      }}
      ref={tooltipRef}
    >
      <p>{annotation.content}</p>
    </div>
  )
}