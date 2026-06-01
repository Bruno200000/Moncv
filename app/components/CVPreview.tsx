import { Education, Experience, Hobby, Language, PersonalDetails, Skill } from '@/type';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BriefcaseBusiness, GraduationCap, Mail, MapPinCheckInside, Phone, Star, User, Languages, Heart, Award } from 'lucide-react';

type Props = {
    personalDetails: PersonalDetails;
    file: File | null;
    theme: string;
    template?: string;
    experiences: Experience[];
    educations: Education[];
    languages: Language[];
    skills: Skill[];
    hobbies: Hobby[];
    fontSize?: number;
    download?: boolean;
    ref?: any;
}

function formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    } catch (e) {
        return dateString;
    }
}

const getStarRating = (proficiency: string) => {
    const maxStars = 5;
    let filledStars = 0;

    switch (proficiency) {
        case 'Débutant':
            filledStars = 1;
            break;
        case 'Intermédiaire':
            filledStars = 3;
            break;
        case 'Avancé':
            filledStars = 5;
            break;
        default:
            filledStars = 2;
    }
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: filledStars }, (_, index) => (
                <Star key={index} className="w-3.5 h-3.5 fill-primary text-primary" />
            ))}
            {Array.from({ length: maxStars - filledStars }, (_, index) => (
                <Star key={index + filledStars} className="w-3.5 h-3.5 text-base-content/20" />
            ))}
        </div>
    );
}

const CVPreview: React.FC<Props> = ({ 
    personalDetails, 
    file, 
    theme, 
    template = 'classic', 
    experiences = [], 
    educations = [], 
    languages = [], 
    skills = [], 
    hobbies = [], 
    fontSize = 100,
    download, 
    ref 
}) => {
    const [imageSrc, setImageSrc] = useState<string>('');

    // Créer une URL temporaire sécurisée pour l'image de profil
    useEffect(() => {
        if (!file) {
            setImageSrc(personalDetails.photoUrl || '');
            return;
        }
        
        let url = '';
        try {
            url = URL.createObjectURL(file);
            setImageSrc(url);
        } catch (e) {
            console.error("Erreur de chargement d'image:", e);
        }

        return () => {
            if (url) {
                try {
                    URL.revokeObjectURL(url);
                } catch (e) {}
            }
        };
    }, [file, personalDetails.photoUrl]);

    // Rendu du Modèle Moderne (Header pleine largeur, colonnes en bas)
    const renderModernTemplate = () => {
        return (
            <div className="flex flex-col w-full h-full p-12 bg-base-100 text-base-content select-none">
                {/* Header Banner */}
                <div className="flex items-center gap-8 bg-base-200/50 p-6 rounded-2xl border border-base-content/10 mb-8">
                    {imageSrc && (
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary shrink-0">
                            <img
                                src={imageSrc}
                                className="w-full h-full object-cover"
                                alt={personalDetails.fullName}
                            />
                        </div>
                    )}
                    <div className="flex-1 text-left">
                        <h1 className="text-4xl font-extrabold uppercase tracking-tight">{personalDetails.fullName}</h1>
                        <h2 className="text-xl font-bold text-primary mt-1 uppercase">{personalDetails.postSeeking}</h2>
                        <p className="text-xs text-base-content/70 mt-2 max-h-[80px] overflow-hidden leading-relaxed">
                            {personalDetails.description}
                        </p>
                    </div>
                </div>

                {/* Main Content Area split */}
                <div className="flex flex-1 gap-8 overflow-hidden text-left">
                    {/* Left Column (2/3 width) - Professional Experience & Education */}
                    <div className="w-2/3 flex flex-col gap-6">
                        {/* Experiences */}
                        {experiences.length > 0 && (
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-primary border-b border-primary/20 pb-1.5 mb-4 flex items-center gap-2">
                                    <BriefcaseBusiness className="w-4 h-4" /> Expériences Professionnelles
                                </h3>
                                <div className="space-y-4">
                                    {experiences.map((exp, index) => (
                                        <div key={index} className="relative pl-4 border-l border-base-content/20">
                                            <div className="absolute w-2.5 h-2.5 rounded-full bg-primary -left-[5.5px] top-1.5" />
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-bold text-sm text-base-content uppercase">{exp.jobTitle}</h4>
                                                <span className="text-[10px] text-base-content/50 italic shrink-0 ml-2">
                                                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                                </span>
                                            </div>
                                            <div className="text-[11px] font-semibold text-primary/80 my-0.5">{exp.companyName}</div>
                                            <p className="text-[11px] text-base-content/70 mt-1 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Educations */}
                        {educations.length > 0 && (
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-primary border-b border-primary/20 pb-1.5 mb-4 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" /> Formations
                                </h3>
                                <div className="space-y-4">
                                    {educations.map((edu, index) => (
                                        <div key={index} className="relative pl-4 border-l border-base-content/20">
                                            <div className="absolute w-2.5 h-2.5 rounded-full bg-primary -left-[5.5px] top-1.5" />
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-bold text-sm text-base-content uppercase">{edu.degree}</h4>
                                                <span className="text-[10px] text-base-content/50 italic shrink-0 ml-2">
                                                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                                </span>
                                            </div>
                                            <div className="text-[11px] font-semibold text-primary/80 my-0.5">{edu.school}</div>
                                            <p className="text-[11px] text-base-content/70 mt-1 leading-relaxed">{edu.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (1/3 width) - Contact, Skills, Languages, Hobbies */}
                    <div className="w-1/3 flex flex-col gap-6 border-l border-base-content/10 pl-6">
                        {/* Contact */}
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-wider text-primary border-b border-primary/20 pb-1.5 mb-3 flex items-center gap-2">
                                <User className="w-4 h-4" /> Contact
                            </h3>
                            <ul className="space-y-2 text-xs">
                                {personalDetails.phone && (
                                    <li className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-primary shrink-0" />
                                        <span className="break-all">{personalDetails.phone}</span>
                                    </li>
                                )}
                                {personalDetails.email && (
                                    <li className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-primary shrink-0" />
                                        <span className="break-all">{personalDetails.email}</span>
                                    </li>
                                )}
                                {personalDetails.address && (
                                    <li className="flex items-start gap-2">
                                        <MapPinCheckInside className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span className="break-words">{personalDetails.address}</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Skills */}
                        {skills.length > 0 && (
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-primary border-b border-primary/20 pb-1.5 mb-3 flex items-center gap-2">
                                    <Award className="w-4 h-4" /> Compétences
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="badge badge-primary badge-sm py-2 text-[10px] uppercase font-bold">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {languages.length > 0 && (
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-primary border-b border-primary/20 pb-1.5 mb-3 flex items-center gap-2">
                                    <Languages className="w-4 h-4" /> Langues
                                </h3>
                                <div className="space-y-2">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="flex justify-between items-center text-xs">
                                            <span className="capitalize font-semibold">{lang.language}</span>
                                            {getStarRating(lang.proficiency)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Hobbies */}
                        {hobbies.length > 0 && (
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-primary border-b border-primary/20 pb-1.5 mb-3 flex items-center gap-2">
                                    <Heart className="w-4 h-4" /> Loisirs
                                </h3>
                                <ul className="list-disc list-inside text-xs space-y-1">
                                    {hobbies.map((hobby, index) => (
                                        <li key={index} className="capitalize text-base-content/80">
                                            {hobby.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Rendu du Modèle Minimaliste (Mono-colonne centrée, très épurée)
    const renderMinimalistTemplate = () => {
        // Obtenir la ligne de contact
        const contactParts = [];
        if (personalDetails.phone) contactParts.push(personalDetails.phone);
        if (personalDetails.email) contactParts.push(personalDetails.email);
        if (personalDetails.address) contactParts.push(personalDetails.address);

        return (
            <div className="flex flex-col w-full h-full p-12 bg-base-100 text-base-content select-none overflow-y-auto text-left gap-6">
                {/* Centered Header */}
                <div className="text-center border-b border-base-content/10 pb-6">
                    {imageSrc && (
                        <div className="w-20 h-20 rounded-full overflow-hidden border border-base-content/10 mx-auto mb-3">
                            <img
                                src={imageSrc}
                                className="w-full h-full object-cover"
                                alt={personalDetails.fullName}
                            />
                        </div>
                    )}
                    <h1 className="text-3xl font-extrabold tracking-tight text-base-content uppercase">{personalDetails.fullName}</h1>
                    <h2 className="text-md font-bold text-primary mt-0.5 tracking-widest uppercase">{personalDetails.postSeeking}</h2>
                    
                    {contactParts.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-base-content/60 mt-3 font-medium">
                            {contactParts.map((part, idx) => (
                            <span key={idx} className="flex items-center break-words [overflow-wrap:anywhere]">
                                    {idx > 0 && <span className="mr-3 text-base-content/30">•</span>}
                                    {part}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary */}
                {personalDetails.description && (
                    <div className="text-center px-6">
                        <p className="text-xs text-base-content/80 leading-relaxed italic">
                            &ldquo;{personalDetails.description}&rdquo;
                        </p>
                    </div>
                )}

                {/* Experiences */}
                {experiences.length > 0 && (
                    <div>
                        <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/10 pb-1.5 mb-3.5">
                            Expériences Professionnelles
                        </h3>
                        <div className="space-y-4">
                            {experiences.map((exp, index) => (
                                <div key={index} className="text-xs">
                                    <div className="flex justify-between items-baseline font-bold">
                                        <div>
                                            <span className="uppercase text-base-content">{exp.jobTitle}</span>
                                            <span className="mx-2 text-base-content/40">|</span>
                                            <span className="text-primary">{exp.companyName}</span>
                                        </div>
                                        <span className="text-[10px] text-base-content/50 font-normal italic">
                                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-base-content/70 mt-1.5 leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Educations */}
                {educations.length > 0 && (
                    <div>
                        <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/10 pb-1.5 mb-3.5">
                            Formations & Diplômes
                        </h3>
                        <div className="space-y-4">
                            {educations.map((edu, index) => (
                                <div key={index} className="text-xs">
                                    <div className="flex justify-between items-baseline font-bold">
                                        <div>
                                            <span className="uppercase text-base-content">{edu.degree}</span>
                                            <span className="mx-2 text-base-content/40">|</span>
                                            <span className="text-primary">{edu.school}</span>
                                        </div>
                                        <span className="text-[10px] text-base-content/50 font-normal italic">
                                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-base-content/70 mt-1.5 leading-relaxed">{edu.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills & Languages split side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Skills */}
                    {skills.length > 0 && (
                        <div>
                            <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/10 pb-1.5 mb-2.5">
                                Compétences
                            </h3>
                            <div className="flex flex-wrap gap-1">
                                {skills.map((skill, index) => (
                                    <span key={index} className="badge badge-outline text-[10px] py-2 uppercase font-medium">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages & Hobbies */}
                    <div className="space-y-4">
                        {languages.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/10 pb-1.5 mb-2.5">
                                    Langues
                                </h3>
                                <div className="space-y-1.5">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="flex justify-between items-center text-xs">
                                            <span className="capitalize font-semibold">{lang.language}</span>
                                            {getStarRating(lang.proficiency)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hobbies.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/10 pb-1.5 mb-1.5">
                                    Loisirs
                                </h3>
                                <p className="text-[11px] text-base-content/60 capitalize">
                                    {hobbies.map(h => h.name).join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Rendu du Modèle Classique (Original - Colonne 1/3 et 2/3)
    const renderClassicTemplate = () => {
        return (
            <div className="flex p-16 w-full h-full text-base-content bg-base-100 text-left select-none">
                {/* Left sidebar panel */}
                <div className="flex flex-col w-1/3">
                    <div className="h-44 w-44 rounded-full border-8 overflow-hidden border-primary hobbies mb-4 mx-auto shrink-0">
                        {imageSrc && (
                            <img
                                src={imageSrc}
                                className="w-full h-full object-cover"
                                alt={personalDetails.fullName}
                            />
                        )}
                    </div>

                    <div className="mt-4 flex-col w-full">
                        <div>
                            <h1 className="uppercase font-bold my-2 text-sm border-b border-primary/20 pb-1">
                                Contact
                            </h1>
                            <ul className="space-y-2">
                                <li className="flex">
                                    <div className="break-all text-xs relative">
                                        <div className="ml-7 break-words [overflow-wrap:anywhere]">
                                            {personalDetails.phone}
                                        </div>
                                        {personalDetails.phone && (
                                            <div className="absolute left-0 top-0">
                                                <Phone className="w-4 h-4 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                </li>
                                <li className="flex">
                                    <div className="break-all text-xs relative">
                                        <div className="ml-7 break-words [overflow-wrap:anywhere]">
                                            {personalDetails.email}
                                        </div>
                                        {personalDetails.email && (
                                            <div className="absolute left-0 top-0">
                                                <Mail className="w-4 h-4 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                </li>
                                <li className="flex">
                                    <div className="break-all text-xs relative">
                                        <div className="ml-7 break-words [overflow-wrap:anywhere]">
                                            {personalDetails.address}
                                        </div>
                                        {personalDetails.address && (
                                            <div className="absolute left-0 top-0">
                                                <MapPinCheckInside className="w-4 h-4 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {skills.length > 0 && (
                            <div className="mt-6">
                                <h1 className="uppercase font-bold my-2 text-sm border-b border-primary/20 pb-1">
                                    Compétences
                                </h1>
                                <div className="flex flex-wrap gap-1">
                                    {skills.map((skill, index) => (
                                        <p key={index} className="badge badge-primary uppercase text-[10px] font-bold">
                                            {skill.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {languages.length > 0 && (
                            <div className="mt-6">
                                <h1 className="uppercase font-bold my-2 text-sm border-b border-primary/20 pb-1">
                                    Langues
                                </h1>
                                <div className="flex flex-col space-y-2">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="text-xs">
                                            <span className="capitalize font-semibold">
                                                {lang.language}
                                            </span>
                                            <div className="flex mt-1">
                                                {getStarRating(lang.proficiency)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hobbies.length > 0 && (
                            <div className="mt-6">
                                <h1 className="uppercase font-bold my-2 text-sm border-b border-primary/20 pb-1">
                                    Loisirs
                                </h1>
                                <div className="flex flex-col space-y-1 text-xs">
                                    {hobbies.map((hobby, index) => (
                                        <span key={index} className="capitalize">
                                            {hobby.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right content panel */}
                <div className="w-2/3 ml-8">
                    <div className="w-full flex flex-col space-y-2">
                        <h1 className="uppercase text-2xl font-bold tracking-tight">
                            {personalDetails.fullName}
                        </h1>
                        <h2 className="uppercase text-4xl text-primary font-black">
                            {personalDetails.postSeeking}
                        </h2>
                        <p className="break-all w-full text-xs text-base-content/75 leading-relaxed">
                            {personalDetails.description}
                        </p>
                    </div>

                    <section className="w-full h-fit mt-6">
                        {/* Experiences */}
                        {experiences.length > 0 && (
                            <div>
                                <h1 className="uppercase font-bold text-sm mb-2 border-b border-primary/20 pb-1">
                                    Expériences
                                </h1>
                                <ul className="steps steps-vertical space-y-3 w-full">
                                    {experiences.map((exp, index) => (
                                        <li className="step step-primary" key={index}>
                                            <div className="text-left w-full pl-4">
                                                <h2 className="flex text-sm uppercase font-bold items-center">
                                                    <BriefcaseBusiness className="w-4 h-4 text-primary" />
                                                    <span className="ml-2">{exp.jobTitle}</span>
                                                </h2>
                                                <div className="text-[11px] my-1 flex items-center">
                                                    <span className="badge badge-primary badge-sm py-1.5 text-[9px] font-bold">
                                                        {exp.companyName}
                                                    </span>
                                                    <span className="italic ml-2 text-base-content/50">
                                                        {formatDate(exp.startDate)} au {formatDate(exp.endDate)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-base-content/70">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Educations */}
                        {educations.length > 0 && (
                            <div className="mt-6">
                                <h1 className="uppercase font-bold text-sm mb-2 border-b border-primary/20 pb-1">
                                    Formations
                                </h1>
                                <ul className="steps steps-vertical space-y-3 w-full">
                                    {educations.map((edu, index) => (
                                        <li className="step step-primary" key={index}>
                                            <div className="text-left w-full pl-4">
                                                <h2 className="flex text-sm uppercase font-bold items-center">
                                                    <GraduationCap className="w-4 h-4 text-primary" />
                                                    <span className="ml-2">{edu.degree}</span>
                                                </h2>
                                                <div className="text-[11px] my-1 flex items-center">
                                                    <span className="badge badge-primary badge-sm py-1.5 text-[9px] font-bold">
                                                        {edu.school}
                                                    </span>
                                                    <span className="italic ml-2 text-base-content/50">
                                                        {formatDate(edu.startDate)} au {formatDate(edu.endDate)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-base-content/70">
                                                    {edu.description}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        );
    }

    // Rendu du Modèle Créatif (Design coloré avec sidebar contrastée, tags et sections arrondies)
    const renderCreativeTemplate = () => {
        return (
            <div className="flex w-full h-full text-base-content bg-base-100 select-none text-left">
                {/* Left Colored Sidebar (1/3) */}
                <div className="w-1/3 bg-primary text-primary-content p-8 flex flex-col gap-6 relative overflow-hidden">
                    {/* Decorative bubble */}
                    <div className="absolute top-[-50px] right-[-50px] w-36 h-36 rounded-full bg-secondary/20 pointer-events-none" />
                    <div className="absolute bottom-[-30px] left-[-30px] w-24 h-24 rounded-full bg-accent/20 pointer-events-none" />
                    
                    <div className="z-10 flex flex-col items-center text-center">
                        {imageSrc && (
                            <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-primary-content shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300 mb-4 shrink-0">
                                <img
                                    src={imageSrc}
                                    className="w-full h-full object-cover"
                                    alt={personalDetails.fullName}
                                />
                            </div>
                        )}
                        <h1 className="text-xl font-black uppercase tracking-wide leading-tight">{personalDetails.fullName}</h1>
                        <h2 className="text-xs font-bold bg-secondary text-secondary-content px-3 py-1 rounded-full mt-2 inline-block uppercase tracking-wider">
                            {personalDetails.postSeeking}
                        </h2>
                    </div>

                    {/* Contact */}
                    <div className="z-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest border-b border-primary-content/20 pb-1 mb-3">
                            Contact
                        </h3>
                        <ul className="space-y-2.5 text-xs">
                            {personalDetails.phone && (
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 shrink-0 text-secondary" />
                                    <span className="break-all">{personalDetails.phone}</span>
                                </li>
                            )}
                            {personalDetails.email && (
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 shrink-0 text-secondary" />
                                    <span className="break-all">{personalDetails.email}</span>
                                </li>
                            )}
                            {personalDetails.address && (
                                <li className="flex items-start gap-2">
                                    <MapPinCheckInside className="w-4 h-4 shrink-0 text-secondary mt-0.5" />
                                    <span className="break-words">{personalDetails.address}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="z-10">
                            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-primary-content/20 pb-1 mb-3">
                                Compétences
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {skills.map((skill, index) => (
                                    <span key={index} className="bg-primary-content/15 text-primary-content border border-primary-content/20 badge badge-sm py-2 text-[10px] uppercase font-bold">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages.length > 0 && (
                        <div className="z-10">
                            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-primary-content/20 pb-1 mb-3">
                                Langues
                            </h3>
                            <div className="space-y-2">
                                {languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between items-center text-xs">
                                        <span className="capitalize font-semibold">{lang.language}</span>
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 5 }, (_, idx) => {
                                                const isFilled = idx < (lang.proficiency === 'Débutant' ? 1 : lang.proficiency === 'Intermédiaire' ? 3 : 5);
                                                return <Star key={idx} className={`w-3 h-3 ${isFilled ? 'fill-secondary text-secondary' : 'text-primary-content/30'}`} />;
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hobbies */}
                    {hobbies.length > 0 && (
                        <div className="z-10">
                            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-primary-content/20 pb-1 mb-2">
                                Loisirs
                            </h3>
                            <div className="flex flex-wrap gap-1">
                                {hobbies.map((hobby, index) => (
                                    <span key={index} className="text-[10px] capitalize bg-primary-content/10 px-2 py-0.5 rounded">
                                        {hobby.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel (2/3) */}
                <div className="w-2/3 p-10 flex flex-col gap-6 overflow-y-auto">
                    {/* Summary */}
                    {personalDetails.description && (
                        <div className="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 relative">
                            <span className="absolute top-2 right-4 text-4xl text-primary/10 font-serif font-black">&ldquo;</span>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Profil</h3>
                            <p className="text-xs text-base-content/85 leading-relaxed font-medium">
                                {personalDetails.description}
                            </p>
                        </div>
                    )}

                    {/* Experiences */}
                    {experiences.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-primary/20 pb-1.5 mb-4 flex items-center gap-2">
                                <BriefcaseBusiness className="w-4 h-4 text-primary" /> Expériences Professionnelles
                            </h3>
                            <div className="space-y-4">
                                {experiences.map((exp, index) => (
                                    <div key={index} className="bg-base-200/30 p-4 rounded-xl border border-base-content/5 hover:border-primary/25 transition-all">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-sm text-base-content uppercase">{exp.jobTitle}</h4>
                                            <span className="badge badge-secondary badge-xs py-2 text-[9px] font-bold">
                                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                            </span>
                                        </div>
                                        <div className="text-[11px] font-bold text-primary mt-1">{exp.companyName}</div>
                                        <p className="text-xs text-base-content/75 mt-2 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Educations */}
                    {educations.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-primary/20 pb-1.5 mb-4 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-primary" /> Formations
                            </h3>
                            <div className="space-y-4">
                                {educations.map((edu, index) => (
                                    <div key={index} className="bg-base-200/30 p-4 rounded-xl border border-base-content/5">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-sm text-base-content uppercase">{edu.degree}</h4>
                                            <span className="badge badge-accent badge-xs py-2 text-[9px] font-bold">
                                                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                            </span>
                                        </div>
                                        <div className="text-[11px] font-bold text-primary mt-1">{edu.school}</div>
                                        <p className="text-xs text-base-content/75 mt-2 leading-relaxed">{edu.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Rendu du Modèle Corporate/Executive (Sobre, professionnel, structuré sans photo)
    const renderExecutiveTemplate = () => {
        return (
            <div className="flex flex-col w-full h-full p-14 bg-base-100 text-base-content select-none text-left overflow-y-auto">
                {/* Clean Top Header (Centered) */}
                <div className="text-center border-b-2 border-primary pb-5 mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-base-content uppercase">{personalDetails.fullName}</h1>
                    <h2 className="text-sm font-bold text-primary mt-1 uppercase tracking-widest">{personalDetails.postSeeking}</h2>
                    
                    {/* Contact inline line */}
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-base-content/70 mt-3 font-semibold">
                        {personalDetails.phone && (
                            <span className="flex min-w-0 items-center gap-1 break-words [overflow-wrap:anywhere]">
                                <Phone className="w-3.5 h-3.5 text-primary shrink-0" /> {personalDetails.phone}
                            </span>
                        )}
                        {personalDetails.email && (
                            <span className="flex min-w-0 items-center gap-1 break-words [overflow-wrap:anywhere]">
                                <Mail className="w-3.5 h-3.5 text-primary shrink-0" /> {personalDetails.email}
                            </span>
                        )}
                        {personalDetails.address && (
                            <span className="flex min-w-0 items-center gap-1 break-words [overflow-wrap:anywhere]">
                                <MapPinCheckInside className="w-3.5 h-3.5 text-primary shrink-0" /> {personalDetails.address}
                            </span>
                        )}
                    </div>
                </div>

                {/* Professional Profile */}
                {personalDetails.description && (
                    <div className="mb-6">
                        <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/20 pb-1 mb-2">
                            Profil Professionnel
                        </h3>
                        <p className="text-xs text-base-content/80 leading-relaxed text-justify">
                            {personalDetails.description}
                        </p>
                    </div>
                )}

                {/* Main Corporate Section split */}
                <div className="flex flex-1 gap-8">
                    {/* Left main area (2/3) */}
                    <div className="w-2/3 flex flex-col gap-6">
                        {/* Experiences */}
                        {experiences.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/20 pb-1 mb-3">
                                    Expériences Professionnelles
                                </h3>
                                <div className="space-y-4">
                                    {experiences.map((exp, index) => (
                                        <div key={index} className="text-xs">
                                            <div className="flex justify-between items-baseline font-bold">
                                                <h4 className="text-sm text-base-content uppercase">{exp.jobTitle}</h4>
                                                <span className="text-[10px] text-base-content/50 italic font-normal">
                                                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                                </span>
                                            </div>
                                            <div className="text-[11px] font-bold text-primary mt-0.5">{exp.companyName}</div>
                                            <p className="text-[11px] text-base-content/70 mt-1.5 leading-relaxed text-justify">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Educations */}
                        {educations.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/20 pb-1 mb-3">
                                    Parcours Académique
                                </h3>
                                <div className="space-y-4">
                                    {educations.map((edu, index) => (
                                        <div key={index} className="text-xs">
                                            <div className="flex justify-between items-baseline font-bold">
                                                <h4 className="text-sm text-base-content uppercase">{edu.degree}</h4>
                                                <span className="text-[10px] text-base-content/50 italic font-normal">
                                                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                                </span>
                                            </div>
                                            <div className="text-[11px] font-bold text-primary mt-0.5">{edu.school}</div>
                                            <p className="text-[11px] text-base-content/70 mt-1.5 leading-relaxed text-justify">{edu.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right main area (1/3) */}
                    <div className="w-1/3 flex flex-col gap-6">
                        {/* Skills */}
                        {skills.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/20 pb-1 mb-3">
                                    Expertises
                                </h3>
                                <ul className="space-y-1.5 text-xs font-semibold">
                                    {skills.map((skill, index) => (
                                        <li key={index} className="flex items-center gap-2 text-base-content/80">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                            <span className="uppercase text-[10px]">{skill.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Languages */}
                        {languages.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/20 pb-1 mb-3">
                                    Langues
                                </h3>
                                <div className="space-y-2">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="flex justify-between items-center text-xs">
                                            <span className="capitalize font-semibold text-base-content/85">{lang.language}</span>
                                            <span className="text-[10px] font-bold text-primary/80">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Hobbies */}
                        {hobbies.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary border-b border-base-content/20 pb-1 mb-2">
                                    Loisirs
                                </h3>
                                <ul className="list-disc list-inside text-xs text-base-content/70 space-y-1.5">
                                    {hobbies.map((hobby, index) => (
                                        <li key={index} className="capitalize">
                                            {hobby.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const renderVipSignatureTemplate = () => {
        return (
            <div className="grid grid-cols-[310px_1fr] w-full h-full bg-base-100 text-base-content select-none text-left overflow-hidden">
                <aside className="bg-base-200 p-10 flex flex-col gap-7 border-r border-primary/25">
                    <div className="text-center">
                        {imageSrc && (
                            <div className="w-40 h-40 rounded-full overflow-hidden border-[6px] border-primary mx-auto mb-5 shadow-xl">
                                <img src={imageSrc} className="w-full h-full object-cover" alt={personalDetails.fullName} />
                            </div>
                        )}
                        <h1 className="text-2xl font-black uppercase leading-tight break-words">{personalDetails.fullName}</h1>
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-primary break-words">{personalDetails.postSeeking}</p>
                    </div>

                    <section>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-2 mb-3">Contact</h3>
                        <div className="space-y-2 text-xs">
                            {personalDetails.phone && <p className="break-words [overflow-wrap:anywhere]"><Phone className="inline w-3.5 h-3.5 mr-2 text-primary" />{personalDetails.phone}</p>}
                            {personalDetails.email && <p className="break-words [overflow-wrap:anywhere]"><Mail className="inline w-3.5 h-3.5 mr-2 text-primary" />{personalDetails.email}</p>}
                            {personalDetails.address && <p className="break-words [overflow-wrap:anywhere]"><MapPinCheckInside className="inline w-3.5 h-3.5 mr-2 text-primary" />{personalDetails.address}</p>}
                        </div>
                    </section>

                    {skills.length > 0 && (
                        <section>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-2 mb-3">Competences</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {skills.map((skill, index) => (
                                    <span key={index} className="rounded-full bg-primary/12 px-2.5 py-1 text-[10px] font-bold uppercase text-primary break-words">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {languages.length > 0 && (
                        <section>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-2 mb-3">Langues</h3>
                            <div className="space-y-2 text-xs">
                                {languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between gap-3">
                                        <span className="font-bold capitalize">{lang.language}</span>
                                        <span className="text-primary font-semibold">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>

                <main className="p-12 overflow-hidden">
                    {personalDetails.description && (
                        <section className="mb-8 rounded-xl border border-primary/15 bg-primary/5 p-5">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">Profil</h3>
                            <p className="text-xs leading-relaxed text-base-content/80 break-words">{personalDetails.description}</p>
                        </section>
                    )}

                    {experiences.length > 0 && (
                        <section className="mb-8">
                            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-primary border-b border-base-content/15 pb-2 mb-5">Experience</h3>
                            <div className="space-y-5">
                                {experiences.map((exp, index) => (
                                    <div key={index} className="relative pl-6">
                                        <span className="absolute left-0 top-1 h-3 w-3 rounded-full bg-primary" />
                                        <h4 className="text-sm font-black uppercase break-words">{exp.jobTitle}</h4>
                                        <p className="text-[11px] font-bold text-primary">{exp.companyName} · {formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                                        <p className="mt-1 text-xs leading-relaxed text-base-content/70 break-words">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {educations.length > 0 && (
                        <section>
                            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-primary border-b border-base-content/15 pb-2 mb-5">Formation</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {educations.map((edu, index) => (
                                    <div key={index} className="rounded-lg bg-base-200/60 p-4">
                                        <h4 className="text-xs font-black uppercase break-words">{edu.degree}</h4>
                                        <p className="text-[11px] font-bold text-primary">{edu.school}</p>
                                        <p className="text-[10px] text-base-content/50">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                                        <p className="mt-1 text-[11px] text-base-content/70 break-words">{edu.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        );
    }

    const renderVipAtlasTemplate = () => {
        return (
            <div className="flex flex-col w-full h-full bg-base-100 text-base-content select-none text-left overflow-hidden">
                <header className="bg-primary text-primary-content px-14 py-10">
                    <div className="flex items-center gap-8">
                        {imageSrc && (
                            <div className="h-32 w-32 rounded-2xl overflow-hidden border-4 border-primary-content/70 shrink-0">
                                <img src={imageSrc} className="h-full w-full object-cover" alt={personalDetails.fullName} />
                            </div>
                        )}
                        <div className="min-w-0">
                            <h1 className="text-4xl font-black uppercase leading-tight break-words">{personalDetails.fullName}</h1>
                            <p className="mt-2 text-sm font-bold uppercase tracking-[0.25em] opacity-90 break-words">{personalDetails.postSeeking}</p>
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
                                {personalDetails.phone && <span className="break-words [overflow-wrap:anywhere]">{personalDetails.phone}</span>}
                                {personalDetails.email && <span className="break-words [overflow-wrap:anywhere]">{personalDetails.email}</span>}
                                {personalDetails.address && <span className="break-words [overflow-wrap:anywhere]">{personalDetails.address}</span>}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-[1fr_285px] gap-8 p-12 overflow-hidden">
                    <div className="space-y-7">
                        {personalDetails.description && (
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">Resume professionnel</h3>
                                <p className="text-xs leading-relaxed text-base-content/75 break-words">{personalDetails.description}</p>
                            </section>
                        )}

                        {experiences.length > 0 && (
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary border-b border-primary/25 pb-2 mb-4">Parcours</h3>
                                <div className="space-y-4">
                                    {experiences.map((exp, index) => (
                                        <div key={index} className="rounded-xl border border-base-content/10 p-4">
                                            <div className="flex justify-between gap-4">
                                                <h4 className="text-sm font-black uppercase break-words">{exp.jobTitle}</h4>
                                                <span className="shrink-0 text-[10px] font-bold text-primary">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                                            </div>
                                            <p className="text-[11px] font-bold text-primary">{exp.companyName}</p>
                                            <p className="mt-2 text-xs leading-relaxed text-base-content/70 break-words">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {educations.length > 0 && (
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary border-b border-primary/25 pb-2 mb-4">Diplomes</h3>
                                <div className="space-y-3">
                                    {educations.map((edu, index) => (
                                        <div key={index}>
                                            <h4 className="text-xs font-black uppercase break-words">{edu.degree}</h4>
                                            <p className="text-[11px] text-primary font-bold">{edu.school} · {formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-6 rounded-2xl bg-base-200/70 p-6">
                        {skills.length > 0 && (
                            <section>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-primary mb-3">Forces</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, index) => (
                                        <p key={index} className="rounded-md bg-base-100 px-3 py-2 text-[11px] font-bold uppercase break-words">{skill.name}</p>
                                    ))}
                                </div>
                            </section>
                        )}
                        {languages.length > 0 && (
                            <section>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-primary mb-3">Langues</h3>
                                <div className="space-y-2 text-xs">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="flex justify-between gap-3">
                                            <span className="font-bold capitalize">{lang.language}</span>
                                            <span className="text-primary">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {hobbies.length > 0 && (
                            <section>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-primary mb-3">Interets</h3>
                                <p className="text-xs leading-relaxed capitalize break-words">{hobbies.map(h => h.name).join(', ')}</p>
                            </section>
                        )}
                    </aside>
                </main>
            </div>
        );
    }

    return (
        <div ref={ref} className={`flex w-[794px] h-[1123px] shadow-2xl relative overflow-hidden bg-base-100 ${download ? 'mb-10 border border-base-content/10' : ''}`} data-theme={theme}>
          <div className="cv-font-adjust h-full w-full" style={{ ['--cv-font-scale' as string]: Math.max(80, Math.min(125, fontSize)) / 100 }}>
            {template === 'modern' && renderModernTemplate()}
            {template === 'minimalist' && renderMinimalistTemplate()}
            {template === 'classic' && renderClassicTemplate()}
            {template === 'creative' && renderCreativeTemplate()}
            {template === 'executive' && renderExecutiveTemplate()}
            {['starter', 'elegant'].includes(template) && renderMinimalistTemplate()}
            {['clean', 'focus'].includes(template) && renderModernTemplate()}
            {['timeline', 'pro-sidebar'].includes(template) && renderClassicTemplate()}
            {['corporate-plus', 'director'].includes(template) && renderExecutiveTemplate()}
            {['tech', 'portfolio'].includes(template) && renderCreativeTemplate()}
            {template === 'vip-signature' && renderVipSignatureTemplate()}
            {template === 'vip-atlas' && renderVipAtlasTemplate()}
            {['prestige', 'luxe'].includes(template) && renderVipSignatureTemplate()}
            {['elite'].includes(template) && renderVipAtlasTemplate()}
          </div>
        </div>
    );
}

export default CVPreview;
