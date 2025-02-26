"use client";

import { useState } from "react";
import { useScreenshot } from "use-react-screenshot";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface SnapshotCaptureProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
  onCapture?: (imageUrl: string) => void;
}

export default function SnapshotCapture({
  targetRef,
  fileName = "snapshot",
  onCapture,
}: SnapshotCaptureProps) {
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  const [takeScreenshot] = useScreenshot();

  const captureSnapshot = async () => {
    if (targetRef.current && takeScreenshot) {
      const capturedImage = await takeScreenshot(targetRef.current);
      setSnapshotUrl(capturedImage);
      if (onCapture) onCapture(capturedImage);
    }
  };

  const downloadSnapshot = (format: "png" | "jpg") => {
    if (!snapshotUrl) return;

    const link = document.createElement("a");
    link.href = snapshotUrl;
    link.download = `${fileName}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={captureSnapshot} variant="outline">
        <ImageIcon className="h-5 w-5 mr-2" /> Capture Snapshot
      </Button>

      {snapshotUrl && (
        <div className="flex flex-col items-center gap-2">
          {/*eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={snapshotUrl}
            alt="Snapshot Preview"
            className="w-64 rounded-lg shadow-md"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => downloadSnapshot("png")}>
              Download PNG
            </Button>
            <Button variant="outline" onClick={() => downloadSnapshot("jpg")}>
              Download JPG
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
