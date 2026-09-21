import { createFileRoute } from "@tanstack/react-router";
import { WialonGuard } from "@/components/wialon-guard";
import { ReportChart } from "@/components/wialon/ReportChart";

export const Route = createFileRoute("/wialon/reportes")({
  head: () => ({
    meta: [
      { title: "Reportes y gráficas | Plataforma ORB-LITE" },
      {
        name: "description",
        content: "Gráficas de posición y sensores por unidad, con exportación a Excel para análisis administrativo.",
      },
      { property: "og:title", content: "Reportes y gráficas | Plataforma ORB-LITE" },
      { property: "og:description", content: "Gráficas de posición y sensores con exportación a Excel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WialonGuard>{(session) => <ReportChart session={session} />}</WialonGuard>,
});
