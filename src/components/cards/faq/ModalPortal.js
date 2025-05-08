// This small component says "put whatever inside children straight under <body>."
"use client";
import { useEffect } from "react";

import { createPortal } from "react-dom";

export default function ModalPortal({ children }) {

    //just to remove scroll bar
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "auto";
        };
      }, []);

  if (typeof window === "undefined") return null; // SSR safety

  return createPortal(children, document.body);
}