import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
}

export function QRCodeDisplay({ value, size = 120, label }: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card">
      <div className="bg-white p-2 rounded">
        <QRCodeSVG value={value} size={size} level="M" />
      </div>
      {label && <span className="text-xs font-mono text-muted-foreground">{label}</span>}
    </div>
  );
}
