import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { celebrate } from "@/lib/confetti";
import {
  Sparkles, Upload, Loader2, CheckCircle2, Recycle, Package,
  AlertTriangle, MapPin, Clock, RefreshCw,
} from "lucide-react";

type Classification = {
  packaging_type: string;
  material_type: "plastic" | "cardboard" | "mixed" | "e-waste" | "paper" | "glass" | "metal" | "unknown";
  recyclability: "fully_recyclable" | "partially_recyclable" | "not_recyclable" | "special_handling";
  disposal_instructions: string;
  detected_objects: string[];
  confidence: number;
};

const POINTS_PER_MATERIAL: Record<string, number> = {
  plastic: 15, "e-waste": 30, cardboard: 10, paper: 8, mixed: 12, glass: 10, metal: 12, unknown: 5,
};

const TIME_SLOTS = [
  { value: "morning", label: "Morning (8 AM – 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM – 4 PM)" },
  { value: "evening", label: "Evening (4 PM – 7 PM)" },
];

const recyclabilityMeta = {
  fully_recyclable: { label: "Fully Recyclable", color: "bg-success/10 text-success border-success/30" },
  partially_recyclable: { label: "Partially Recyclable", color: "bg-accent/10 text-accent border-accent/30" },
  not_recyclable: { label: "Not Recyclable", color: "bg-destructive/10 text-destructive border-destructive/30" },
  special_handling: { label: "Special Handling", color: "bg-primary/10 text-primary border-primary/30" },
};

export default function SmartWasteSubmission() {
  const { auth } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [classification, setClassification] = useState<Classification | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<"clean" | "dirty">("clean");
  const [pickupRequired, setPickupRequired] = useState(true);
  const [address, setAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ points: number; id: string } | null>(null);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image too large (max 8 MB)");
      return;
    }
    setImageFile(file);
    const base64 = await fileToBase64(file);
    setImagePreview(base64);
    setClassification(null);
    classify(base64);
  };

  const classify = async (base64: string) => {
    setClassifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("classify-waste", {
        body: { imageBase64: base64 },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setClassification(data as Classification);
      toast.success("AI classification complete");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Classification failed";
      toast.error(msg);
    } finally {
      setClassifying(false);
    }
  };

  const computePoints = () => {
    if (!classification) return 0;
    const base = POINTS_PER_MATERIAL[classification.material_type] ?? 5;
    const conditionMultiplier = condition === "clean" ? 1 : 0.7;
    return Math.round(base * quantity * conditionMultiplier);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !classification) {
      toast.error("Please upload and classify an image first");
      return;
    }
    if (pickupRequired && (!address || !timeSlot)) {
      toast.error("Address and time slot are required for pickup");
      return;
    }

    setSubmitting(true);
    try {
      // Upload image to storage
      const ext = imageFile.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("waste-images")
        .upload(path, imageFile, { contentType: imageFile.type });
      if (uploadErr) throw uploadErr;
      const { data: pub } = supabase.storage.from("waste-images").getPublicUrl(path);

      const points = computePoints();

      const { data: inserted, error: insertErr } = await supabase
        .from("waste_submissions")
        .insert({
          user_id: auth.userId,
          user_name: auth.userName,
          image_url: pub.publicUrl,
          packaging_type: classification.packaging_type,
          material_type: classification.material_type,
          recyclability: classification.recyclability,
          disposal_instructions: classification.disposal_instructions,
          detected_objects: classification.detected_objects,
          ai_confidence: classification.confidence,
          quantity,
          condition,
          pickup_required: pickupRequired,
          address: pickupRequired ? address : null,
          pickup_time_slot: pickupRequired ? timeSlot : null,
          notes: notes || null,
          reward_points: points,
          status: pickupRequired ? "pending" : "logged",
        })
        .select("id")
        .single();
      if (insertErr) throw insertErr;

      celebrate("medium");
      setDone({ points, id: inserted.id });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setImageFile(null);
    setImagePreview(null);
    setClassification(null);
    setQuantity(1);
    setCondition("clean");
    setPickupRequired(true);
    setAddress("");
    setTimeSlot("");
    setNotes("");
    setDone(null);
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 text-success mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold">Submission Confirmed!</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Reference: <span className="font-mono">{done.id.slice(0, 8)}</span>
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-primary-foreground">
          <Sparkles className="h-4 w-4" />
          <span className="font-semibold">+{done.points} points earned</span>
        </div>
        <div className="mt-6">
          <Button onClick={reset}>Submit Another</Button>
        </div>
      </div>
    );
  }

  const recMeta = classification ? recyclabilityMeta[classification.recyclability] : null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Smart Waste Submission</h1>
          <p className="text-xs text-muted-foreground">AI-powered packaging classification in seconds</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {/* Upload */}
        <div className="rounded-lg border bg-card p-6">
          <Label className="text-xs">1. Upload Packaging Image *</Label>
          {!imagePreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-8 flex flex-col items-center gap-2 transition-snappy"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Click to upload an image</span>
              <span className="text-xs text-muted-foreground">PNG, JPG up to 8 MB</span>
            </button>
          ) : (
            <div className="mt-2 relative">
              <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover rounded-lg" />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Replace
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {/* AI Result */}
        {(classifying || classification) && (
          <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-accent/5 p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">AI Analysis</span>
              {classification && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {Math.round(classification.confidence * 100)}% confidence
                </Badge>
              )}
            </div>
            {classifying && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing image...
              </div>
            )}
            {classification && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Package className="h-3 w-3" /> Packaging Type
                    </div>
                    <div className="font-medium mt-0.5">{classification.packaging_type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Recycle className="h-3 w-3" /> Material
                    </div>
                    <div className="font-medium mt-0.5 capitalize">{classification.material_type}</div>
                  </div>
                </div>
                {recMeta && (
                  <Badge variant="outline" className={recMeta.color}>
                    {recMeta.label}
                  </Badge>
                )}
                <div className="rounded-md bg-background/60 border p-3 text-xs">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                    <p>{classification.disposal_instructions}</p>
                  </div>
                </div>
                {classification.detected_objects?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {classification.detected_objects.map((o) => (
                      <Badge key={o} variant="secondary" className="text-xs">{o}</Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Form fields (visible after classification) */}
        {classification && (
          <div className="rounded-lg border bg-card p-6 space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Quantity *</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Condition *</Label>
                <Select value={condition} onValueChange={(v: "clean" | "dirty") => setCondition(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clean">✨ Clean</SelectItem>
                    <SelectItem value="dirty">🧹 Dirty (−30% points)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs mb-2 block">Pickup Required?</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: true, label: "Yes, schedule pickup" },
                  { v: false, label: "No, just log it" },
                ].map((o) => (
                  <button
                    key={String(o.v)}
                    type="button"
                    onClick={() => setPickupRequired(o.v)}
                    className={`p-3 rounded-lg border text-sm transition-snappy ${
                      pickupRequired === o.v ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {pickupRequired && (
              <>
                <div>
                  <Label className="text-xs flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Address *
                  </Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat / Society / Street"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Preferred Time Slot *
                  </Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select a slot" /></SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div>
              <Label className="text-xs">Additional Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Anything the worker should know..."
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between rounded-md bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3">
              <span className="text-sm">Estimated reward</span>
              <span className="font-bold text-primary inline-flex items-center gap-1">
                <Sparkles className="h-4 w-4" /> +{computePoints()} pts
              </span>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                <>Confirm & Submit</>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}