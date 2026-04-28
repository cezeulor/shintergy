import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LogOut,
  Save,
  Trash2,
  Upload,
  RotateCw,
  Home as HomeIcon,
  Image as ImageIcon,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// --- small input helpers ---------------------------------------------------
const Field = ({ label, value, onChange, type = "text", placeholder = "", rows }) => (
  <div>
    <Label className="text-sm">{label}</Label>
    {rows ? (
      <Textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
    ) : (
      <Input
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
        placeholder={placeholder}
      />
    )}
  </div>
);

// --- image uploader --------------------------------------------------------
const ImageUploader = ({ onUploaded, authHeader }) => {
  const [uploading, setUploading] = useState(false);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await axios.post(`${API}/images/upload`, fd, {
        headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
      });
      onUploaded(data.url);
      toast.success("Imagen subida");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Error al subir imagen");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer bg-[#1a5336] hover:bg-[#143f28] text-white text-sm px-3 py-2 rounded-md transition-colors">
      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
      {uploading ? "Subiendo…" : "Subir imagen"}
      <input type="file" accept="image/*" onChange={handle} className="hidden" />
    </label>
  );
};

// --- list editor (array of strings) ---------------------------------------
const ListEditor = ({ items, onChange }) => {
  const update = (i, v) => onChange(items.map((x, idx) => (idx === i ? v : x)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...(items || []), ""]);
  return (
    <div className="space-y-2">
      {(items || []).map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input value={v} onChange={(e) => update(i, e.target.value)} />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => remove(i)}
            className="flex-shrink-0"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={add} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar
      </Button>
    </div>
  );
};

// --- image list editor (array of URLs) ------------------------------------
const ImageListEditor = ({ urls, onChange, authHeader }) => {
  const remove = (i) => onChange(urls.filter((_, idx) => idx !== i));
  const add = (url) => onChange([...(urls || []), url]);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {(urls || []).map((u, i) => (
          <div
            key={i}
            className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
          >
            <img src={u} alt={`img ${i}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
              title="Quitar"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </button>
          </div>
        ))}
      </div>
      <ImageUploader onUploaded={add} authHeader={authHeader} />
    </div>
  );
};

export const AdminDashboard = () => {
  const { user, checking, logout, authHeader, token } = useAuth();
  const { content, refresh } = useContent();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!checking && !user) navigate("/admin/login");
  }, [checking, user, navigate]);

  useEffect(() => {
    if (content) setDraft(JSON.parse(JSON.stringify(content)));
  }, [content]);

  if (!user || !draft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a5336]" />
      </div>
    );
  }

  const updatePath = (path, value) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let ref = next;
      for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]];
      ref[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${API}/content`,
        { data: draft },
        { headers: authHeader() }
      );
      await refresh();
      toast.success("Cambios guardados. Refresca la página principal para verlos.");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = async () => {
    if (!confirm("¿Restaurar los valores originales? Se perderán tus cambios.")) return;
    try {
      await axios.post(`${API}/content/reset`, {}, { headers: authHeader() });
      await refresh();
      toast.success("Contenido restaurado a valores originales");
    } catch {
      toast.error("Error al restaurar");
    }
  };

  const doLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0f1f18] text-white sticky top-0 z-20 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-lg">Panel de administración</h1>
            <p className="text-[11px] text-gray-300">
              Sesión: <span className="text-[#c9a961]">{user.username}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-[#1a5336]"
                data-testid="admin-ver-sitio"
              >
                <HomeIcon className="h-4 w-4 mr-1.5" />
                Ver sitio
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={save}
              disabled={saving}
              data-testid="admin-save"
              className="bg-[#c9a961] hover:bg-[#b99747] text-[#0f1f18] font-semibold"
            >
              <Save className="h-4 w-4 mr-1.5" />
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={doLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-red-500/20"
              data-testid="admin-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <Tabs defaultValue="empresa" className="w-full">
          <TabsList className="flex flex-wrap h-auto mb-4">
            <TabsTrigger value="empresa">Empresa</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="maquina">Máquina</TabsTrigger>
            <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
            <TabsTrigger value="listas">Listas</TabsTrigger>
            <TabsTrigger value="ventajas">Ventajas</TabsTrigger>
            <TabsTrigger value="galeria">Galería</TabsTrigger>
          </TabsList>

          {/* EMPRESA */}
          <TabsContent value="empresa">
            <Card title="Información de la empresa">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nombre" value={draft.company.name} onChange={(v) => updatePath("company.name", v)} />
                <Field label="Teléfono (con formato)" value={draft.company.phone} onChange={(v) => updatePath("company.phone", v)} />
                <Field label="Teléfono (solo dígitos, 10)" value={draft.company.phoneDigits} onChange={(v) => updatePath("company.phoneDigits", v)} />
                <Field label="WhatsApp (con formato)" value={draft.company.whatsapp} onChange={(v) => updatePath("company.whatsapp", v)} />
                <Field label="WhatsApp (dígitos, con LADA 52)" value={draft.company.whatsappDigits} onChange={(v) => updatePath("company.whatsappDigits", v)} />
                <Field label="Email" value={draft.company.email} onChange={(v) => updatePath("company.email", v)} />
                <Field label="Horarios" value={draft.company.horarios} onChange={(v) => updatePath("company.horarios", v)} />
                <Field label="Jornada laboral" value={draft.company.jornadaLaboral} onChange={(v) => updatePath("company.jornadaLaboral", v)} />
                <Field label="URL del logo" value={draft.company.logo} onChange={(v) => updatePath("company.logo", v)} />
                <Field label="Tagline (subtítulo corto)" value={draft.company.tagline} onChange={(v) => updatePath("company.tagline", v)} />
                <Field label="Subtítulo" value={draft.company.subtitle} onChange={(v) => updatePath("company.subtitle", v)} rows={2} />
              </div>
              <h4 className="font-semibold text-sm text-[#1a5336] mt-6 mb-2">Redes sociales</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Instagram" value={draft.social.instagram} onChange={(v) => updatePath("social.instagram", v)} />
                <Field label="Facebook" value={draft.social.facebook} onChange={(v) => updatePath("social.facebook", v)} />
                <Field label="TikTok" value={draft.social.tiktok} onChange={(v) => updatePath("social.tiktok", v)} />
              </div>
            </Card>
          </TabsContent>

          {/* HERO */}
          <TabsContent value="hero">
            <Card title="Sección Hero (arriba del sitio)">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Badge (texto superior)" value={draft.hero.badge} onChange={(v) => updatePath("hero.badge", v)} />
                <Field label="Título · parte inicial" value={draft.hero.titleStart} onChange={(v) => updatePath("hero.titleStart", v)} />
                <Field label="Título · palabra dorada (resaltada)" value={draft.hero.titleHighlight} onChange={(v) => updatePath("hero.titleHighlight", v)} />
                <Field label="Título · parte final" value={draft.hero.titleEnd} onChange={(v) => updatePath("hero.titleEnd", v)} />
                <div className="md:col-span-2">
                  <Field label="Subtítulo" value={draft.hero.subtitle} onChange={(v) => updatePath("hero.subtitle", v)} rows={3} />
                </div>
              </div>
              <h4 className="font-semibold text-sm text-[#1a5336] mt-5 mb-2">Pills (3 destacados)</h4>
              <ListEditor items={draft.hero.pills} onChange={(v) => updatePath("hero.pills", v)} />

              <h4 className="font-semibold text-sm text-[#1a5336] mt-5 mb-2">Estadísticas (3)</h4>
              <div className="space-y-2">
                {draft.hero.stats.map((s, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <Input value={s.number} onChange={(e) => updatePath(`hero.stats.${i}.number`, e.target.value)} placeholder="30+" />
                    <Input value={s.label} onChange={(e) => updatePath(`hero.stats.${i}.label`, e.target.value)} placeholder="Años del operador" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* MAQUINA */}
          <TabsContent value="maquina">
            <Card title="Datos de la maquinaria">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nombre" value={draft.maquina.nombre} onChange={(v) => updatePath("maquina.nombre", v)} />
                <Field label="Marca" value={draft.maquina.marca} onChange={(v) => updatePath("maquina.marca", v)} />
                <Field label="Modelo" value={draft.maquina.modelo} onChange={(v) => updatePath("maquina.modelo", v)} />
                <Field label="Año" type="number" value={draft.maquina.anio} onChange={(v) => updatePath("maquina.anio", v)} />
                <Field label="Tipo" value={draft.maquina.tipo} onChange={(v) => updatePath("maquina.tipo", v)} />
                <div className="md:col-span-2">
                  <Field label="Descripción corta" rows={2} value={draft.maquina.descripcionCorta} onChange={(v) => updatePath("maquina.descripcionCorta", v)} />
                </div>
                <div className="md:col-span-2">
                  <Field label="Descripción larga" rows={4} value={draft.maquina.descripcionLarga} onChange={(v) => updatePath("maquina.descripcionLarga", v)} />
                </div>
              </div>

              <h4 className="font-semibold text-sm text-[#1a5336] mt-6 mb-2">Precios (mostrar como texto)</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Por Día" value={draft.maquina.preciosMostrar.dia} onChange={(v) => updatePath("maquina.preciosMostrar.dia", v)} />
                <Field label="Por Semana" value={draft.maquina.preciosMostrar.semana} onChange={(v) => updatePath("maquina.preciosMostrar.semana", v)} />
                <Field label="Por Mes" value={draft.maquina.preciosMostrar.mes} onChange={(v) => updatePath("maquina.preciosMostrar.mes", v)} />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Para cambiar el total calculado en la cotización (IVA), pide al equipo técnico actualizar <code>PRICING</code> en el backend.
              </p>

              <h4 className="font-semibold text-sm text-[#1a5336] mt-6 mb-2">¿Qué incluye?</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Operador" value={draft.maquina.incluye.operador} onChange={(v) => updatePath("maquina.incluye.operador", v)} />
                <Field label="Combustible" value={draft.maquina.incluye.combustible} onChange={(v) => updatePath("maquina.incluye.combustible", v)} />
                <Field label="Traslado" value={draft.maquina.incluye.traslado} onChange={(v) => updatePath("maquina.incluye.traslado", v)} />
                <Field label="Seguro" value={draft.maquina.incluye.seguro} onChange={(v) => updatePath("maquina.incluye.seguro", v)} />
              </div>

              <h4 className="font-semibold text-sm text-[#1a5336] mt-6 mb-2">Condiciones de renta</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Anticipo" value={draft.maquina.condiciones.deposito} onChange={(v) => updatePath("maquina.condiciones.deposito", v)} />
                <Field label="Tiempo mínimo" value={draft.maquina.condiciones.minimo} onChange={(v) => updatePath("maquina.condiciones.minimo", v)} />
                <Field label="Jornada" value={draft.maquina.condiciones.jornada} onChange={(v) => updatePath("maquina.condiciones.jornada", v)} />
                <Field label="Reserva" value={draft.maquina.condiciones.reserva} onChange={(v) => updatePath("maquina.condiciones.reserva", v)} />
                <div className="md:col-span-2">
                  <Field label="Tarifa especial" value={draft.maquina.condiciones.tarifaEspecial} onChange={(v) => updatePath("maquina.condiciones.tarifaEspecial", v)} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* IMAGENES (de la máquina) */}
          <TabsContent value="imagenes">
            <Card title="Imágenes de la máquina (carrusel)">
              <p className="text-sm text-gray-600 mb-3">
                Se muestran en el carrusel principal. Acepta JPG/PNG/WebP hasta 6 MB.
              </p>
              <ImageListEditor
                urls={draft.maquina.imagenes}
                onChange={(v) => updatePath("maquina.imagenes", v)}
                authHeader={authHeader}
              />
            </Card>
          </TabsContent>

          {/* LISTAS: zonas, requisitos */}
          <TabsContent value="listas">
            <Card title="Zonas de cobertura">
              <ListEditor
                items={draft.zonasCobertura}
                onChange={(v) => updatePath("zonasCobertura", v)}
              />
            </Card>
            <div className="h-6" />
            <Card title="Requisitos del cliente">
              <ListEditor
                items={draft.maquina.requisitos}
                onChange={(v) => updatePath("maquina.requisitos", v)}
              />
            </Card>
          </TabsContent>

          {/* VENTAJAS + PROCESO */}
          <TabsContent value="ventajas">
            <Card title="Ventajas (6)">
              <div className="space-y-3">
                {draft.advantages.map((a, i) => (
                  <div key={a.id} className="grid md:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg">
                    <Input value={a.title} onChange={(e) => updatePath(`advantages.${i}.title`, e.target.value)} placeholder="Título" />
                    <Input value={a.description} onChange={(e) => updatePath(`advantages.${i}.description`, e.target.value)} placeholder="Descripción" className="md:col-span-2" />
                  </div>
                ))}
              </div>
            </Card>
            <div className="h-6" />
            <Card title="Proceso (3 pasos)">
              <div className="space-y-3">
                {draft.workProcess.map((s, i) => (
                  <div key={s.id} className="grid md:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
                    <Input value={s.step} onChange={(e) => updatePath(`workProcess.${i}.step`, e.target.value)} placeholder="01" />
                    <Input value={s.title} onChange={(e) => updatePath(`workProcess.${i}.title`, e.target.value)} placeholder="Título" />
                    <Input value={s.description} onChange={(e) => updatePath(`workProcess.${i}.description`, e.target.value)} placeholder="Descripción" className="md:col-span-2" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* GALERIA */}
          <TabsContent value="galeria">
            <Card title="Galería de proyectos">
              <div className="space-y-3">
                {draft.galleryImages.map((g, i) => (
                  <div key={g.id} className="grid md:grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg items-center">
                    <div className="md:col-span-3">
                      <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                        {g.url && <img src={g.url} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </div>
                    <div className="md:col-span-9 space-y-2">
                      <Input value={g.title} onChange={(e) => updatePath(`galleryImages.${i}.title`, e.target.value)} placeholder="Título" />
                      <Input value={g.category} onChange={(e) => updatePath(`galleryImages.${i}.category`, e.target.value)} placeholder="Categoría" />
                      <div className="flex gap-2">
                        <Input value={g.url} onChange={(e) => updatePath(`galleryImages.${i}.url`, e.target.value)} placeholder="URL de imagen" />
                        <ImageUploader onUploaded={(url) => updatePath(`galleryImages.${i}.url`, url)} authHeader={authHeader} />
                        <Button variant="outline" size="icon" onClick={() => updatePath("galleryImages", draft.galleryImages.filter((_, idx) => idx !== i))}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    updatePath("galleryImages", [
                      ...draft.galleryImages,
                      { id: Date.now(), url: "", title: "Nueva imagen", category: "Trabajos" },
                    ])
                  }
                >
                  <Plus className="h-4 w-4 mr-2" /> Agregar imagen a galería
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            ¿Quieres restaurar el contenido original de fábrica?
          </div>
          <Button
            variant="outline"
            onClick={resetDefaults}
            data-testid="admin-reset"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Restaurar originales
          </Button>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
    <h3 className="font-semibold text-[#1a5336] mb-4 flex items-center gap-2">
      <ImageIcon className="h-4 w-4 text-[#c9a961]" />
      {title}
    </h3>
    {children}
  </div>
);
