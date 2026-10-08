import { useState, useRef, RefObject } from "react";
import { toBlob } from "html-to-image";

export interface UseShareSnapshotReturn {
  diaryRef: RefObject<HTMLDivElement | null>;
  isCapturing: boolean;
  shareImageUrl: string | null;
  copiedLink: boolean;
  setShareImageUrl: (url: string | null) => void;
  handleSnapshotAndShare: () => Promise<void>;
  handleCopyLink: () => void;
}

export function useShareSnapshot(username: string): UseShareSnapshotReturn {
  const diaryRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/share/${username}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSnapshotAndShare = async () => {
    if (!diaryRef.current) return;
    setIsCapturing(true);

    try {
      if (typeof document !== "undefined" && document.fonts?.ready) {
        await document.fonts.ready;
      }

      await new Promise((resolve) => setTimeout(resolve, 150));

      const node = diaryRef.current;
      const width = node.offsetWidth;
      const height = node.scrollHeight;

      const blob = await toBlob(node, {
        width,
        height,
        filter: (el: HTMLElement) => !el.classList?.contains("no-screenshot"),
      });

      if (!blob) throw new Error("Could not generate image");

      const file = new File([blob], "places.png", { type: "image/png" });
      const shareUrl = `${window.location.origin}/share/${username}`;
      const shareData = {
        title: `${username}'s Places`,
        text: "Check out my Places map! 🌍✨",
        url: shareUrl,
        files: [file],
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData);
      } else {
        const imageUrl = URL.createObjectURL(blob);
        setShareImageUrl(imageUrl);
      }
    } catch (err) {
      console.error("Failed to share:", err);
      if (err instanceof Error) {
        alert("Could not capture the diary: " + err.message);
      } else {
        alert("Could not capture the diary: " + String(err));
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    diaryRef,
    isCapturing,
    shareImageUrl,
    copiedLink,
    setShareImageUrl,
    handleSnapshotAndShare,
    handleCopyLink,
  };
}
