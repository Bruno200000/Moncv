export type UserPlan = 'free' | 'premium' | 'vip';
export type TemplateTier = UserPlan;

export type CVTemplateDefinition = {
  id: string;
  label: string;
  description: string;
  tier: TemplateTier;
};

export const CV_TEMPLATES: CVTemplateDefinition[] = [
  { id: 'classic', label: 'Classique', description: 'Sidebar coloree, mise en page traditionnelle', tier: 'free' },
  { id: 'modern', label: 'Moderne', description: 'Header clair avec colonnes professionnelles', tier: 'free' },
  { id: 'minimalist', label: 'Minimaliste', description: 'Mono-colonne simple et lisible', tier: 'free' },
  { id: 'starter', label: 'Starter', description: 'CV compact pour debuter rapidement', tier: 'free' },
  { id: 'clean', label: 'Clean', description: 'Presentation claire pour profils polyvalents', tier: 'free' },
  { id: 'timeline', label: 'Timeline', description: 'Parcours lisible avec experiences en ligne', tier: 'free' },

  { id: 'creative', label: 'Creatif Plus', description: 'Sidebar forte, tags et blocs visuels', tier: 'premium' },
  { id: 'executive', label: 'Executive Plus', description: 'Sobre et professionnel, sans photo', tier: 'premium' },
  { id: 'pro-sidebar', label: 'Pro Sidebar', description: 'Colonne profil et contenu structure', tier: 'premium' },
  { id: 'corporate-plus', label: 'Corporate Plus', description: 'Rendu entreprise pour profils cadres', tier: 'premium' },
  { id: 'elegant', label: 'Elegant', description: 'Style raffine pour candidatures selectives', tier: 'premium' },
  { id: 'focus', label: 'Focus', description: 'Lecture directe des competences cles', tier: 'premium' },
  { id: 'tech', label: 'Tech Plus', description: 'CV moderne pour profils digitaux et IT', tier: 'premium' },

  { id: 'vip-signature', label: 'Signature VIP', description: 'Colonne signature et profil renforce', tier: 'vip' },
  { id: 'vip-atlas', label: 'Atlas VIP', description: 'Entete puissant et blocs experts', tier: 'vip' },
  { id: 'prestige', label: 'Prestige', description: 'Presentation haut de gamme pour direction', tier: 'vip' },
  { id: 'director', label: 'Director', description: 'Impact executif et structure premium', tier: 'vip' },
  { id: 'portfolio', label: 'Portfolio VIP', description: 'CV expressif pour profils creatifs seniors', tier: 'vip' },
  { id: 'luxe', label: 'Luxe', description: 'Style premium elegant et tres distinctif', tier: 'vip' },
  { id: 'elite', label: 'Elite', description: 'Modele VIP dense pour profils experts', tier: 'vip' },
];

const planRank: Record<UserPlan, number> = {
  free: 0,
  premium: 1,
  vip: 2,
};

export function getTemplateDefinition(templateId: string) {
  return CV_TEMPLATES.find((template) => template.id === templateId);
}

export function getTemplateTier(templateId: string): TemplateTier {
  return getTemplateDefinition(templateId)?.tier || 'free';
}

export function canUseTemplate(plan: UserPlan, templateId: string): boolean {
  return planRank[plan] >= planRank[getTemplateTier(templateId)];
}

export function normalizeTemplateForPlan(plan: UserPlan, templateId?: string): string {
  const safeTemplate = templateId && getTemplateDefinition(templateId) ? templateId : 'classic';
  return canUseTemplate(plan, safeTemplate) ? safeTemplate : 'classic';
}
