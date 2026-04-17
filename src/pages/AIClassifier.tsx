import { useState, useRef } from "react";
import { Brain, Upload, Sparkles, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { celebrate } from "@/lib/confetti";

type Result = {
  type: string;
  emoji: string;
  confidence: number;
  recyclable: boolean;
  binColor: string;
  binHsl: string;
  tips: string[];
  points: number;
};

const CLASSES: Result[] = [
  { type: "Plastic Bottle", emoji: "🧴", confidence: 0, recyclable: true, binColor: "Blue Bin", binHsl: "201 96% 40%", tips: ["Rinse before disposal", "Remove cap and label", "Crush to save space"], points: 15 },
  { type: "Cardboard Box", emoji: "📦", confidence: 0, recyclable: true, binColor: "Brown Bin", binHsl: "30 50% 35%", tips: ["Flatten the box", "Remove tape and labels", "Keep dry"], points: 20 },
  { type: "E-Waste", emoji: "🔌", confidence: 0, recyclable: true, binColor: "Red Bin", binHsl: "0 70% 50%", tips: ["Never dispose in regular trash", "Remove batteries", "Drop at e-waste collection"], points: 40 },
  { type: "Glass Container", emoji: "🍾", confidence: 0, recyclable: true, binColor: "Green Bin", binHsl: "142 71% 45%", tips: ["Rinse thoroughly", "Remove caps", "Handle with care"], points: 25 },
  { type: "Mixed Packaging", emoji: "📭", confidence: 0, recyclable: true, binColor: "Yellow Bin", binHsl: "48 96% 53%", tips: ["Separate plastic from paper", "Remove food residue", "Check for recycling symbol"], points: 18 },
];

export default function AIClassifier() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = () => {
    if (!image) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const pick = CLASSES[Math.floor(Math.random() * CLASSES.length)];
      const confidence = Math.round(82 + Math.random() * 17);
      setResult({ ...pick, confidence });
      setAnalyzing(false);
      celebrate("small");
    }, 1800);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-eco">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-display">AI Waste Classifier</h1>
            <p className="text-sm text-muted-foreground">Upload a photo to identify and route waste correctly</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Upload */}
        <div className="glass rounded-2xl p-6 shadow-card">
          {!image ? (
            <label
              htmlFor="ai-upload"
              className="flex flex-col items-center justify-center h-72 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-smooth"
            >
              <Upload className="h-10 w-10 text-primary mb-3" />
              <p className="text-sm font-medium">Click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              <input
                id="ai-upload"
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
          ) : (
            <div className="relative">
              <img src={image} alt="upload" className="w-full h-72 object-cover rounded-xl" />
              <button onClick={reset} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-snappy">
                <X className="h-4 w-4" />
              </button>
              {analyzing && <div className="absolute inset-0 rounded-xl animate-shimmer pointer-events-none" />}
            </div>
          )}

          {image && (
            <Button onClick={analyze} disabled={analyzing} className="w-full mt-4 gradient-primary text-primary-foreground border-0 hover:shadow-glow transition-smooth">
              {analyzing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Classify Waste
                </>
              )}
            </Button>
          )}
        </div>

        {/* Result */}
        <div className="glass rounded-2xl p-6 shadow-card min-h-[20rem] flex items-center justify-center">
          {!result && !analyzing && (
            <div className="text-center text-sm text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-30" />
              Upload an image to see classification results
            </div>
          )}
          {analyzing && (
            <div className="text-center">
              <div className="inline-flex h-14 w-14 rounded-full gradient-primary items-center justify-center animate-pulse-glow mb-3">
                <Sparkles className="h-7 w-7 text-primary-foreground" />
              </div>
              <p className="text-sm font-medium">AI is analyzing your image...</p>
              <p className="text-xs text-muted-foreground mt-1">Identifying waste category</p>
            </div>
          )}
          {result && (
            <div className="w-full animate-scale-in">
              <div className="text-center">
                <div className="text-5xl mb-2">{result.emoji}</div>
                <h3 className="font-display text-xl font-bold">{result.type}</h3>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-success font-medium">
                  <CheckCircle className="h-3 w-3" /> {result.confidence}% confidence
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg flex items-center gap-3" style={{ background: `hsl(${result.binHsl} / 0.12)`, border: `1px solid hsl(${result.binHsl} / 0.3)` }}>
                <div className="h-8 w-8 rounded-full" style={{ background: `hsl(${result.binHsl})` }} />
                <div>
                  <div className="text-xs text-muted-foreground">Dispose in</div>
                  <div className="font-semibold text-sm">{result.binColor}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-muted-foreground">Earn</div>
                  <div className="font-bold gradient-text">+{result.points} pts</div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold mb-2 text-muted-foreground">RECYCLING TIPS</p>
                <ul className="space-y-1.5">
                  {result.tips.map((tip) => (
                    <li key={tip} className="text-xs flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-primary mt-0.5 shrink-0" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-xl p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Demo mode:</strong> Classifications are simulated. Connect to Lovable Cloud + Lovable AI to enable real image classification with Gemini.
      </div>
    </div>
  );
}
