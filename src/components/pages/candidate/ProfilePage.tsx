import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import PersonalDataForm from './registration/PersonalDataForm';
import AddressForm from './registration/AddressForm';
import EducationForm from './registration/EducationForm';
import ExperienceForm from './registration/ExperienceForm';
import SkillsForm from './registration/SkillsForm';
import BehavioralResults from './registration/BehavioralResults';
import SuccessModal from '@/components/modals/SuccessModal';

const ProfilePage: React.FC = () => {
   const navigate = useNavigate();
   const { user, profile, refreshUser } = useAuth();
   const [progress, setProgress] = useState(0);
   const [uploading, setUploading] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);

   const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
         const file = event.target.files?.[0];
         if (!file || !user) return;
         setUploading(true);
         const fileExt = file.name.split('.').pop();
         const fileName = `${user.id}-${Math.random()}.${fileExt}`;
         const filePath = `avatars/${fileName}`;
         const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
         if (uploadError) throw uploadError;
         const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
         const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
         if (updateError) throw updateError;
         await refreshUser();
         setShowSuccessModal(true);
      } catch (error: any) {
         console.error('Error uploading photo:', error);
         alert(`Erro ao carregar foto: ${error.message || 'Tente novamente.'}`);
      } finally {
         setUploading(false);
      }
   };

   // Only recalculate when user ID truly changes
   const userId = user?.id;
   useEffect(() => {
      if (userId) calculateProgress();
   }, [userId]);

   const calculateProgress = async () => {
      if (!user) return;
      let completedSteps = 0;
      const totalSteps = 6;
      if (profile?.full_name || profile?.name || user?.user_metadata?.full_name) completedSteps++;
      if (profile?.cep || (profile as any)?.street) completedSteps++;
      const { count: eduCount } = await supabase.from('academic_education').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      if (eduCount && eduCount > 0) completedSteps++;
      const { count: expCount } = await supabase.from('professional_experience').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      if (expCount && expCount > 0) completedSteps++;
      if (profile?.skills && (profile.skills as string[]).length > 0) completedSteps++;
      const { count: testCount } = await supabase.from('candidate_test_results').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      if (testCount && testCount > 0) completedSteps++;
      setProgress(Math.round((completedSteps / totalSteps) * 100));
   };

   return (
      <div className="font-sans flex flex-col flex-1">
         <main className="flex-1 max-w-[1480px] w-full mx-auto px-6 py-10">

            {/* ── Profile Header Card ──────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-8 mb-6 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-8">
                  <div className="relative group">
                     <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-100 flex items-center justify-center text-4xl font-black text-gray-400 relative shadow-sm">
                        {profile?.avatar_url
                           ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                           : <div className="flex items-center justify-center w-full h-full bg-gray-200 text-3xl font-black text-gray-500">
                              {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || <Camera size={32} />}
                           </div>
                        }
                        {uploading && (
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                              <Loader2 className="animate-spin text-white" size={32} />
                           </div>
                        )}
                     </div>
                     <label htmlFor="photo-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200">
                        <Camera size={16} className="text-gray-400" />
                        <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
                     </label>
                  </div>
                  <div>
                     <h1 className="text-2xl font-black text-gray-900 leading-tight">
                        {profile?.full_name || profile?.name || user?.user_metadata?.full_name || 'Candidato'}
                     </h1>
                     <p className="text-gray-500 font-semibold text-sm mt-0.5">Candidato</p>
                  </div>
               </div>

               <div className="w-full max-w-[350px]">
                  <div className="flex justify-between items-center mb-3">
                     <span className="text-gray-600 font-bold text-sm">
                        Progresso do perfil: <span className="font-black text-gray-900">{progress}% concluído</span>
                     </span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#5AB7F7] rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                     </div>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ${progress === 100 ? 'bg-blue-500' : 'bg-[#5AB7F7]'}`}>
                        <Trophy size={16} strokeWidth={3} />
                     </div>
                  </div>
               </div>
            </div>

            {/* ── Form Sections — white cards with rounding ────────────── */}
            <div className="space-y-6">

               <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                  <PersonalDataForm onNext={() => { }} canEdit={true} hideSkip={true} />
               </div>

               <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                  <EducationForm onNext={() => { }} canEdit={true} hideSkip={true} />
               </div>

               <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                  <ExperienceForm onNext={() => { }} canEdit={true} hideSkip={true} />
               </div>

               <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                  <SkillsForm onNext={() => { }} canEdit={true} hideSkip={true} />
               </div>

               <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                  <BehavioralResults />
               </div>

            </div>
         </main>

         <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title="Foto atualizada!"
            description="Sua foto de perfil foi salva com sucesso no sistema Atua Vaga."
            buttonText="Entendido"
         />
      </div>
   );
};

export default ProfilePage;
