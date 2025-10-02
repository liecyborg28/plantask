"use client";

import { useEffect, useState } from "react";

export default function AutoHidingToast({
  message = "",
  type = "info",
  duration = 3000,
  onClose = () => {},
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const alertClass =
    {
      success: "alert-success",
      error: "alert-error",
      info: "alert-info",
    }[type] || "alert-info";

  return (
    <div className="toast toast-top">
      <div className={`alert ${alertClass}`}>
        <span>{message}</span>
      </div>
    </div>
  );
}
