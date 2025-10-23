"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const RecentPhoto = () => {
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const fetchInterval = Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fetchData = async () => {
      setPhotoUrl(`${backendUrl}/public/latest.jpg?${Date.now()}`);
    };
    fetchData();
    timer = setInterval(fetchData, fetchInterval);
    return () => clearInterval(timer);
  }, [backendUrl, fetchInterval]);

  return (
    <div className="relative w-full aspect-video">
      {photoUrl && (
        <Image
          src={photoUrl}
          alt="Latest photo"
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover bg-black border border-neutral-700 rounded-lg"
          priority
          unoptimized={true}
        />
      )}
    </div>
  );
};
