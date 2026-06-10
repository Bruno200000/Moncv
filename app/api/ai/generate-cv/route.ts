import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const emptyCv = {
  name: 'CV genere par IA',
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    photoUrl: '',
    postSeeking: '',
    description: '',
  },
  experiences: [],
  educations: [],
  languages: [],
  skills: [],
  hobbies: [],
  theme: 'light',
  template: 'ats-simple',
};

function extractJson(text: string) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Reponse IA invalide.');
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function normalizeCv(cv: any) {
  return {
    ...emptyCv,
    name: String(cv?.name || emptyCv.name).slice(0, 80),
    personalDetails: {
      ...emptyCv.personalDetails,
      ...(cv?.personalDetails || {}),
      photoUrl: '',
    },
    experiences: asArray(cv?.experiences).slice(0, 5),
    educations: asArray(cv?.educations).slice(0, 4),
    languages: asArray(cv?.languages).slice(0, 5),
    skills: asArray(cv?.skills).slice(0, 14),
    hobbies: asArray(cv?.hobbies).slice(0, 8),
    theme: typeof cv?.theme === 'string' ? cv.theme : 'light',
    template: typeof cv?.template === 'string' ? cv.template : 'ats-simple',
  };
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorise. Veuillez vous connecter.' },
        { status: 401 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Cle Gemini manquante. Ajoutez GEMINI_API_KEY dans .env.local ou dans les variables Vercel.' },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 12) {
      return NextResponse.json(
        { error: 'Veuillez saisir un prompt plus detaille.' },
        { status: 400 }
      );
    }

    const instruction = `
Tu es un redacteur de CV professionnel francophone.
Genere un CV simple, naturel, sobre et credible a partir du prompt utilisateur.
Retourne uniquement un JSON valide, sans markdown.
N'invente pas de coordonnees personnelles si elles ne sont pas fournies.
Utilise des phrases courtes, des actions concretes et des resultats mesurables quand le prompt le permet.
Le JSON doit respecter exactement cette structure:
{
  "name": "Nom du CV",
  "personalDetails": {
    "fullName": "",
    "email": "",
    "phone": "",
    "address": "",
    "photoUrl": "",
    "postSeeking": "",
    "description": ""
  },
  "experiences": [
    { "jobTitle": "", "companyName": "", "startDate": "", "endDate": "", "description": "" }
  ],
  "educations": [
    { "school": "", "degree": "", "description": "", "startDate": "", "endDate": "" }
  ],
  "languages": [
    { "language": "", "proficiency": "" }
  ],
  "skills": [
    { "name": "" }
  ],
  "hobbies": [
    { "name": "" }
  ],
  "theme": "light",
  "template": "ats-simple"
}
Prompt utilisateur:
${prompt.trim().slice(0, 5000)}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: instruction }] }],
          generationConfig: {
            temperature: 0.45,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    const payload = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error?.message || 'Gemini a refuse la generation.' },
        { status: response.status }
      );
    }

    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini n a pas retourne de contenu.');

    return NextResponse.json({ cv: normalizeCv(extractJson(text)) });
  } catch (error: any) {
    console.error('Erreur generation Gemini:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue pendant la generation.' },
      { status: 500 }
    );
  }
}
