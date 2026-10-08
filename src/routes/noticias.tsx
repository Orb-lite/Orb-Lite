import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Newspaper,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowRight,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Share2,
  ShieldAlert,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { newsArticles, type NewsArticle } from "@/data/news";
import { CtaBanner } from "@/components/site-chrome";
import { toast } from "sonner";

export const Route = createFileRoute("/noticias")({
  head: () => ({
    meta: [
      {
        title: "Noticias y Novedades en Rastreo GPS y Telemetría Satelital | ORB-LITE",
      },
      {
        name: "description",
        content:
          "Mantente informado con las últimas noticias de telemetría, seguridad vehicular, optimización de combustible y actualizaciones de la plataforma ORB-LITE en México.",
      },
      {
        property: "og:title",
        content: "Noticias y Novedades en Rastreo GPS y Telemetría Satelital | ORB-LITE",
      },
      {
        property: "og:description",
        content:
          "Artículos, guías operativas de seguridad y novedades tecnológicas de la plataforma de rastreo GPS más confiable de México.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NoticiasPage,
});

const categories = [
  "Todas",
  "Plataforma",
  "Seguridad",
  "Logística",
  "Tecnología",
  "Economía",
  "B2B & Talleres",
] as const;

function NoticiasPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    return newsArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === "Todas" || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.some((paragraph) =>
          paragraph.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredArticle = newsArticles.find((a) => a.featured) || newsArticles[0];

  const handleShare = (article: NewsArticle) => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace de la noticia copiado al portapapeles");
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* HERO NOTICIAS */}
      <section className="mx-auto max-w-6xl px-5 pt-8 sm:pt-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Newspaper className="size-3.5" />
            <span>Centro de Noticias y Telemetría</span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold uppercase italic sm:text-5xl md:text-6xl text-foreground">
            Actualizaciones, <span className="text-gradient-lime">Seguridad</span> y Guías
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Descubre análisis técnicos, novedades del software ORB-LITE, protocolos de prevención de
            robo y consejos de optimización logística para tu vehículo o flotilla.
          </p>
        </div>

        {/* BUSCADOR Y FILTROS POR CATEGORÍA */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-y border-border/60 py-6">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border/80 bg-card/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px] max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por tema o palabra clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/80 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* ARTÍCULO DESTACADO (SI NO HAY BÚSQUEDA ACTIVA) */}
      {selectedCategory === "Todas" && searchQuery === "" && featuredArticle && (
        <section className="mx-auto max-w-6xl px-5">
          <div className="relative overflow-hidden rounded-3xl border border-primary/50 bg-gradient-to-br from-card/90 via-card/50 to-primary/5 p-6 sm:p-10 shadow-lg">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 size-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30">
                  <Sparkles className="size-3" />
                  Noticia Destacada
                </span>
                <span className="rounded bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {featuredArticle.category}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-primary" />
                  {featuredArticle.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" />
                  {featuredArticle.readTime}
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-6 grid gap-8 lg:grid-cols-12 items-start">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-display text-2xl font-bold uppercase sm:text-3xl text-foreground leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {featuredArticle.summary}
                </p>

                {expandedArticleId === featuredArticle.id ? (
                  <div className="mt-6 space-y-4 border-t border-border/60 pt-6 text-sm leading-relaxed text-foreground/90">
                    {featuredArticle.content.map((parr, idx) => (
                      <p key={idx}>{parr}</p>
                    ))}

                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setExpandedArticleId(null)}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-display text-xs font-bold uppercase text-muted-foreground hover:border-primary hover:text-foreground"
                      >
                        <ChevronUp className="size-4" />
                        Cerrar lectura completa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShare(featuredArticle)}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                      >
                        <Share2 className="size-3.5" />
                        Compartir artículo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedArticleId(featuredArticle.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition shadow"
                    >
                      <BookOpen className="size-4" />
                      Leer artículo completo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare(featuredArticle)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2.5 text-xs text-muted-foreground hover:border-primary hover:text-foreground transition"
                      aria-label="Compartir"
                    >
                      <Share2 className="size-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-primary/30 bg-background/60 p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-display text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="size-4" />
                  <span>Puntos Clave del Análisis</span>
                </div>
                <ul className="space-y-3">
                  {featuredArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                  Publicado por <strong className="text-foreground">{featuredArticle.author}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GRILLA DE ARTÍCULOS */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <h2 className="font-display text-xl font-bold uppercase italic sm:text-2xl text-foreground">
            {selectedCategory === "Todas"
              ? "Artículos Recientes"
              : `Categoría: ${selectedCategory}`}
          </h2>
          <span className="text-xs text-muted-foreground font-semibold">
            {filteredArticles.length} {filteredArticles.length === 1 ? "artículo" : "artículos"}
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border/80 p-12 text-center">
            <Newspaper className="mx-auto size-10 text-muted-foreground/60" />
            <h3 className="mt-4 font-display text-lg font-bold uppercase text-foreground">
              No se encontraron artículos
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Intenta con otra palabra clave o selecciona otra categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("Todas");
                setSearchQuery("");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-display text-xs font-bold uppercase text-primary-foreground hover:bg-primary/90"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => {
              const isExpanded = expandedArticleId === article.id;
              return (
                <article
                  key={article.id}
                  className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm transition hover:border-primary/60 hover:bg-card/90"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded bg-primary/10 px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="size-3 text-primary" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-lg font-bold uppercase text-foreground leading-snug hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {article.summary}
                    </p>

                    {/* VISTA EXPANDIDA DEL ARTÍCULO COMPLETO */}
                    {isExpanded && (
                      <div className="mt-5 space-y-3.5 border-t border-border/60 pt-4 text-xs leading-relaxed text-foreground/90">
                        {article.content.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}

                        <div className="mt-4 rounded-xl border border-primary/20 bg-background/50 p-3.5">
                          <p className="font-display text-[11px] font-bold uppercase text-primary mb-2">
                            Puntos destacados:
                          </p>
                          <ul className="space-y-1.5 text-[11px]">
                            {article.keyTakeaways.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="size-3.5 shrink-0 text-primary mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" />
                      {article.date}
                    </span>

                    <button
                      type="button"
                      onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                      className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase text-primary hover:underline"
                    >
                      <span>{isExpanded ? "Menos" : "Leer más"}</span>
                      {isExpanded ? (
                        <ChevronUp className="size-3.5" />
                      ) : (
                        <ArrowRight className="size-3.5" />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* SECCIÓN DE CONSULTORÍA RÁPIDA O SOPORTE */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="rounded-2xl border border-border/80 bg-background/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display text-xl font-bold uppercase text-foreground">
              ¿Requieres asesoría sobre algún tema de seguridad o telemetría?
            </h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Nuestros ingenieros de soporte están disponibles para orientarte en la configuración
              de alertas y selección de equipos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/contacto"
              className="rounded-lg bg-primary px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition shadow"
            >
              Contactar Soporte
            </Link>
            <Link
              to="/servicios"
              className="rounded-lg border border-border px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition"
            >
              Ver Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* CTA DE CIERRE */}
      <CtaBanner />
    </div>
  );
}
