import { useState } from "react";
import { Gift, Sparkles, Coins, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { mockUsers } from "@/data/mockData";
import { celebrate } from "@/lib/confetti";
import { toast } from "sonner";

type Reward = {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: "Plants" | "Vouchers" | "Eco Products" | "Experiences";
  popular?: boolean;
};

const rewards: Reward[] = [
  { id: "r1", name: "Sapling Tree", description: "Plant a tree in your society", cost: 200, icon: "🌱", category: "Plants", popular: true },
  { id: "r2", name: "Indoor Plant", description: "Air-purifying snake plant", cost: 350, icon: "🪴", category: "Plants" },
  { id: "r3", name: "Bamboo Garden Kit", description: "Starter kit with 3 bamboo plants", cost: 600, icon: "🎋", category: "Plants" },
  { id: "r4", name: "₹100 Grocery Voucher", description: "Use at partner stores", cost: 500, icon: "🛒", category: "Vouchers", popular: true },
  { id: "r5", name: "₹250 Café Voucher", description: "Eco-friendly cafés in MBMC", cost: 1200, icon: "☕", category: "Vouchers" },
  { id: "r6", name: "Movie Ticket", description: "Single PVR ticket", cost: 800, icon: "🎬", category: "Vouchers" },
  { id: "r7", name: "Bamboo Toothbrush Set", description: "Pack of 4 sustainable brushes", cost: 300, icon: "🪥", category: "Eco Products" },
  { id: "r8", name: "Reusable Bottle", description: "Stainless steel 750ml", cost: 450, icon: "🧴", category: "Eco Products", popular: true },
  { id: "r9", name: "Cotton Tote Bag", description: "Organic cotton, EcoTrack branded", cost: 250, icon: "👜", category: "Eco Products" },
  { id: "r10", name: "Composting Workshop", description: "Free spot in next workshop", cost: 700, icon: "🧑‍🏫", category: "Experiences" },
  { id: "r11", name: "Nature Walk Pass", description: "Guided MBMC eco trail", cost: 400, icon: "🌳", category: "Experiences" },
  { id: "r12", name: "Solar Lantern", description: "Premium solar-powered lamp", cost: 1500, icon: "💡", category: "Eco Products" },
];

const categories = ["All", "Plants", "Vouchers", "Eco Products", "Experiences"] as const;

export default function Marketplace() {
  const { auth } = useAuth();
  const user = mockUsers.find((u) => u.id === auth.userId);
  const [points, setPoints] = useState(user?.points || 1250);
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<typeof categories[number]>("All");

  const filtered = filter === "All" ? rewards : rewards.filter((r) => r.category === filter);

  const redeem = (r: Reward) => {
    if (points < r.cost) {
      toast.error(`Need ${r.cost - points} more points`);
      return;
    }
    setPoints((p) => p - r.cost);
    setRedeemed((prev) => new Set(prev).add(r.id));
    celebrate("medium");
    toast.success(`Redeemed: ${r.name} 🎁`);
  };

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-eco">
            <Gift className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-display">Rewards Marketplace</h1>
            <p className="text-sm text-muted-foreground">Redeem your points for eco-friendly rewards</p>
          </div>
        </div>
        <div className="glass rounded-full px-4 py-2 flex items-center gap-2 shadow-card">
          <Coins className="h-4 w-4 text-primary" />
          <span className="font-bold font-display gradient-text text-lg">{points.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">points</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-snappy ${
              filter === c
                ? "gradient-primary text-primary-foreground border-transparent shadow-eco"
                : "bg-card border-border hover:border-primary/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((r) => {
          const isRedeemed = redeemed.has(r.id);
          const canAfford = points >= r.cost;
          return (
            <div key={r.id} className="glass rounded-2xl p-5 shadow-card hover-lift relative overflow-hidden">
              {r.popular && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full gradient-primary text-primary-foreground">
                  <Sparkles className="h-2.5 w-2.5" /> POPULAR
                </span>
              )}
              <div className="text-4xl mb-3">{r.icon}</div>
              <h3 className="font-display font-semibold text-sm">{r.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.description}</p>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm font-bold gradient-text">
                  <Coins className="h-3.5 w-3.5 text-primary" />
                  {r.cost}
                </div>
                <Button
                  size="sm"
                  variant={isRedeemed ? "outline" : "default"}
                  disabled={isRedeemed || !canAfford}
                  onClick={() => redeem(r)}
                  className={!isRedeemed && canAfford ? "gradient-primary text-primary-foreground border-0 h-8 text-xs" : "h-8 text-xs"}
                >
                  {isRedeemed ? (<><Check className="h-3 w-3" /> Done</>) : canAfford ? "Redeem" : "Locked"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
