import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { toast } from "sonner";
import { Truck, CheckCircle, Clock, Sun, Sunset, Moon, Package } from "lucide-react";
import { celebrate } from "@/lib/confetti";

const timeSlots = [
  { value: "morning", label: "Morning (8 AM – 12 PM)", icon: Sun, estimate: "~10:00 AM" },
  { value: "afternoon", label: "Afternoon (12 PM – 4 PM)", icon: Sunset, estimate: "~2:00 PM" },
  { value: "evening", label: "Evening (4 PM – 7 PM)", icon: Moon, estimate: "~5:30 PM" },
];

export default function RequestPickup() {
  const [submitted, setSubmitted] = useState(false);
  const [wasteType, setWasteType] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [isEcommerce, setIsEcommerce] = useState(false);
  const [qrCode] = useState(`ECO-${Date.now().toString(36).toUpperCase()}`);

  const selectedSlot = timeSlots.find((s) => s.value === timeSlot);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteType) { toast.error("Please select a waste type"); return; }
    if (!timeSlot) { toast.error("Please select a time slot"); return; }
    setSubmitted(true);
    celebrate("medium");
    toast.success(`Pickup request submitted! QR code: ${qrCode}`);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 text-success mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-semibold">Request Submitted!</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-4">Show this QR code to the pickup worker</p>

        <div className="flex justify-center mb-4">
          <QRCodeDisplay value={`ecotrack://pickup/${qrCode}`} label={qrCode} size={140} />
        </div>

        <div className="inline-flex items-center gap-2 rounded-md bg-accent/10 px-3 py-1.5 text-sm text-accent">
          <Clock className="h-3.5 w-3.5" />
          Estimated pickup: {selectedSlot?.estimate || "TBD"}
        </div>
        {isEcommerce && (
          <p className="text-xs text-primary mt-2 flex items-center justify-center gap-1">
            <Package className="h-3 w-3" /> E-commerce packaging tracked
          </p>
        )}
        <div className="mt-4">
          <Button onClick={() => { setSubmitted(false); setWasteType(""); setTimeSlot(""); setIsEcommerce(false); }}>Submit Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Request Pickup</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-6">
        <div>
          <Label className="text-xs">Waste Type</Label>
          <Select value={wasteType} onValueChange={setWasteType}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select waste type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="plastic">♻️ Plastic</SelectItem>
              <SelectItem value="cardboard">📦 Cardboard</SelectItem>
              <SelectItem value="e-waste">🔌 E-Waste</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Estimated Weight (kg)</Label>
          <Input type="number" placeholder="e.g. 2.5" min="0.1" step="0.1" className="mt-1" required />
        </div>

        <div>
          <Label className="text-xs">Address</Label>
          <Input type="text" placeholder="Start typing your address..." className="mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Google Maps autocomplete ready when API key is configured</p>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Preferred Time Slot</Label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const Icon = slot.icon;
              const isSelected = timeSlot === slot.value;
              return (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => setTimeSlot(slot.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs transition-snappy ${
                    isSelected ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{slot.value.charAt(0).toUpperCase() + slot.value.slice(1)}</span>
                </button>
              );
            })}
          </div>
          {selectedSlot && (
            <p className="text-xs text-accent mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Estimated pickup: {selectedSlot.estimate}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 rounded-md border p-3">
          <Checkbox id="ecommerce" checked={isEcommerce} onCheckedChange={(checked) => setIsEcommerce(checked === true)} />
          <div className="grid gap-0.5 leading-none">
            <label htmlFor="ecommerce" className="text-sm font-medium cursor-pointer">E-commerce Packaging</label>
            <p className="text-xs text-muted-foreground">This waste is from online shopping deliveries</p>
          </div>
        </div>

        <div>
          <Label className="text-xs">Additional Notes</Label>
          <Textarea placeholder="Any special instructions..." className="mt-1" rows={3} />
        </div>

        <div>
          <Label className="text-xs">Upload Image (optional)</Label>
          <Input type="file" accept="image/*" className="mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Upload a photo for AI waste classification</p>
        </div>

        <Button type="submit" className="w-full">Submit Request</Button>
      </form>
    </div>
  );
}
