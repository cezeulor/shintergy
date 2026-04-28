import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import * as mock from "./data/mock";

const fallbackContent = {
  company: mock.companyInfo,
  social: mock.socialMedia,
  hero: {
    badge: "Renta de retroexcavadora Caterpillar 420F2 IT",
    titleStart: "Soluciones en",
    titleHighlight: "construcción",
    titleEnd: "con respaldo profesional",
    subtitle:
      "Más de 30 años de experiencia rentando maquinaria pesada en Xalapa, Coatepec y zona conurbada. Operador, combustible y traslado incluidos.",
    pills: ["Operador certificado", "Combustible incluido", "Traslado sin costo"],
    stats: [
      { number: "30+", label: "Años del operador" },
      { number: "500+", label: "Obras completadas" },
      { number: "12", label: "Zonas de cobertura" },
    ],
  },
  maquina: mock.maquina,
  zonasCobertura: mock.zonasCobertura,
  advantages: mock.advantages,
  workProcess: mock.workProcess,
  galleryImages: mock.galleryImages,
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ContentProvider fallback={fallbackContent}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
            </Routes>
          </ContentProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
