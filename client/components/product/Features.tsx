import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Sparkles, Truck } from "lucide-react";

export default function Features() {
  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over ₹50" },
    { icon: Leaf, title: "100% Organic", desc: "Pure botanical ingredients" },
    { icon: Sparkles, title: "Gentle on Skin", desc: "Hypoallergenic formulas" },
  ];
  return (
    <Card className="mb-16">
      <CardContent className="p-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground mb-1">
                  {feature.title}
                </h2>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
