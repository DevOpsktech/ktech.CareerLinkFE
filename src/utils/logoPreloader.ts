/**
 * Utility to preload logo assets for better performance
 */

const LOGO_ASSETS = [
  "/lightlogo.png",
  "/darklogo.png",
  "/lightemblem.png",
  "/darkemblem.png",
];

export const preloadLogos = (): Promise<void[]> => {
  const preloadPromises = LOGO_ASSETS.map((src) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });
  });

  return Promise.all(preloadPromises);
};

export const preloadLogosAsync = async (): Promise<void> => {
  try {
    await preloadLogos();
    console.log("All logo assets preloaded successfully");
  } catch (error) {
    console.warn("Some logo assets failed to preload:", error);
  }
};
