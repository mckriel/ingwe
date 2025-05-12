"use client";

import { useEffect, useState } from "react";
import { refreshLocationCache } from "../../actions/preload-data";

export default function PreloadLocations() {
  const [loadState, setLoadState] = useState<{
    refreshCount: number;
    lastRefresh: number;
    cacheSize: number;
  }>({
    refreshCount: 0,
    lastRefresh: 0,
    cacheSize: 0
  });

  // Refresh the cache periodically
  useEffect(() => {
    // Initial load
    const initialLoad = async () => {
      try {
        const result = await refreshLocationCache();
        setLoadState({
          refreshCount: 1,
          lastRefresh: Date.now(),
          cacheSize: result.cached || 0
        });
      } catch (error) {
        console.error("Failed to preload locations:", error);
      }
    };

    initialLoad();

    // Set up a regular refresh interval (every 1 hour)
    const refreshInterval = setInterval(async () => {
      try {
        const result = await refreshLocationCache();
        setLoadState(prev => ({
          refreshCount: prev.refreshCount + 1,
          lastRefresh: Date.now(),
          cacheSize: result.cached || 0
        }));
      } catch (error) {
        console.error("Failed to refresh location cache:", error);
      }
    }, 1000 * 60 * 60); // 1 hour

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}