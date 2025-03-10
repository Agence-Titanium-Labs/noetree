"use client";

import { useState, useEffect, useCallback, KeyboardEvent } from "react";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import ConditionChecker from "./helpers/ConditionChecker";

interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialRightPanelWidth?: number;
  cookieKey?: string;
}

export default function ResizablePanel({
  leftPanel,
  rightPanel,
  initialRightPanelWidth = 50,
  cookieKey = "rightPanelWidth"
}: Readonly<ResizablePanelProps>) {
  // État pour suivre si les cookies ont été chargés
  const [cookiesLoaded, setCookiesLoaded] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(
    initialRightPanelWidth
  );
  const [isResizing, setIsResizing] = useState(false);

  // Step value for keyboard resizing (percentage)
  const RESIZE_STEP = 1;

  // Charger la valeur depuis les cookies uniquement côté client
  useEffect(() => {
    const savedWidth = Cookies.get(cookieKey);
    if (savedWidth) {
      setRightPanelWidth(parseFloat(savedWidth));
    }
    // Indiquer que les cookies ont été chargés
    setCookiesLoaded(true);
  }, [cookieKey]);

  // Update cookie whenever width changes, mais seulement après le chargement initial
  useEffect(() => {
    if (cookiesLoaded) {
      Cookies.set(cookieKey, rightPanelWidth.toString(), { expires: 365 });
    }
  }, [rightPanelWidth, cookieKey, initialRightPanelWidth, cookiesLoaded]);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    // Blur the button to prevent focus outline from sticking
    (document.activeElement as HTMLElement)?.blur();

    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      // Calculate new width with boundaries (minimum 20%, maximum 80%)
      const newWidth = Math.min(
        Math.max(
          ((window.innerWidth - e.clientX - 8) / window.innerWidth) * 100,
          20
        ),
        80
      );

      setRightPanelWidth(newWidth);
    },
    [isResizing]
  );

  // Add document-level event listeners when resizing is active
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResizing);
    }

    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        // Decrease right panel width (making it larger)
        setRightPanelWidth(prev => Math.min(prev + RESIZE_STEP, 80));
        break;
      case "ArrowRight":
        e.preventDefault();
        // Increase right panel width (making it smaller)
        setRightPanelWidth(prev => Math.max(prev - RESIZE_STEP, 20));
        break;
    }
  };

  return (
    <div className="w-full h-screen flex">
      <ConditionChecker condition={cookiesLoaded}>
        <div className="h-full grow-1 p-4 overflow-auto">{leftPanel}</div>
        <button
          type="button"
          className={cn(
            "w-[8px] hover:w-[16px] bg-gray-200 hover:bg-gray-300 cursor-ew-resize transition-all focus:outline-none focus:bg-blue-400 focus:w-[16px]",
            isResizing && "bg-blue-400 w-[16px]"
          )}
          onMouseDown={startResizing}
          onKeyDown={handleKeyDown}
          aria-label="Resize panels (use left/right arrow keys to resize)"
          title="Use left/right arrow keys to resize"
        />
        <div
          className="h-full p-4 overflow-auto"
          style={{ flex: `0 1 ${rightPanelWidth}%` }}
        >
          {rightPanel}
        </div>
      </ConditionChecker>
    </div>
  );
}
