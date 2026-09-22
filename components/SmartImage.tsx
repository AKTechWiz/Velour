"use client";

import Image, { type ImageProps } from "next/image";
import { useState, useEffect } from "react";

export default function SmartImage(props: ImageProps) {
  const [src, setSrc] = useState(props.src);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setSrc(props.src);
    setErrorCount(0);
  }, [props.src]);

  const handleError = () => {
    if (errorCount === 0 && typeof src === "string") {
      // If it's a remote URL with a product image filename, try local path
      const match = src.match(/([^/?#]+\.(?:jpg|jpeg|png|webp))/i);
      if (match && !src.startsWith("/images/products/")) {
        setErrorCount(1);
        setSrc(`/images/products/${match[1]}`);
        return;
      }
    }
    setErrorCount((c) => c + 1);
  };

  return (
    <Image
      {...props}
      src={src}
      onError={handleError}
      alt={props.alt ?? ""}
    />
  );
}

