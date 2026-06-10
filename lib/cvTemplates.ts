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
  { id: 'compact-pro', label: 'Compact Pro', description: 'CV dense et direct pour candidatures rapides', tier: 'free' },
  { id: 'graduate', label: 'Jeune Diplome', description: 'Structure claire pour stages et premiers emplois', tier: 'free' },
  { id: 'administrative', label: 'Administratif', description: 'Modele sobre pour profils bureau et support', tier: 'free' },
  { id: 'ats-simple', label: 'ATS Simple', description: 'Simple, naturel et lisible pour les recruteurs', tier: 'free' },
  { id: 'ats-ivoire', label: 'ATS Ivoire', description: 'Inspire du modele classique professionnel fourni', tier: 'free' },
  { id: 'ats-clean-line', label: 'Clean Line', description: 'Sections nettes, lignes fines et lecture rapide', tier: 'free' },
  { id: 'ats-academic', label: 'Academique ATS', description: 'Parfait pour formations, certifications et projets', tier: 'free' },

  { id: 'creative', label: 'Creatif Plus', description: 'Sidebar forte, tags et blocs visuels', tier: 'premium' },
  { id: 'executive', label: 'Executive Plus', description: 'Sobre et professionnel, sans photo', tier: 'premium' },
  { id: 'pro-sidebar', label: 'Pro Sidebar', description: 'Colonne profil et contenu structure', tier: 'premium' },
  { id: 'corporate-plus', label: 'Corporate Plus', description: 'Rendu entreprise pour profils cadres', tier: 'premium' },
  { id: 'elegant', label: 'Elegant', description: 'Style raffine pour candidatures selectives', tier: 'premium' },
  { id: 'focus', label: 'Focus', description: 'Lecture directe des competences cles', tier: 'premium' },
  { id: 'tech', label: 'Tech Plus', description: 'CV moderne pour profils digitaux et IT', tier: 'premium' },
  { id: 'consultant', label: 'Consultant', description: 'Presentation conseil, missions et impact', tier: 'premium' },
  { id: 'finance-pro', label: 'Finance Pro', description: 'Style rigoureux pour banque, audit et gestion', tier: 'premium' },
  { id: 'project-lead', label: 'Chef de Projet', description: 'Priorite aux resultats, equipes et livrables', tier: 'premium' },
  { id: 'sales-pro', label: 'Commercial Pro', description: 'Profil oriente objectifs, clients et performance', tier: 'premium' },
  { id: 'hr-pro', label: 'RH Pro', description: 'Modele humain et structure pour ressources humaines', tier: 'premium' },
  { id: 'ats-senior-pro', label: 'Senior Pro ATS', description: 'Modele payant tres professionnel pour profils confirmes', tier: 'premium' },
  { id: 'ats-consulting-pro', label: 'Consulting ATS', description: 'Style conseil sobre, impact et missions claires', tier: 'premium' },
  { id: 'ats-tech-lead', label: 'Tech Lead ATS', description: 'Simple, naturel et optimise pour profils IT', tier: 'premium' },
  { id: 'ats-manager-pro', label: 'Manager ATS', description: 'Presentation professionnelle orientee resultats', tier: 'premium' },

  { id: 'vip-signature', label: 'Signature VIP', description: 'Colonne signature et profil renforce', tier: 'vip' },
  { id: 'vip-atlas', label: 'Atlas VIP', description: 'Entete puissant et blocs experts', tier: 'vip' },
  { id: 'prestige', label: 'Prestige', description: 'Presentation haut de gamme pour direction', tier: 'vip' },
  { id: 'director', label: 'Director', description: 'Impact executif et structure premium', tier: 'vip' },
  { id: 'portfolio', label: 'Portfolio VIP', description: 'CV expressif pour profils creatifs seniors', tier: 'vip' },
  { id: 'luxe', label: 'Luxe', description: 'Style premium elegant et tres distinctif', tier: 'vip' },
  { id: 'elite', label: 'Elite', description: 'Modele VIP dense pour profils experts', tier: 'vip' },
  { id: 'ceo-brief', label: 'CEO Brief', description: 'Synthese executive pour dirigeants et fondateurs', tier: 'vip' },
  { id: 'global-leader', label: 'Global Leader', description: 'Rendu international pour profils seniors', tier: 'vip' },
  { id: 'board-room', label: 'Board Room', description: 'Presentation prestige pour comites et direction', tier: 'vip' },
  { id: 'ats-director-elite', label: 'Director ATS Elite', description: 'Sobriete haut de gamme pour direction et comites', tier: 'vip' },
  { id: 'ats-global-elite', label: 'Global ATS Elite', description: 'Modele international premium, simple et naturel', tier: 'vip' },
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
