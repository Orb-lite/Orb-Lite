import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { wialonUnits, type WialonUnit } from "@/lib/wialon.functions";
import { useWialonSession, type WialonSession } from "@/lib/wialon-session";

type UnitSelectorProps = {
  /** Se usa la sesión actual si no se proporciona una explícitamente. */
  session?: WialonSession | null;
  value?: WialonUnit | null;
  onSelectUnit: (unit: WialonUnit) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

/** Selector con búsqueda rápida de las unidades disponibles para el SID actual. */
export function UnitSelector({
  session: sessionOverride,
  value = null,
  onSelectUnit,
  placeholder = "Selecciona una unidad",
  disabled = false,
  className,
}: UnitSelectorProps) {
  const storedSession = useWialonSession();
  const session = sessionOverride ?? storedSession ?? null;
  const fetchUnits = useServerFn(wialonUnits);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // wialonUnits ejecuta core/search_items con los flags de posición y devuelve
  // el objeto completo que consume la plataforma para cada vehículo.
  const unitsQuery = useQuery({
    queryKey: ["wialon-units", session?.host, session?.sid],
    queryFn: () =>
      fetchUnits({ data: { host: session!.host, sid: session!.sid } }),
    enabled: session != null,
    staleTime: 15_000,
  });

  const filteredUnits = React.useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("es-MX");
    if (!needle) return unitsQuery.data?.units ?? [];
    return (unitsQuery.data?.units ?? []).filter((unit) =>
      `${unit.name} ${unit.id} ${unit.imei ?? ""} ${unit.creatorName ?? ""}`
        .toLocaleLowerCase("es-MX")
        .includes(needle),
    );
  }, [search, unitsQuery.data?.units]);

  const selectUnit = React.useCallback(
    (unit: WialonUnit) => {
      onSelectUnit(unit);
      setOpen(false);
      setSearch("");
    },
    [onSelectUnit],
  );

  const label = value?.name ?? placeholder;
  const unavailable = disabled || session == null;

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Seleccionar unidad"
            disabled={unavailable}
            className="w-full justify-between"
          >
            <span className="min-w-0 truncate">{label}</span>
            {unitsQuery.isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <ChevronsUpDown className="opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Buscar por nombre o ID…"
            />
            <CommandList>
              {unitsQuery.isLoading ? (
                <p className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" /> Cargando
                  unidades…
                </p>
              ) : null}
              {unitsQuery.isError ? (
                <p className="p-4 text-sm text-destructive">
                  {unitsQuery.error instanceof Error
                    ? unitsQuery.error.message
                    : "No se pudieron cargar las unidades."}
                </p>
              ) : null}
              {!unitsQuery.isLoading && !unitsQuery.isError ? (
                <>
                  <CommandEmpty>No se encontraron unidades.</CommandEmpty>
                  <CommandGroup heading={`${filteredUnits.length} unidad(es)`}>
                    {filteredUnits.map((unit) => (
                      <CommandItem
                        key={unit.id}
                        value={String(unit.id)}
                        onSelect={() => selectUnit(unit)}
                        className="justify-between"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium">
                            {unit.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            #{unit.id} ·{" "}
                            {unit.online ? "En línea" : "Sin señal"}
                            {unit.speed != null
                              ? ` · ${Math.round(unit.speed)} km/h`
                              : ""}
                          </span>
                        </span>
                        <Check
                          className={cn(
                            "ml-2 shrink-0",
                            value?.id === unit.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {!session && !disabled ? (
        <p className="text-xs text-muted-foreground">
          Inicia sesión en Wialon para consultar unidades.
        </p>
      ) : null}
    </div>
  );
}
