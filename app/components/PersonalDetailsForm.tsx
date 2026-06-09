import { PersonalDetails } from '@/type';
import React from 'react'
import { PERSONAL_DESCRIPTION_MIN_LENGTH, getPersonalDescriptionLength } from '@/lib/cvValidation';

type Props = {
  personalDetails: PersonalDetails;
  setPersonalDetails: (pd: PersonalDetails) => void;
  setFile: (file: File | null) => void;
}

const PersonalDetailsForm: React.FC<Props> = ({ personalDetails, setPersonalDetails, setFile }) => {
  const descriptionLength = getPersonalDescriptionLength(personalDetails);
  const descriptionIsTooShort = descriptionLength < PERSONAL_DESCRIPTION_MIN_LENGTH;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fied: keyof PersonalDetails) => {
    setPersonalDetails({ ...personalDetails, [fied]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = () => {
        setPersonalDetails({
          ...personalDetails,
          photoUrl: typeof reader.result === 'string' ? reader.result : personalDetails.photoUrl,
        })
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <input
        type="text"
        placeholder='Nom complet'
        value={personalDetails.fullName}
        onChange={(e) => handleChange(e, 'fullName')}
        className='input input-bordered w-full'
      />
      <div className='flex'>
        <input
          type="email"
          placeholder='Email'
          value={personalDetails.email}
          onChange={(e) => handleChange(e, 'email')}
          className='input input-bordered w-full'
        />
        <input
          type="tel"
          inputMode="tel"
          placeholder='Numéro de téléphone'
          value={personalDetails.phone}
          onChange={(e) => handleChange(e, 'phone')}
          className='input input-bordered w-full ml-4 min-w-0'
        />
      </div>

      <input
        type="text"
        placeholder='Addresse'
        value={personalDetails.address}
        onChange={(e) => handleChange(e, 'address')}
        className='input input-bordered w-full'
      />

      <input
        type="file"
        accept='image/*'
        onChange={handleFileChange}
        className='file-input file-input-bordered w-full file-input-primary'
      />

      <input
        type="text"
        placeholder='Post Recherché'
        value={personalDetails.postSeeking}
        onChange={(e) => handleChange(e, 'postSeeking')}
        className='input input-bordered w-full'
      />

      <textarea
        placeholder='Description de la personne'
        value={personalDetails.description}
        onChange={(e) => handleChange(e, 'description')}
        minLength={PERSONAL_DESCRIPTION_MIN_LENGTH}
        required
        aria-invalid={descriptionIsTooShort}
        className={`textarea textarea-bordered w-full min-h-28 ${descriptionIsTooShort ? 'textarea-error' : ''}`}
      ></textarea>
      <div className={`text-xs ${descriptionIsTooShort ? 'text-error' : 'text-success'}`}>
        {descriptionLength}/{PERSONAL_DESCRIPTION_MIN_LENGTH} caracteres minimum pour bien decrire votre profil.
      </div>


    </div>
  )
}

export default PersonalDetailsForm
