"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { theme } from "@/styles/theme";

export default function ProfilePage() {
  const { psychologist, isLoading } = useAuth();
  const router = useRouter();

  // Campos básicos
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Planes
  const [plans, setPlans] = useState<any[]>([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  const [planFeatures, setPlanFeatures] = useState("");
  const [planHighlighted, setPlanHighlighted] = useState(false);

  // Redes sociales
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // Especialidades
  const SPECIALTIES = ["Adolescencia", "Adultos", "Adultos Mayores", "Pareja"]

  useEffect(() => {
    if (!isLoading && !psychologist) router.push("/login");
  }, [psychologist, isLoading, router]);

  // Cargar datos del perfil
  useEffect(() => {
    if (!psychologist) return;
    const token = localStorage.getItem("token");

    fetch("/api/psychologist/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(({ data }) => {
        setName(data.name ?? "");
        setBio(data.bio ?? "");
        setPhone(data.phone ?? "");
        const VALID = ["Adolescencia", "Adultos", "Adultos Mayores", "Pareja"]
        setSpecialties((data.specialties ?? []).filter((s: string) => VALID.includes(s)));
        setPlans(data.plans ?? []);
        setSocialLinks(data.socialLinks ?? []);
      });
  }, [psychologist]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // Guardar info básica
  async function handleSaveBasic() {
    setSaving(true);
    await fetch("/api/psychologist/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, bio, phone, specialties }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // Añadir especialidad
  function handleAddSpecialty() {
    if (!newSpecialty.trim()) return;
    setSpecialties([...specialties, newSpecialty.trim()]);
    setNewSpecialty("");
  }

  // Eliminar especialidad
  function handleRemoveSpecialty(s: string) {
    setSpecialties(specialties.filter((x) => x !== s));
  }

  // Añadir red social
  async function handleAddSocialLink() {
    if (!newPlatform || !newUrl) return;
    const res = await fetch("/api/psychologist/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ platform: newPlatform, url: newUrl }),
    });
    const { data } = await res.json();
    setSocialLinks([...socialLinks, data]);
    setNewPlatform("");
    setNewUrl("");
  }

  // Eliminar red social
  async function handleRemoveSocialLink(id: string) {
    await fetch(`/api/psychologist/social-links/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setSocialLinks(socialLinks.filter((l) => l.id !== id));
  }

  // Añadir plan
  async function handleAddPlan() {
    const res = await fetch("/api/psychologist/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: "Nuevo plan",
        price: 60,
        description: "",
        features: [],
        highlighted: false,
        order: plans.length,
      }),
    });
    const { data } = await res.json();
    setPlans([...plans, data]);
  }

  // Eliminar plan
  async function handleRemovePlan(id: string) {
    await fetch(`/api/psychologist/plans/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPlans(plans.filter((p) => p.id !== id));
  }

  if (isLoading) return null;

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: theme.borderRadius.md,
    border: `1.5px solid ${theme.colors.sand300}`,
    fontSize: "14px",
    fontFamily: theme.fonts.body,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: 700,
    color: theme.colors.textSecondary,
    display: "block",
    marginBottom: "6px",
    letterSpacing: "0.06em",
  };

  const cardStyle = {
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    marginBottom: theme.spacing.lg,
  };

  return (
    <main style={{ minHeight: "100vh", background: theme.colors.background, fontFamily: theme.fonts.body, padding: theme.spacing.xxl }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: theme.spacing.xxl }}>
          <button onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", color: theme.colors.textSecondary, fontSize: "13px", cursor: "pointer", fontFamily: theme.fonts.body, marginBottom: "8px" }}>
            ← Volver al panel
          </button>
          <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "28px", color: theme.colors.textPrimary }}>
            Mi perfil
          </h1>
        </div>

        {/* Información básica */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: "18px", marginBottom: theme.spacing.lg }}>Información básica</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
            <div>
              <label style={labelStyle}>NOMBRE</label>
              <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>TELÉFONO / WHATSAPP</label>
              <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34600000000" />
            </div>
          </div>
          <div style={{ marginBottom: theme.spacing.md }}>
            <label style={labelStyle}>BIO</label>
            <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </div>

        {/* Especialidades */}
<div style={cardStyle}>
  <h2 style={{ fontFamily: theme.fonts.heading, fontSize: "18px", marginBottom: theme.spacing.lg }}>Especialidades</h2>
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    {SPECIALTIES.map((s) => {
      const selected = specialties.includes(s)
      return (
        <button
          key={s}
          onClick={() => setSpecialties(selected ? specialties.filter((x) => x !== s) : [...specialties, s])}
          style={{
            padding: "8px 18px",
            borderRadius: "100px",
            border: `1.5px solid ${selected ? theme.colors.sage400 : theme.colors.sand300}`,
            background: selected ? theme.colors.sage100 : "#fff",
            color: selected ? theme.colors.sage400 : theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
            fontSize: "13px",
            fontWeight: selected ? 600 : 400,
            cursor: "pointer",
          }}
        >
          {selected ? "✓ " : ""}{s}
        </button>
      )
    })}
  </div>
</div>

        {/* Planes */}
<div style={cardStyle}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing.lg }}>
    <h2 style={{ fontFamily: theme.fonts.heading, fontSize: "18px" }}>Planes y tarifas</h2>
    <button onClick={() => setShowPlanForm(!showPlanForm)} style={{ background: theme.colors.sage400, color: "#fff", border: "none", borderRadius: theme.borderRadius.md, padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: theme.fonts.body }}>
      {showPlanForm ? "Cancelar" : "+ Nuevo plan"}
    </button>
  </div>

  {showPlanForm && (
    <div style={{ border: `1px solid ${theme.colors.sand200}`, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
        <div>
          <label style={labelStyle}>NOMBRE</label>
          <input style={inputStyle} value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="Ej: Sesión individual" />
        </div>
        <div>
          <label style={labelStyle}>PRECIO (dejar vacío si es gratis)</label>
          <input style={inputStyle} type="number" value={planPrice} onChange={(e) => setPlanPrice(e.target.value)} placeholder="60" />
        </div>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <label style={labelStyle}>DESCRIPCIÓN</label>
        <input style={inputStyle} value={planDesc} onChange={(e) => setPlanDesc(e.target.value)} placeholder="Ej: Sesión de 50 minutos online" />
      </div>
      <div style={{ marginBottom: "8px" }}>
        <label style={labelStyle}>CARACTERÍSTICAS (separadas por coma)</label>
        <input style={inputStyle} value={planFeatures} onChange={(e) => setPlanFeatures(e.target.value)} placeholder="50 minutos, Videollamada segura, Notas de seguimiento" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: theme.spacing.md }}>
        <input type="checkbox" checked={planHighlighted} onChange={(e) => setPlanHighlighted(e.target.checked)} id="highlighted" />
        <label htmlFor="highlighted" style={{ fontSize: "13px", color: theme.colors.textSecondary }}>Destacar como "Más popular"</label>
      </div>
      <button
        onClick={async () => {
          const res = await fetch("/api/psychologist/plans", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              name: planName,
              price: planPrice ? parseFloat(planPrice) : null,
              description: planDesc,
              features: planFeatures.split(",").map((f) => f.trim()).filter(Boolean),
              highlighted: planHighlighted,
              order: plans.length,
            }),
          });
          const { data } = await res.json();
          setPlans([...plans, data]);
          setPlanName(""); setPlanPrice(""); setPlanDesc(""); setPlanFeatures(""); setPlanHighlighted(false);
          setShowPlanForm(false);
        }}
        style={{ background: theme.colors.sage400, color: "#fff", border: "none", borderRadius: theme.borderRadius.md, padding: "10px 24px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: theme.fonts.body }}
      >
        Crear plan
      </button>
    </div>
  )}

  {plans.length === 0 ? (
    <p style={{ color: theme.colors.textMuted, fontSize: "14px" }}>No hay planes creados.</p>
  ) : (
    plans.map((plan) => (
      <div key={plan.id} style={{ border: `1px solid ${theme.colors.sand200}`, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600 }}>{plan.name}</div>
          <div style={{ fontSize: "12px", color: theme.colors.textMuted }}>{plan.price !== null && plan.price > 0 ? `${plan.price}€` : "Gratis"}</div>
        </div>
        <button onClick={() => handleRemovePlan(plan.id)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.colors.textMuted, fontSize: "18px" }}>×</button>
      </div>
    ))
  )}
</div>

        {/* Redes sociales */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: "18px", marginBottom: theme.spacing.lg }}>Redes sociales</h2>
          {socialLinks.map((link) => (
            <div key={link.id} style={{ border: `1px solid ${theme.colors.sand200}`, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "capitalize" }}>{link.platform}</div>
                <div style={{ fontSize: "12px", color: theme.colors.textMuted }}>{link.url}</div>
              </div>
              <button onClick={() => handleRemoveSocialLink(link.id)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.colors.textMuted, fontSize: "18px" }}>×</button>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "8px", marginTop: theme.spacing.md }}>
            <select style={inputStyle} value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)}>
              <option value="">Plataforma</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="website">Web</option>
            </select>
            <input style={inputStyle} value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." />
            <button onClick={handleAddSocialLink} style={{ background: theme.colors.sage400, color: "#fff", border: "none", borderRadius: theme.borderRadius.md, padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: theme.fonts.body, whiteSpace: "nowrap" }}>
              + Añadir
            </button>
          </div>
        </div>
            {/* Botón guardar global */}
<button
  onClick={handleSaveBasic}
  disabled={saving}
  style={{ width: "100%", background: theme.colors.sage400, color: "#fff", border: "none", borderRadius: theme.borderRadius.md, padding: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: theme.fonts.body }}
>
  {saving ? "Guardando..." : saved ? "✓ Cambios guardados" : "Guardar todos los cambios"}
</button>
      </div>
    </main>
  );
}