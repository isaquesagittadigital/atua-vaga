import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Trophy, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PersonalDataForm from '@/components/pages/candidate/registration/PersonalDataForm';
import AddressForm from '@/components/pages/candidate/registration/AddressForm';
import EducationForm from '@/components/pages/candidate/registration/EducationForm';
import ExperienceForm from '@/components/pages/candidate/registration/ExperienceForm';
import SkillsForm from '@/components/pages/candidate/registration/SkillsForm';
import BehavioralResults from '@/components/pages/candidate/registration/BehavioralResults';

const CandidateProfileView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [progress] = useState(85); // Placeholder progress for the viewed profile

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error) throw error;
                setProfile(data);
            } catch (error) {
                console.error('Error fetching candidate profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-[#F04E23]" size={40} />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Candidato não encontrado</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-[#F04E23] font-bold underline">
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="font-sans flex flex-col flex-1">
            <main className="flex-1 max-w-[1480px] w-full mx-auto px-6 py-10">

                {/* ── Profile Header Card ──────────────────────────────────── */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-8 mb-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-100 flex items-center justify-center text-4xl font-black text-gray-400 shadow-sm">
                                {profile.avatar_url
                                    ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    : <div className="flex items-center justify-center w-full h-full bg-gray-200 text-3xl font-black text-gray-500">
                                        {profile.full_name?.charAt(0).toUpperCase() || <Camera size={32} />}
                                    </div>
                                }
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight">
                                {profile.full_name || 'Candidato'}
                            </h1>
                            <p className="text-gray-500 font-semibold text-sm mt-0.5">Candidato</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button className="px-6 py-3 rounded-xl border-2 border-[#F04E23] text-[#F04E23] font-bold text-sm hover:bg-orange-50 transition-all">
                            Contatar candidato
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-[#F04E23] text-white font-bold text-sm hover:bg-[#d63f15] transition-all shadow-lg shadow-orange-500/20">
                            Recrutar candidato
                        </button>
                    </div>
                </div>

                {/* ── Form Sections — white cards with rounding ────────────── */}
                <div className="space-y-6">

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                        <PersonalDataForm onNext={() => {}} readOnly={true} externalProfile={profile} />
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                        <AddressForm readOnly={true} externalProfile={profile} />
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                        <EducationForm onNext={() => {}} readOnly={true} externalUserId={id} />
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                        <ExperienceForm onNext={() => {}} readOnly={true} externalUserId={id} />
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                        <SkillsForm onNext={() => {}} readOnly={true} externalProfile={profile} externalUserId={id} />
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm px-10 py-10">
                        <BehavioralResults externalUserId={id} />
                    </div>

                </div>
            </main>
        </div>
    );
};

export default CandidateProfileView;
