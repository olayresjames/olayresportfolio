import { useState } from 'react';

function isAppleDevice() {
  if (typeof navigator === 'undefined') return false;
  const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
  return /Mac|iPhone|iPad|iPod/i.test(platform);
}

export default function usePlatformShortcuts() {
  const [isMac] = useState(isAppleDevice);

  return {
    paletteShortcut: isMac ? '⌘ K' : 'Ctrl K',
    askShortcut: isMac ? '⌘ J' : 'Ctrl J',
  };
}
