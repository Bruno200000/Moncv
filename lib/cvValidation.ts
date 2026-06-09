import { PersonalDetails } from '@/type';

export const PERSONAL_DESCRIPTION_MIN_LENGTH = 120;

export function getPersonalDescriptionLength(personalDetails: PersonalDetails): number {
  return (personalDetails.description || '').trim().length;
}

export function isPersonalDescriptionValid(personalDetails: PersonalDetails): boolean {
  return getPersonalDescriptionLength(personalDetails) >= PERSONAL_DESCRIPTION_MIN_LENGTH;
}

export function getPersonalDescriptionError(): string {
  return `La description doit contenir au moins ${PERSONAL_DESCRIPTION_MIN_LENGTH} caracteres pour presenter clairement votre profil.`;
}
