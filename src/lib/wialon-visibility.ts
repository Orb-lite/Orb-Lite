import * as React from "react";
import type { WialonSession } from "@/lib/wialon-session";

const EVENT = "wialon-visibility-change";

function storageKey(session: Pick<WialonSession, "host" | "userId">) {
  return `orblite.wialon.hidden.${session.host}.${session.userId}`;
}

function readHidden(key: string): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((v): v is number => typeof v === "number") : []);
  } catch {
    return new Set();
  }
}

/**
 * Unidades ocultas en el mapa (check desactivado). Se comparte entre la
 * pestaña Unidades y el Mapa, y se recuerda por cuenta en este navegador.
 */
export function useHiddenUnits(session: Pick<WialonSession, "host" | "userId">) {
  const key = storageKey(session);
  const [hidden, setHidden] = React.useState<Set<number>>(() => new Set());

  React.useEffect(() => {
    const sync = () => setHidden(readHidden(key));
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const update = React.useCallback(
    (fn: (current: Set<number>) => Set<number>) => {
      const next = fn(readHidden(key));
      window.localStorage.setItem(key, JSON.stringify([...next]));
      setHidden(next);
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );

  const setVisible = React.useCallback(
    (ids: number[], visible: boolean) =>
      update((current) => {
        const next = new Set(current);
        for (const id of ids) {
          if (visible) next.delete(id);
          else next.add(id);
        }
        return next;
      }),
    [update],
  );

  return { hidden, setVisible };
}

/** Estado del check general: todas, ninguna o algunas visibles. */
export function selectAllState(ids: number[], hidden: Set<number>): boolean | "indeterminate" {
  if (ids.length === 0) return false;
  const visible = ids.filter((id) => !hidden.has(id)).length;
  if (visible === ids.length) return true;
  if (visible === 0) return false;
  return "indeterminate";
}

/** Filtra por nombre de unidad, IMEI o usuario creador. */
export function matchesUnitSearch(
  unit: { name: string; id: number; imei: string | null; creatorName: string | null },
  search: string,
) {
  const needle = search.trim().toLocaleLowerCase("es-MX");
  if (!needle) return true;
  return [unit.name, unit.imei, unit.creatorName, String(unit.id)]
    .filter(Boolean)
    .some((value) => value!.toLocaleLowerCase("es-MX").includes(needle));
}
