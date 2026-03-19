import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Truck, CheckCircle } from "lucide-react";

export default function RequestPickup() {
  const [submitted, setSubmitted] = useState(false);
  const [wasteType, setWasteType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Pickup request submitted! QR code: ECO-NEW-2026");
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 text-success mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-semibold">Request Submitted!</h2>
        <p className="text-sm text-muted-foreground mt-2">QR Code: <span className="font-mono text-foreground">ECO-NEW-2026</span></p>
        <p className="text-xs text-muted-foreground mt-1">A worker will be assigned shortly.</p>
        <Button className="mt-6" onClick={() => setSubmitted(false)}>Submit Another</Button>
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
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select waste type" />
            </SelectTrigger>
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
