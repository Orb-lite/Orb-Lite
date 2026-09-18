import { useState } from "react";
import { BadgeCheck, Gift, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { lookupCustomer } from "@/lib/customers.functions";

const inputClass =
  "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary";

export function CustomerBlock() {
  const { isFirstPurchase, customerNumber, setIsFirstPurchase, setCustomerNumber } = useCartStore();
  const [input, setInput] = useState(customerNumber ? String(customerNumber) : "");
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    const num = Number(input.trim());
    if (!Number.isInteger(num) || num < 500) {
      toast.error("Escribe tu número de cliente (500 en adelante)");
      return;
    }
    setLoading(true);
    try {
      const record = await lookupCustomer({ data: { customerNumber: num } });
      if (!record) {
        toast.error("No encontramos ese número de cliente");
        return;
      }
      setCustomerNumber(record.customerNumber);
      toast.success(
        `¡Hola de nuevo, ${record.firstName}! (${record.ordersCount} compra${
          record.ordersCount !== 1 ? "s" : ""
        } acumulada${record.ordersCount !== 1 ? "s" : ""})`,
        {
          description:
            "Por tu seguridad, confirma tus datos de envío y facturación en este pedido.",
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("No pudimos consultar tu número de cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-border/60 p-3">
      <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Cliente ORB-LITE
      </p>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isFirstPurchase}
          onChange={(e) => setIsFirstPurchase(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Es mi primera compra
          </span>
          <span className="block text-xs text-muted-foreground">
            Te asignamos un número de cliente al finalizar tu solicitud.
          </span>
        </span>
      </label>

      {!isFirstPurchase && (
        <div className="space-y-2 border-t border-border/60 pt-3">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Tu número de cliente
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={input}
              placeholder="Ej. 1043"
              onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 7))}
              className={inputClass}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleLookup}
              disabled={loading}
              className="shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Cargar datos</span>
            </Button>
          </div>
          {customerNumber && (
            <p className="text-[11px] font-semibold text-primary">
              Cliente #{customerNumber} identificado.
            </p>
          )}
        </div>
      )}

      <p className="flex items-start gap-2 rounded-lg bg-primary/10 p-2 text-[11px] text-muted-foreground">
        <Gift className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span>
          Usa siempre el mismo número de cliente: acumulando compras eres acreedor a promociones,
          mejores precios y prioridad en soporte.
        </span>
      </p>
    </div>
  );
}
