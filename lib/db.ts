import fs from 'fs';
import path from 'path';
import { PersonalDetails, Experience, Education, Skill, Language, Hobby } from '@/type';

// Types de données pour notre base locale
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  plan: 'free' | 'premium' | 'vip';
  createdAt: string;
}

export interface CV {
  id: string;
  userId: string;
  name: string;
  personalDetails: PersonalDetails;
  experiences: Experience[];
  educations: Education[];
  languages: Language[];
  skills: Skill[];
  hobbies: Hobby[];
  theme: string;
  template?: string; // classic | modern | minimalist
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  users: User[];
  cvs: CV[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Initialise la base de données si elle n'existe pas
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = { users: [], cvs: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

// Lit les données depuis le fichier JSON
function readDb(): DatabaseSchema {
  initDb();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error("Erreur de lecture de la base locale, réinitialisation...", error);
    return { users: [], cvs: [] };
  }
}

// Écrit les données de manière atomique (fichier temporaire puis renommage)
function writeDb(data: DatabaseSchema) {
  initDb();
  const tempFile = `${DB_FILE}.tmp`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (error) {
    console.error("Erreur lors de l'écriture dans la base locale:", error);
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch (e) {}
    }
    throw new Error("Impossible d'écrire dans la base de données.");
  }
}

// Fonctions d'accès pour les utilisateurs
export const db = {
  // --- Gestion des Utilisateurs ---
  
  getUsers(): User[] {
    return readDb().users;
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  },

  getUserByEmail(email: string): User | undefined {
    const emailLower = email.toLowerCase().trim();
    return this.getUsers().find(u => u.email.toLowerCase() === emailLower);
  },

  createUser(user: Omit<User, 'id' | 'plan' | 'createdAt'>): User {
    const data = readDb();
    
    // Vérifier les doublons
    const emailLower = user.email.toLowerCase().trim();
    if (data.users.some(u => u.email.toLowerCase() === emailLower)) {
      throw new Error("Cet email est déjà enregistré.");
    }

    const newUser: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      name: user.name,
      email: emailLower,
      passwordHash: user.passwordHash,
      plan: 'free',
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    writeDb(data);
    return newUser;
  },

  updateUserPlan(userId: string, plan: 'free' | 'premium' | 'vip'): User {
    const data = readDb();
    const userIndex = data.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error("Utilisateur introuvable.");
    }

    data.users[userIndex].plan = plan;
    writeDb(data);
    return data.users[userIndex];
  },

  // --- Gestion des CVs ---

  getCVs(userId: string): CV[] {
    return readDb().cvs.filter(cv => cv.userId === userId);
  },

  getCV(id: string): CV | undefined {
    return readDb().cvs.find(cv => cv.id === id);
  },

  createCV(userId: string, name: string): CV {
    const data = readDb();
    const user = data.users.find(u => u.id === userId);
    if (!user) throw new Error("Utilisateur non authentifié.");

    // Compter le nombre de CVs existants pour l'utilisateur
    const existingCvsCount = data.cvs.filter(cv => cv.userId === userId).length;
    
    // Vérification des quotas du plan
    if (user.plan === 'free' && existingCvsCount >= 3) {
      throw new Error("Limite atteinte. Le plan gratuit est limité à 3 CVs.");
    } else if (user.plan === 'premium' && existingCvsCount >= 10) {
      throw new Error("Limite atteinte. Le plan Premium est limité à 10 CVs.");
    }

    const newCv: CV = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      userId,
      name: name || "Mon CV",
      personalDetails: {
        fullName: user.name,
        email: user.email,
        phone: '',
        address: '',
        photoUrl: '',
        postSeeking: '',
        description: ''
      },
      experiences: [],
      educations: [],
      languages: [],
      skills: [],
      hobbies: [],
      theme: 'cupcake',
      template: 'classic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.cvs.push(newCv);
    writeDb(data);
    return newCv;
  },

  updateCV(userId: string, cvId: string, updatedFields: Partial<Omit<CV, 'id' | 'userId' | 'createdAt'>>): CV {
    const data = readDb();
    const cvIndex = data.cvs.findIndex(cv => cv.id === cvId && cv.userId === userId);

    if (cvIndex === -1) {
      throw new Error("CV introuvable ou vous n'avez pas l'autorisation de le modifier.");
    }

    const currentCv = data.cvs[cvIndex];
    data.cvs[cvIndex] = {
      ...currentCv,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    } as CV;

    writeDb(data);
    return data.cvs[cvIndex];
  },

  deleteCV(userId: string, cvId: string): void {
    const data = readDb();
    const initialLength = data.cvs.length;
    
    data.cvs = data.cvs.filter(cv => !(cv.id === cvId && cv.userId === userId));
    
    if (data.cvs.length === initialLength) {
      throw new Error("CV introuvable ou vous n'avez pas l'autorisation de le supprimer.");
    }

    writeDb(data);
  }
};
