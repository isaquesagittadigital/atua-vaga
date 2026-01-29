import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PersonalDataForm from './registration/PersonalDataForm';
import AddressForm from './registration/AddressForm';
import EducationForm from './registration/EducationForm';
import ExperienceForm from './registration/ExperienceForm';
import SkillsForm from './registration/SkillsForm';
import BehavioralResults from './registration/BehavioralResults';

const ProfilePage: React.FC = () => {
   const navigate = useNavigate();
   const { user, profile } = useAuth();

   return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
         <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12">
            {/* User Profile Header */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-10 mb-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-8">
                  <div className="relative">
                     <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-gray-50 bg-blue-100 flex items-center justify-center text-4xl font-black text-[#1D4ED8]">
                        {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                     </div>
                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center">
                        <Plus size={16} className="text-[#F04E23]" />
                     </div>
                  </div>
                  <div>
                     <h1 className="text-3xl font-black text-gray-900">{profile?.full_name || 'Usuário'}</h1>
                     <p className="text-gray-500 font-bold text-lg">Candidato</p>
                  </div>
               </div>

               <div className="flex-1 max-w-[400px] w-full">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-gray-600 font-bold text-[15px]">Progresso do perfil: <span className="font-black text-gray-900">100% concluído</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex-1 h-3.5 flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                           <div key={i} className="flex-1 bg-[#5AB7F7] rounded-full"></div>
                        ))}
                     </div>
                     <div className="w-10 h-10 rounded-full bg-[#5AB7F7] flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Trophy size={20} strokeWidth={2.5} />
                     </div>
                  </div>
               </div>
            </div>

            {/* Form Sections */}
            <div className="space-y-12">
               {/* Personal Data Section - Reusing the component in Edit Mode */}
               <section>
                  <PersonalDataForm onNext={() => { }} canEdit={true} hideSkip={true} />
               </section>

               {/* Address Section */}
               <section>
                  <AddressForm onNext={() => { }} canEdit={true} hideSkip={true} />
               </section>

               {/* Education Section */}
               <section>
                  <EducationForm onNext={() => { }} canEdit={true} hideSkip={true} />
               </section>

               {/* Experience Section */}
               <section>
                  <ExperienceForm onNext={() => { }} canEdit={true} hideSkip={true} />
               </section>

               {/* Skills Section */}
               <section>
                  <SkillsForm onNext={() => { }} canEdit={true} hideSkip={true} />
               </section>

               {/* Behavioral Results Section */}
               <section>
                  <BehavioralResults />
               </section>
            </div>
         </main>

         {/* Footer */}
         <footer className="w-full py-10 px-12 border-t border-gray-100 bg-white text-[13px] text-gray-400 font-bold flex flex-col md:flex-row items-center justify-between">
            <p>©atua vaga. Todos os direitos reservados.</p>
            <div className="flex items-center gap-10 mt-6 md:mt-0">
               <a href="#" className="hover:text-gray-900 transition-colors">Termos e Condições de Uso</a>
               <a href="#" className="hover:text-gray-900 transition-colors">Política de Privacidade</a>
               <a href="#" className="hover:text-gray-900 transition-colors">Ajuda</a>
            </div>
         </footer>
      </div>
   );
};

export default ProfilePage;
