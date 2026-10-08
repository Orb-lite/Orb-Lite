import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { PRODUCTS, type ProductCategory } from "@/data/catalog";

type Filter = "ALL" | ProductCategory;

const TABS: Array<{ id: Filter; label: string }> = [
  { id: "ALL", label: "Todos" },
  { id: "B2B", label: "Para Instaladores / Flotillas" },
  { id: "B2C", label: "Para Usuario Final" },
  { id: "RENOVATION", label: "Renovaciones" },
];

export function CatalogGrid({
  initialFilter = "ALL",
  showTabs = true,
}: {
  initialFilter?: Filter;
  showTabs?: boolean;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const products = PRODUCTS.filter((p) => filter === "ALL" || p.category === filter);

  return (
    <div className="space-y-8">
      {showTabs && (
        <div className="flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-full border px-4 py-2 font-display text-xs font-bold uppercase tracking-widest transition-colors ${
                filter === tab.id
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
