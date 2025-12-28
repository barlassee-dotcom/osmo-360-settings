
import React, { useState, useRef } from 'react';
import { DeviceType, EnvironmentType, ProSettings, RecommendationRequest } from './types';
import { getSettingsRecommendation } from './services/geminiService';
import SettingsDisplay from './components/SettingsDisplay';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState<EnvironmentType>(EnvironmentType.BRIGHT_DAY);
  const [customEnvironment, setCustomEnvironment] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<ProSettings | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAdvice = async () => {
    setLoading(true);
    setRecommendation(null);
    try {
      const req: RecommendationRequest = {
        device: DeviceType.OSMO_360,
        environment: customEnvironment || environment,
        image: image || undefined
      };
      const result = await getSettingsRecommendation(req);
      setRecommendation(result);
    } catch (error) {
      console.error("Failed to get advice:", error);
      alert("CineAI bağlantısı sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-white/5 border border-white/10 px-4">
          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
          <span className="text-xs font-bold tracking-widest uppercase text-white/60">360° Professional Assistant</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">
          OSMO <span className="text-yellow-500">360</span> ADVISOR
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          DJI Osmo 360 için her ortamda en mükemmel Pro ayarlarını anında öğrenin.
        </p>
      </header>

      <main className="space-y-8">
        {/* Environment Selection */}
        <section className="glass rounded-3xl p-6 md:p-8">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">1. Ortamınızı Seçin</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {Object.values(EnvironmentType).map((e) => (
              <button
                key={e}
                onClick={() => {
                  setEnvironment(e);
                  setCustomEnvironment('');
                }}
                className={`p-4 rounded-2xl border transition-all text-sm font-medium ${
                  environment === e && !customEnvironment
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Veya ortamı tarif edin (Örn: 'Gün batımında karlı dağlar', 'Gece kulübü')"
              value={customEnvironment}
              onChange={(e) => setCustomEnvironment(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white placeholder:text-white/20"
            />
          </div>

          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 mt-8">2. Ortam Fotoğrafı (Opsiyonel)</h2>
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-3xl hover:border-yellow-500/50 transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
            {image ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                <img src={image} alt="Target environment" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setImage(null); }}
                  className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-br from-white/10 to-transparent">
                  <svg className="w-7 h-7 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <p className="text-sm font-semibold text-white/60 italic">Fotoğraf yükleyerek daha kesin sonuçlar alın</p>
                <p className="text-xs text-white/20 mt-1 uppercase tracking-tighter">AI ışık ve renk sıcaklığını analiz eder</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
        </section>

        {/* Action Button */}
        <button
          onClick={getAdvice}
          disabled={loading}
          className="w-full py-6 rounded-3xl accent-gradient text-black font-black text-xl shadow-[0_10px_40px_rgba(202,138,4,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center uppercase tracking-tighter"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ANALİZ EDİLİYOR...
            </>
          ) : "PRO AYARLARI OLUŞTUR"}
        </button>

        {/* Results Section */}
        {recommendation && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase underline decoration-yellow-500 underline-offset-8">360° TAVSİYESİ</h2>
              <div className="text-xs font-mono text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                Osmo 360 İçin Optimize Edildi
              </div>
            </div>
            <SettingsDisplay settings={recommendation} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-white/10 text-xs font-mono uppercase tracking-[0.2em]">
        <p>© 2024 DJI Osmo 360 Assistant</p>
        <p className="mt-2 text-white/5 italic">Lenslerinizin temiz olduğundan emin olun.</p>
      </footer>
    </div>
  );
};

export default App;
