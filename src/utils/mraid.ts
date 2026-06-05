declare global {
  interface Window {
    mraid?: {
      open?: (url: string) => void;
      trackEvent?: (eventName: string) => void;
    };
  }
}

const storeUrl = "https://github.com/Wlad2000";

export const MRAID = {
  gameReady() {
    window.mraid?.trackEvent?.("game_ready");
    console.info("[MRAID mock] gameReady");
  },

  gameEnd(score: number) {
    window.mraid?.trackEvent?.(`game_end:${score}`);
    console.info("[MRAID mock] gameEnd", { score });
  },

  openStore() {
    if (window.mraid?.open) {
      window.mraid.open(storeUrl);
      return;
    }

    console.info("[MRAID mock] openStore", storeUrl);
  },
};
