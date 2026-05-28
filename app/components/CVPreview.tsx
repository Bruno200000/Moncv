import { Education, Experience, Hobby, Language, PersonalDetails, Skill } from '@/type';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BriefcaseBusiness, GraduationCap, Mail, MapPinCheckInside, Phone, Star, User, Languages, Heart, Award } from 'lucide-react';

type Props = {
    personalDetails: PersonalDetails;
    file: File | null;
    theme: string;
    template?: string; // 'classic' | 'modern' | 'minimalist'
    experiences: Experience[];
    educations: Education[];
    languages: Language[];
    skills: Skill[];
    hobbies: Hobby[];
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
    download, 
    ref 
}) => {
    const [imageSrc, setImageSrc] = useState<string>('');

    // Créer une URL temporaire sécurisée pour l'image de profil
    useEffect(() => {
        if (!file) {
            setImageSrc('');
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
    }, [file]);

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
                                <span key={idx} className="flex items-center">
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
                                        <div className="ml-7">
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
                                        <div className="ml-7">
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
                                        <div className="ml-7">
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

    return (
        <div ref={ref} className={`flex w-[950px] h-[1200px] shadow-2xl relative overflow-hidden bg-base-100 ${download ? 'mb-10 border border-base-content/10' : ''}`} data-theme={theme}>
            {template === 'modern' && renderModernTemplate()}
            {template === 'minimalist' && renderMinimalistTemplate()}
            {template === 'classic' && renderClassicTemplate()}
        </div>
    );
}

export default CVPreview;
