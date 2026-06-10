"use client"
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye, RotateCw, Save, ArrowLeft, Cloud, CloudOff, Loader2,
  User, Briefcase, GraduationCap, Globe, Star, Heart, PenLine,
  ChevronDown, LayoutTemplate, Palette, SlidersHorizontal,
  FileText, Sparkles, Monitor, Crown, Lock
} from "lucide-react";
import PersonalDetailsForm from "@/app/components/PersonalDetailsForm";
import { Education, Experience, Hobby, Language, PersonalDetails, Skill } from "@/type";
import CVPreview from "@/app/components/CVPreview";
import ExperienceForm from "@/app/components/ExperienceForm";
import EducationForm from "@/app/components/EducationForm";
import LanguageForm from "@/app/components/LanguageForm";
import SkillForm from "@/app/components/SkillForm";
import HobbyForm from "@/app/components/HobbyForm";
import { trackEvent } from "@/app/components/AnalyticsTracker";
import { canUseTemplate, CV_TEMPLATES, getTemplateTier, type UserPlan } from "@/lib/cvTemplates";
import { getPersonalDescriptionError, isPersonalDescriptionValid } from "@/lib/cvValidation";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";

const PREMIUM_PAYMENT_URL = 'https://pay.wave.com/m/M_ci_x9IzJZ0zY6sa/c/ci/?amount=1000';
const VIP_PAYMENT_URL = 'https://pay.wave.com/m/M_ci_x9IzJZ0zY6sa/c/ci/?amount=3000';

// ─── Accordion Section Component ────────────────────────────────────────────
function AccordionSection({
  id,
  icon: Icon,
  title,
  badge,
  color = "primary",
  children,
  onReset,
  defaultOpen = false,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  badge?: number;
  color?: string;
  children: React.ReactNode;
  onReset?: () => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="builder-section">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        className="w-full flex items-center justify-between py-2 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <span className="builder-section-label">
            <Icon className="w-3 h-3" />
            <span>{title}</span>
          </span>
          {badge !== undefined && badge > 0 && (
            <span className="builder-section-badge">{badge}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onReset && open && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onReset(); }}
              className="builder-reset-button"
              title="Réinitialiser"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      <div
        className={`transition-all duration-300 overflow-hidden ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="pb-5 pt-3">{children}</div>
      </div>
    </div>
  );
}

// ─── Template Card ───────────────────────────────────────────────────────────
function TemplateCard({
  name,
  label,
  description,
  preview,
  selected,
  onSelect,
  locked = false,
  tier,
  lockedLabel = 'Plan requis',
}: {
  name: string;
  label: string;
  description: string;
  preview: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  locked?: boolean;
  tier?: string;
  lockedLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-200 text-left cursor-pointer hover:scale-[1.02] active:scale-100 ${
        selected
          ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/30"
          : "border-base-content/10 hover:border-base-content/30"
      }`}
    >
      {/* Mini preview */}
      <div className="h-24 bg-base-200 flex items-center justify-center overflow-hidden relative">
        {preview}
        {tier && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-warning px-2 py-0.5 text-[9px] font-black uppercase text-warning-content shadow">
            <Crown className="h-3 w-3" /> {tier}
          </span>
        )}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-300/75 backdrop-blur-[1px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-base-100 px-3 py-1 text-[10px] font-black text-base-content shadow">
              <Lock className="h-3 w-3" /> {lockedLabel}
            </span>
          </div>
        )}
        {selected && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <span className="badge badge-primary badge-sm font-bold">✓ Sélectionné</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="font-bold text-sm text-base-content">{label}</p>
        <p className="text-[11px] text-base-content/55 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </button>
  );
}

// ─── Mini CV previews for template cards ─────────────────────────────────────
const ClassicMiniPreview = () => (
  <div className="w-full h-full p-2 flex gap-2 scale-90">
    <div className="w-1/3 bg-primary/20 rounded h-full flex flex-col gap-1 p-1">
      <div className="w-8 h-8 rounded-full bg-primary/40 mx-auto" />
      <div className="h-1 bg-base-content/20 rounded w-full" />
      <div className="h-1 bg-base-content/20 rounded w-3/4" />
    </div>
    <div className="w-2/3 flex flex-col gap-1.5 p-1">
      <div className="h-2 bg-base-content/30 rounded w-3/4" />
      <div className="h-1.5 bg-primary/50 rounded w-1/2" />
      <div className="h-0.5 bg-base-content/20 rounded w-full mt-1" />
      <div className="h-1 bg-base-content/15 rounded w-full" />
      <div className="h-1 bg-base-content/15 rounded w-5/6" />
    </div>
  </div>
);

const ModernMiniPreview = () => (
  <div className="w-full h-full p-2 flex flex-col gap-1.5 scale-90">
    <div className="flex items-center gap-2 bg-base-300 rounded p-1.5">
      <div className="w-7 h-7 rounded-full bg-primary/40 shrink-0" />
      <div className="flex flex-col gap-0.5 flex-1">
        <div className="h-1.5 bg-base-content/30 rounded w-3/4" />
        <div className="h-1 bg-primary/50 rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-2 flex-1">
      <div className="w-2/3 flex flex-col gap-1">
        <div className="h-1 bg-primary/30 rounded w-full" />
        <div className="h-0.5 bg-base-content/15 rounded w-full" />
        <div className="h-0.5 bg-base-content/15 rounded w-4/5" />
      </div>
      <div className="w-1/3 flex flex-col gap-1">
        <div className="h-1 bg-primary/30 rounded w-full" />
        <div className="h-0.5 bg-base-content/15 rounded w-full" />
      </div>
    </div>
  </div>
);

const MinimalistMiniPreview = () => (
  <div className="w-full h-full p-2 flex flex-col items-center gap-1 scale-90">
    <div className="w-7 h-7 rounded-full bg-base-content/20 mx-auto" />
    <div className="h-2 bg-base-content/30 rounded w-2/3" />
    <div className="h-1 bg-primary/40 rounded w-1/3" />
    <div className="h-px bg-base-content/15 w-full" />
    <div className="h-0.5 bg-base-content/15 rounded w-full" />
    <div className="h-0.5 bg-base-content/15 rounded w-5/6" />
    <div className="h-0.5 bg-base-content/15 rounded w-4/5" />
  </div>
);

const CreativeMiniPreview = () => (
  <div className="w-full h-full flex scale-90">
    <div className="w-1/3 h-full bg-primary/80 flex flex-col gap-1 p-1.5 rounded-l">
      <div className="w-8 h-8 rounded-lg bg-primary-content/30 mx-auto mb-1" />
      <div className="h-1 bg-primary-content/40 rounded w-full" />
      <div className="h-0.5 bg-primary-content/25 rounded w-3/4" />
      <div className="h-1 bg-secondary/60 rounded-full w-full mt-1" />
      <div className="h-1 bg-secondary/60 rounded-full w-2/3" />
    </div>
    <div className="w-2/3 h-full flex flex-col gap-1 p-1.5">
      <div className="h-1.5 bg-base-content/30 rounded w-3/4" />
      <div className="h-1 bg-primary/40 rounded w-1/2 mb-1" />
      <div className="h-4 bg-base-200 rounded-lg w-full" />
      <div className="h-4 bg-base-200 rounded-lg w-full" />
    </div>
  </div>
);

const ExecutiveMiniPreview = () => (
  <div className="w-full h-full p-2 flex flex-col gap-1 scale-90">
    <div className="text-center border-b border-primary/50 pb-1 mb-1">
      <div className="h-2 bg-base-content/35 rounded w-2/3 mx-auto" />
      <div className="h-1 bg-primary/50 rounded w-1/3 mx-auto mt-0.5" />
      <div className="flex justify-center gap-1 mt-0.5">
        <div className="h-0.5 bg-base-content/20 rounded w-1/4" />
        <div className="h-0.5 bg-base-content/20 rounded w-1/4" />
      </div>
    </div>
    <div className="flex gap-1.5 flex-1">
      <div className="w-2/3 flex flex-col gap-1">
        <div className="h-0.5 bg-primary/40 rounded w-full" />
        <div className="h-0.5 bg-base-content/15 rounded w-full" />
        <div className="h-0.5 bg-base-content/15 rounded w-5/6" />
      </div>
      <div className="w-1/3 flex flex-col gap-1">
        <div className="h-0.5 bg-primary/40 rounded w-full" />
        <div className="h-0.5 bg-base-content/15 rounded w-full" />
        <div className="h-0.5 bg-base-content/15 rounded w-3/4" />
      </div>
    </div>
  </div>
);
// ─── Main Builder Page ────────────────────────────────────────────────────────
const VipSignatureMiniPreview = () => (
  <div className="w-full h-full grid grid-cols-[38%_1fr] scale-90">
    <div className="h-full bg-primary/15 p-2 flex flex-col items-center gap-1">
      <div className="w-8 h-8 rounded-full bg-primary/50" />
      <div className="h-1.5 bg-base-content/35 rounded w-full" />
      <div className="h-1 bg-primary/45 rounded w-3/4" />
      <div className="mt-2 h-px bg-primary/40 w-full" />
      <div className="h-0.5 bg-base-content/20 rounded w-full" />
      <div className="h-0.5 bg-base-content/20 rounded w-5/6" />
    </div>
    <div className="p-2 flex flex-col gap-1.5">
      <div className="h-4 rounded-lg bg-primary/10 border border-primary/20" />
      <div className="h-1 bg-primary/50 rounded w-1/3" />
      <div className="h-0.5 bg-base-content/20 rounded w-full" />
      <div className="h-0.5 bg-base-content/20 rounded w-5/6" />
      <div className="h-4 rounded bg-base-200" />
    </div>
  </div>
);

const AtsClassicMiniPreview = () => (
  <div className="w-full h-full bg-white p-3 text-[#2a2522] scale-90">
    <div className="mx-auto mb-2 h-2 w-2/3 rounded bg-[#2a2522]" />
    <div className="mx-auto mb-3 h-1 w-1/2 rounded bg-[#2a2522]/45" />
    <div className="mb-2 h-px w-full bg-[#2a2522]/60" />
    <div className="space-y-1">
      <div className="h-1 w-1/3 rounded bg-[#2a2522]/70" />
      <div className="h-0.5 w-full rounded bg-[#2a2522]/25" />
      <div className="h-0.5 w-5/6 rounded bg-[#2a2522]/20" />
    </div>
    <div className="my-2 h-px w-full bg-[#2a2522]/60" />
    <div className="space-y-1">
      <div className="h-1 w-1/2 rounded bg-[#2a2522]/70" />
      <div className="h-0.5 w-full rounded bg-[#2a2522]/25" />
      <div className="h-0.5 w-4/5 rounded bg-[#2a2522]/20" />
    </div>
  </div>
);

const VipAtlasMiniPreview = () => (
  <div className="w-full h-full flex flex-col scale-90">
    <div className="h-8 bg-primary rounded-t p-1.5 flex items-center gap-1.5">
      <div className="h-5 w-5 rounded bg-primary-content/30" />
      <div className="flex-1 space-y-1">
        <div className="h-1.5 bg-primary-content/50 rounded w-2/3" />
        <div className="h-1 bg-primary-content/35 rounded w-1/2" />
      </div>
    </div>
    <div className="flex flex-1 gap-1.5 p-2">
      <div className="flex-1 space-y-1">
        <div className="h-1 bg-primary/50 rounded w-1/2" />
        <div className="h-4 rounded border border-base-content/10" />
        <div className="h-4 rounded border border-base-content/10" />
      </div>
      <div className="w-1/3 rounded bg-base-200" />
    </div>
  </div>
);

const getTemplatePreview = (templateId: string) => {
  const previews: Record<string, React.ReactNode> = {
    classic: <ClassicMiniPreview />,
    modern: <ModernMiniPreview />,
    minimalist: <MinimalistMiniPreview />,
    starter: <MinimalistMiniPreview />,
    clean: <ModernMiniPreview />,
    timeline: <ClassicMiniPreview />,
    'compact-pro': <ExecutiveMiniPreview />,
    graduate: <MinimalistMiniPreview />,
    administrative: <ModernMiniPreview />,
    'ats-simple': <AtsClassicMiniPreview />,
    'ats-ivoire': <AtsClassicMiniPreview />,
    'ats-clean-line': <AtsClassicMiniPreview />,
    'ats-academic': <AtsClassicMiniPreview />,
    creative: <CreativeMiniPreview />,
    executive: <ExecutiveMiniPreview />,
    'pro-sidebar': <ClassicMiniPreview />,
    'corporate-plus': <ExecutiveMiniPreview />,
    elegant: <MinimalistMiniPreview />,
    focus: <ModernMiniPreview />,
    tech: <CreativeMiniPreview />,
    consultant: <ExecutiveMiniPreview />,
    'finance-pro': <ExecutiveMiniPreview />,
    'project-lead': <ClassicMiniPreview />,
    'sales-pro': <ModernMiniPreview />,
    'hr-pro': <MinimalistMiniPreview />,
    'ats-senior-pro': <AtsClassicMiniPreview />,
    'ats-consulting-pro': <AtsClassicMiniPreview />,
    'ats-tech-lead': <AtsClassicMiniPreview />,
    'ats-manager-pro': <AtsClassicMiniPreview />,
    'vip-signature': <VipSignatureMiniPreview />,
    'vip-atlas': <VipAtlasMiniPreview />,
    prestige: <VipSignatureMiniPreview />,
    director: <ExecutiveMiniPreview />,
    portfolio: <CreativeMiniPreview />,
    luxe: <VipSignatureMiniPreview />,
    elite: <VipAtlasMiniPreview />,
    'ceo-brief': <VipSignatureMiniPreview />,
    'global-leader': <VipAtlasMiniPreview />,
    'board-room': <VipSignatureMiniPreview />,
    'ats-director-elite': <AtsClassicMiniPreview />,
    'ats-global-elite': <AtsClassicMiniPreview />,
  };

  return previews[templateId] || <ClassicMiniPreview />;
};

const getTemplateBadge = (tier: UserPlan) => {
  if (tier === 'premium') return '1000F';
  if (tier === 'vip') return 'VIP';
  return 'Gratuit';
};

const getLockedLabel = (tier: UserPlan) => {
  if (tier === 'premium') return 'Plan 1000F';
  if (tier === 'vip') return 'Plan 3000F';
  return 'Gratuit';
};

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // CV Data
  const [cvName, setCvName] = useState("Mon CV");
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: '', email: '', phone: '', address: '', photoUrl: '', postSeeking: '', description: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [theme, setTheme] = useState<string>('cupcake');
  const [template, setTemplate] = useState<string>('classic');
  const [fontSize, setFontSize] = useState<number>(100);
  const [zoom, setZoom] = useState<number>(146);
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [experiences, setExperience] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [editorTab, setEditorTab] = useState<'content' | 'design'>('content');
  const [viewportWidth, setViewportWidth] = useState(390);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const cvPreviewRef = useRef(null);

  const getPaymentUrlForTemplate = (templateName: string) => {
    return getTemplateTier(templateName) === 'premium' ? PREMIUM_PAYMENT_URL : VIP_PAYMENT_URL;
  };

  const refreshUserPlan = async () => {
    try {
      const sessionRes = await fetch('/api/auth/session', { cache: 'no-store' });
      if (!sessionRes.ok) return userPlan;
      const sessionData = await sessionRes.json();
      const latestPlan = (sessionData.user?.plan || userPlan) as UserPlan;
      setUserPlan(latestPlan);
      return latestPlan;
    } catch {
      return userPlan;
    }
  };

  const handleSelectTemplate = async (templateName: string) => {
    const latestPlan = await refreshUserPlan();
    if (!canUseTemplate(latestPlan, templateName)) {
      trackEvent('upgrade_click', { source: 'template_locked', template: templateName, plan: latestPlan });
      window.location.href = getPaymentUrlForTemplate(templateName);
      return;
    }
    trackEvent('template_select', { template: templateName, plan: latestPlan });
    setTemplate(templateName);
  };

  // Fetch CV data
  useEffect(() => {
    const fetchCv = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/cvs/${id}`);
        if (!res.ok) {
          if (res.status === 401) { router.push('/login'); return; }
          throw new Error("CV introuvable ou accès refusé.");
        }
        const sessionRes = await fetch('/api/auth/session');
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setUserPlan((sessionData.user?.plan || 'free') as UserPlan);
        }
        const data = await res.json();
        const cv = data.cv;
        setCvName(cv.name);
        setPersonalDetails(cv.personalDetails || {});
        setTheme(cv.theme || 'cupcake');
        setTemplate(cv.template || 'classic');
        setFontSize(Number(cv.fontSize || 100));
        setExperience(cv.experiences || []);
        setEducations(cv.educations || []);
        setLanguages(cv.languages || []);
        setSkills(cv.skills || []);
        setHobbies(cv.hobbies || []);
        if (cv.personalDetails?.photoUrl) {
          fetch(cv.personalDetails.photoUrl)
            .then(r => r.blob())
            .then(blob => setFile(new File([blob], "profile.jpg", { type: blob.type })))
            .catch(() => {});
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Erreur lors du chargement du CV.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCv();
  }, [id, router]);

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Auto-save
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => handleSave(), 1500);
    return () => clearTimeout(timer);
  }, [personalDetails, experiences, educations, languages, skills, hobbies, theme, template, fontSize, cvName]);

  const handleSave = async () => {
    if (loading) return;
    if (!isPersonalDescriptionValid(personalDetails)) {
      setSaveStatus('error');
      return;
    }
    setSaving(true);
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/cvs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cvName, personalDetails, experiences, educations, languages, skills, hobbies, theme, template, fontSize }),
      });
      if (!res.ok) throw new Error("Erreur de sauvegarde");
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateFromPrompt = async () => {
    const prompt = aiPrompt.trim();
    if (!prompt || aiGenerating) return;

    setAiGenerating(true);
    setAiError("");
    try {
      const res = await fetch('/api/ai/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation impossible.");

      const cv = data.cv || {};
      if (cv.name) setCvName(cv.name);
      setPersonalDetails((current) => ({ ...current, ...(cv.personalDetails || {}) }));
      setExperience(Array.isArray(cv.experiences) ? cv.experiences : []);
      setEducations(Array.isArray(cv.educations) ? cv.educations : []);
      setLanguages(Array.isArray(cv.languages) ? cv.languages : []);
      setSkills(Array.isArray(cv.skills) ? cv.skills : []);
      setHobbies(Array.isArray(cv.hobbies) ? cv.hobbies : []);
      if (cv.template) setTemplate(cv.template);
      if (cv.theme) setTheme(cv.theme);
      setEditorTab('design');
      trackEvent('ai_generate_cv', { cvId: id });
    } catch (error: any) {
      setAiError(error.message || "Une erreur est survenue pendant la generation.");
    } finally {
      setAiGenerating(false);
    }
  };

  const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
    "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
    "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
    "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset",
  ];

  const handleDownloadPdf = async () => {
    if (!isPersonalDescriptionValid(personalDetails)) {
      alert(getPersonalDescriptionError());
      return;
    }
    const element = cvPreviewRef.current as HTMLElement | null;
    if (!element) return;
    try {
      const images = Array.from(element.querySelectorAll('img'));
      await Promise.all(images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }));

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: "portrait", unit: 'mm', format: "A4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imageHeight = Math.min(pdfHeight, (canvas.height * pdfWidth) / canvas.width);
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imageHeight);
      pdf.save(`${cvName.replace(/\s+/g, '_')}.pdf`);
      trackEvent('download', { cvId: id, template, theme });
      (document.getElementById('modal_preview') as HTMLDialogElement)?.close();
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, zIndex: 9999 });
    } catch (err) {
      console.error('PDF Error:', err);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-base-content/60 text-sm">Chargement du document...</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center p-6">
        <div className="card bg-base-200 border border-base-content/10 p-8 max-w-md w-full text-center shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold text-error mb-4">Une erreur est survenue</h2>
          <p className="text-base-content/75 mb-6">{errorMessage}</p>
          <Link href="/dashboard" className="btn btn-primary rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour au Tableau de Bord
          </Link>
        </div>
      </div>
    );
  }

  // ── Editor Panel (shared between desktop & mobile) ─────────────────────────
  const renderEditorPanel = () => (
    <div className="builder-editor flex flex-col h-full">

      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#071116] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/dashboard" className="btn btn-sm btn-ghost btn-circle shrink-0 text-slate-300 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <input
            type="text"
            value={cvName}
            onChange={(e) => setCvName(e.target.value)}
            className="input input-sm input-ghost font-bold text-base p-0 h-auto border-none focus:outline-none focus:bg-white/10 px-2 rounded min-w-0 truncate max-w-[140px] sm:max-w-xs text-slate-100"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className={`btn btn-sm gap-1.5 rounded-lg ${aiPanelOpen ? 'btn-secondary' : 'btn-ghost border border-white/10 text-slate-200 hover:bg-white/10'}`}
            onClick={() => setAiPanelOpen((open) => !open)}
            type="button"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prompt IA</span>
          </button>
          {/* Save status */}
          <div className="tooltip tooltip-bottom" data-tip={
            saveStatus === 'saved' ? 'Sauvegardé' :
            saveStatus === 'saving' ? 'Sauvegarde...' : 'Erreur'
          }>
            {saveStatus === 'saving' && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
            {saveStatus === 'saved' && <Cloud className="w-4 h-4 text-success" />}
            {saveStatus === 'error' && <CloudOff className="w-4 h-4 text-error" />}
          </div>
          <button
            className="btn btn-primary btn-sm gap-1.5 rounded-lg"
            onClick={() => (document.getElementById('modal_preview') as HTMLDialogElement)?.showModal()}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prévisualiser</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs: Content / Design */}
      <div className="flex border-b border-white/10 bg-[#08151a] shrink-0">
        <button
          onClick={() => setEditorTab('content')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all ${
            editorTab === 'content'
              ? 'border-b-2 border-primary text-primary bg-white/[0.04]'
              : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <PenLine className="w-3.5 h-3.5" /> Contenu
        </button>
        <button
          onClick={() => setEditorTab('design')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all ${
            editorTab === 'design'
              ? 'border-b-2 border-primary text-primary bg-white/[0.04]'
              : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" /> Design
        </button>
      </div>

      {aiPanelOpen && (
        <div className="border-b border-white/10 bg-[#0b1b22] px-4 py-3">
          <label className="mb-2 flex items-center gap-2 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Generer un CV avec un prompt
          </label>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="textarea textarea-bordered min-h-24 w-full resize-none text-xs"
            placeholder="Exemple: Cree un CV pour un developpeur full-stack senior a Abidjan, 6 ans d experience, React, Node.js, AWS, projets fintech, style simple et naturel."
          />
          {aiError && <p className="mt-2 text-xs text-error">{aiError}</p>}
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-[11px] leading-relaxed text-slate-400">
              Le contenu genere reste modifiable dans les champs du CV.
            </p>
            <button
              type="button"
              onClick={handleGenerateFromPrompt}
              disabled={!aiPrompt.trim() || aiGenerating}
              className="btn btn-primary btn-sm shrink-0 gap-1.5 rounded-lg"
            >
              {aiGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Generer
            </button>
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">

        {/* ── CONTENT TAB ── */}
        {editorTab === 'content' && (
          <div className="px-6 py-4 flex flex-col gap-3">
            <AccordionSection
              id="personal"
              icon={User}
              title="Informations personnelles"
              color="primary"
              onReset={() => setPersonalDetails({ fullName: '', email: '', phone: '', address: '', photoUrl: '', postSeeking: '', description: '' })}
              defaultOpen={true}
            >
              <PersonalDetailsForm
                personalDetails={personalDetails}
                setPersonalDetails={setPersonalDetails}
                setFile={setFile}
              />
            </AccordionSection>

            <AccordionSection
              id="experience"
              icon={Briefcase}
              title="Expériences"
              badge={experiences.length}
              color="secondary"
              onReset={() => setExperience([])}
            >
              <ExperienceForm experience={experiences} setExperiences={setExperience} />
            </AccordionSection>

            <AccordionSection
              id="education"
              icon={GraduationCap}
              title="Formations"
              badge={educations.length}
              color="accent"
              onReset={() => setEducations([])}
            >
              <EducationForm educations={educations} setEducations={setEducations} />
            </AccordionSection>

            <AccordionSection
              id="languages"
              icon={Globe}
              title="Langues"
              badge={languages.length}
              color="info"
              onReset={() => setLanguages([])}
            >
              <LanguageForm languages={languages} setLanguages={setLanguages} />
            </AccordionSection>

            <AccordionSection
              id="skills"
              icon={Star}
              title="Compétences"
              badge={skills.length}
              color="warning"
              onReset={() => setSkills([])}
            >
              <SkillForm skills={skills} setSkills={setSkills} />
            </AccordionSection>

            <AccordionSection
              id="hobbies"
              icon={Heart}
              title="Loisirs & Centres d'intérêt"
              badge={hobbies.length}
              color="error"
              onReset={() => setHobbies([])}
            >
              <HobbyForm hobbies={hobbies} setHobbies={setHobbies} />
            </AccordionSection>

            {/* Save indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 pb-2">
              <span>
                {saveStatus === 'saved' ? '✓ Modifications enregistrées' : saveStatus === 'saving' ? 'Enregistrement...' : '⚠ Erreur de sauvegarde'}
              </span>
              <button onClick={handleSave} disabled={saving} className="btn btn-xs btn-ghost btn-outline rounded-lg gap-1 border-white/15 text-slate-300 hover:bg-white/10">
                <Save className="w-3 h-3" /> Forcer
              </button>
            </div>
          </div>
        )}

        {/* ── DESIGN TAB ── */}
        {editorTab === 'design' && (
          <div className="px-6 py-5 flex flex-col gap-6">

            {/* Template Selector */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-100">
                <LayoutTemplate className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-base-content">Modèle de CV</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CV_TEMPLATES.map((templateOption) => {
                  const locked = !canUseTemplate(userPlan, templateOption.id);
                  return (
                    <TemplateCard
                      key={templateOption.id}
                      name={templateOption.id}
                      label={templateOption.label}
                      description={templateOption.description}
                      preview={getTemplatePreview(templateOption.id)}
                      selected={template === templateOption.id}
                      onSelect={() => handleSelectTemplate(templateOption.id)}
                      locked={locked}
                      tier={getTemplateBadge(templateOption.tier)}
                      lockedLabel={getLockedLabel(templateOption.tier)}
                    />
                  );
                })}
              </div>
              <div className="hidden">
                <TemplateCard
                  name="classic"
                  label="Classique"
                  description="Sidebar colorée, mise en page traditionnelle"
                  preview={<ClassicMiniPreview />}
                  selected={template === 'classic'}
                  onSelect={() => handleSelectTemplate('classic')}
                />
                <TemplateCard
                  name="modern"
                  label="Moderne"
                  description="Header banner, colonnes épurées"
                  preview={<ModernMiniPreview />}
                  selected={template === 'modern'}
                  onSelect={() => handleSelectTemplate('modern')}
                />
                <TemplateCard
                  name="minimalist"
                  label="Minimaliste"
                  description="Mono-colonne, très épuré"
                  preview={<MinimalistMiniPreview />}
                  selected={template === 'minimalist'}
                  onSelect={() => handleSelectTemplate('minimalist')}
                />
                <TemplateCard
                  name="creative"
                  label="Créatif"
                  description="Sidebar colorée, cartes arrondies"
                  preview={<CreativeMiniPreview />}
                  selected={template === 'creative'}
                  onSelect={() => handleSelectTemplate('creative')}
                />
                <TemplateCard
                  name="executive"
                  label="Executive"
                  description="Sobre et professionnel, sans photo"
                  preview={<ExecutiveMiniPreview />}
                  selected={template === 'executive'}
                  onSelect={() => handleSelectTemplate('executive')}
                />
                <TemplateCard
                  name="vip-signature"
                  label="Signature VIP"
                  description="CV premium avec colonne signature et profil renforcÃ©"
                  preview={<VipSignatureMiniPreview />}
                  selected={template === 'vip-signature'}
                  onSelect={() => handleSelectTemplate('vip-signature')}
                  locked={userPlan !== 'vip'}
                  tier="VIP"
                />
                <TemplateCard
                  name="vip-atlas"
                  label="Atlas VIP"
                  description="EntÃªte puissant, blocs experts et rendu haut de gamme"
                  preview={<VipAtlasMiniPreview />}
                  selected={template === 'vip-atlas'}
                  onSelect={() => handleSelectTemplate('vip-atlas')}
                  locked={userPlan !== 'vip'}
                  tier="VIP"
                />
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-100">
                <Palette className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-base-content">Palette de couleurs</h3>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="select select-bordered select-sm w-full"
              >
                {themes.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
              {/* Theme Preview Swatches */}
              <div className="mt-3 flex flex-wrap gap-1.5" data-theme={theme}>
                {['bg-primary', 'bg-secondary', 'bg-accent', 'bg-base-100', 'bg-base-200', 'bg-base-300'].map(cls => (
                  <div key={cls} className={`w-6 h-6 rounded-full ${cls} border border-base-content/10 shadow-sm`} title={cls} />
                ))}
                <span className="text-xs text-base-content/40 self-center ml-1">Aperçu thème: <strong>{theme}</strong></span>
              </div>
            </div>

            {/* Font size */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-100">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-base-content">Taille de la police</h3>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0b1b22] p-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-xs btn-outline border-white/15 text-slate-200"
                    onClick={() => setFontSize((value) => Math.max(85, value - 5))}
                  >
                    A-
                  </button>
                  <input
                    type="range"
                    min={85}
                    max={105}
                    step={5}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="range range-xs range-primary flex-1"
                    aria-label="Taille de la police du CV"
                  />
                  <button
                    type="button"
                    className="btn btn-xs btn-outline border-white/15 text-slate-200"
                    onClick={() => setFontSize((value) => Math.min(105, value + 5))}
                  >
                    A+
                  </button>
                  <span className="badge badge-outline badge-sm w-14 justify-center font-mono text-slate-200">{fontSize}%</span>
                </div>
              </div>
            </div>

            {/* Zoom (desktop only hint) */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-base-content">Zoom aperçu</h3>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={50} max={200} value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="range range-xs range-primary flex-1"
                />
                <span className="badge badge-outline badge-sm w-14 justify-center font-mono">{zoom}%</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );

  // ── Preview Panel ──────────────────────────────────────────────────────────
  // CV preview uses an A4 ratio with enough working width for the templates.
  // so the scroll container fills properly and doesn't clip the content.
  const CV_W = 950;
  const CV_H = 1344;
  const PreviewPanel = ({ isMobile = false }: { isMobile?: boolean }) => {
    const mobileScale = Math.min(0.38, Math.max(0.26, (viewportWidth - 28) / CV_W));
    const scale = isMobile ? mobileScale : zoom / 200;
    const scaledW = CV_W * scale;
    const scaledH = CV_H * scale;
    return (
      <div className="moncv-workspace-grid w-full h-full overflow-auto relative">
        {!isMobile && (
          <div className="absolute top-4 right-5 z-20 flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 rounded-full bg-[#0b1b22]/90 px-3 py-1.5 shadow-lg ring-1 ring-white/10 backdrop-blur">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <input
                type="range"
                min={80}
                max={180}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="range range-primary range-xs w-36"
                aria-label="Zoom apercu"
              />
              <span className="w-10 text-right font-mono text-[11px] text-primary">{zoom}%</span>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="select select-bordered select-xs w-32 rounded-full border-white/10 bg-[#0b1b22]/90 text-xs text-slate-200 shadow-lg backdrop-blur"
              aria-label="Theme du CV"
            >
              {themes.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        )}
        {!isMobile && (
          <div className="hidden">
            <Monitor className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-base-content/60">Aperçu en direct</span>
            <Sparkles className="w-3 h-3 text-warning animate-pulse" />
          </div>
        )}
        {/* Container sized to the post-scale CV dimensions so scroll is correct */}
        <div
          className={`flex justify-center items-start ${isMobile ? 'px-2 pb-8 pt-6' : 'px-4 pb-10 pt-16 sm:px-8'}`}
          style={{
            minWidth: `${scaledW + (isMobile ? 16 : 48)}px`,
            minHeight: `${scaledH + (isMobile ? 64 : 104)}px`,
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: `${CV_W}px`,
              height: `${CV_H}px`,
              marginBottom: `${scaledH - CV_H}px`,
            }}
          >
            <CVPreview
              personalDetails={personalDetails}
              file={file}
              theme={theme}
              template={template}
              fontSize={fontSize}
              experiences={experiences}
              educations={educations}
              languages={languages}
              hobbies={hobbies}
              skills={skills}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/*  DESKTOP LAYOUT (lg+)                                                */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Left editor pane */}
        <div className="w-[455px] h-full flex flex-col bg-[#08151a] border-r border-white/10 shrink-0">
          {renderEditorPanel()}
        </div>
        {/* Right preview pane */}
        <div className="flex-1 h-full overflow-hidden relative">
          <PreviewPanel />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/*  MOBILE LAYOUT (< lg)                                                */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex lg:hidden flex-col h-screen overflow-hidden bg-[#08151a]">

        {/* Mobile content area */}
        <div className="flex-1 overflow-hidden relative">
          {mobileTab === 'editor' ? (
            renderEditorPanel()
          ) : (
            <div className="h-full overflow-hidden">
              <PreviewPanel isMobile />
              <div className="text-center pb-4">
                <p className="text-xs text-base-content/40">Aperçu réduit • Appuyez sur Télécharger pour le PDF complet</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile bottom navigation */}
        <div className="shrink-0 border-t border-white/10 bg-[#071116] safe-area-pb">
          <div className="flex">
            <button
              onClick={() => setMobileTab('editor')}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-[11px] font-semibold transition-colors ${
                mobileTab === 'editor' ? 'text-primary border-t-2 border-primary' : 'text-slate-500'
              }`}
            >
              <PenLine className="w-5 h-5" />
              Éditeur
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-[11px] font-semibold transition-colors ${
                mobileTab === 'preview' ? 'text-primary border-t-2 border-primary' : 'text-slate-500'
              }`}
            >
              <FileText className="w-5 h-5" />
              Aperçu
            </button>
            <button
              onClick={() => (document.getElementById('modal_preview') as HTMLDialogElement)?.showModal()}
              className="flex-1 flex flex-col items-center gap-0.5 py-3 text-[11px] font-semibold text-slate-500"
            >
              <Eye className="w-5 h-5" />
              Télécharger
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/*  MODAL — PDF Preview & Download                                      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <dialog id="modal_preview" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative h-[88vh] max-h-[88vh] w-[96vw] max-w-[1160px] overflow-hidden rounded-2xl bg-[#0b171d] p-0 lg:w-[calc(100vw-12rem)]">
          <form method="dialog" className="relative z-30">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-5 top-4 text-slate-300 hover:bg-white/10">x</button>
          </form>
          <div className="absolute left-0 right-0 top-0 z-20 flex h-28 items-center justify-end bg-[#0b171d] px-6 pt-4 sm:px-8">
            <button onClick={handleDownloadPdf} className="btn btn-primary h-12 rounded-xl px-5 font-bold text-primary-content shadow-lg shadow-primary/20 sm:px-6">
              Télécharger <Save className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 top-28 overflow-auto px-4 pb-10 sm:px-10 lg:px-20">
            <div className="flex min-w-max justify-center">
              <CVPreview
                personalDetails={personalDetails}
                file={file}
                theme={theme}
                template={template}
                fontSize={fontSize}
                experiences={experiences}
                educations={educations}
                languages={languages}
                hobbies={hobbies}
                skills={skills}
                download={true}
                ref={cvPreviewRef}
              />
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>Fermer</button></form>
      </dialog>
    </>
  );
}
