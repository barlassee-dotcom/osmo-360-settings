
import React, { useState } from 'react';
import { LocationType, WeatherType, ShootingActivity, ProSettings, AppLang, EnvironmentData } from './types';
import { calculateProSettings } from './services/recommendationEngine';
import SettingsDisplay from './components/SettingsDisplay';

const ActivityIcon = ({ name }: { name: ShootingActivity }) => {
  // Use React.ReactElement instead of JSX.Element to fix "Cannot find namespace 'JSX'" error
  const icons: Record<string, React.ReactElement> = {
    STATIC_LANDSCAPE: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    WALKING: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="5" r="2"/><path d="M7 21h3l2-5 2 5h3"/><path d="M8 14l5-2 3-3"/></svg>,
    RUNNING: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="15" cy="4" r="2"/><path d="M4 20h3l2-6 2 6h3"/><path d="M7 13l4-2 4-4"/></svg>,
    CYCLING: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><polyline points="15 6 10 6 10 17.5"/><polyline points="15 6 17.5 10 18.5 17.5"/><line x1="10" y1="10" x2="15" y2="10"/></svg>,
    MOTORCYCLING: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M7 17h10"/><path d="M9 10h5l3 7"/><path d="M12 10v3"/></svg>,
    DRIVING: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>,
    VLOGGING: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
    ACTION: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    PARTY: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    MUSEUM: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="3 10 12 3 21 10"/><line x1="5" y1="21" x2="5" y2="10"/><line x1="9" y1="21" x2="9" y2="10"/><line x1="15" y1="21" x2="15" y2="10"/><line x1="19" y1="21" x2="19" y2="10"/></svg>,
    CONCERT: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    STUDIO: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
    SPORT_HALL: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    REAL_ESTATE: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    CAFE_RESTAURANT: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    WORKSHOP: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    OFFICE: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  };
  return icons[name] || icons.VLOGGING;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<AppLang>('TR');
  const [loading, setLoading] = useState(false);
  const [locType, setLocType] = useState<LocationType>(LocationType.OUTDOOR);
  const [activity, setActivity] = useState<ShootingActivity>(ShootingActivity.WALKING);
  const [weather, setWeather] = useState<WeatherType>(WeatherType.SUNNY);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [locationContext, setLocationContext] = useState('');
  const [description, setDescription] = useState('');
  const [recommendation, setRecommendation] = useState<ProSettings | null>(null);

  const indoorActivities = [
    ShootingActivity.STUDIO, ShootingActivity.PARTY, ShootingActivity.MUSEUM, 
    ShootingActivity.CONCERT, ShootingActivity.SPORT_HALL, ShootingActivity.REAL_ESTATE, 
    ShootingActivity.CAFE_RESTAURANT, ShootingActivity.WORKSHOP, ShootingActivity.OFFICE
  ];

  const outdoorActivities = [
    ShootingActivity.STATIC_LANDSCAPE, ShootingActivity.WALKING, ShootingActivity.RUNNING, 
    ShootingActivity.CYCLING, ShootingActivity.MOTORCYCLING, ShootingActivity.DRIVING, 
    ShootingActivity.VLOGGING, ShootingActivity.ACTION
  ];

  const activeActivities = locType === LocationType.INDOOR ? indoorActivities : outdoorActivities;

  const t = {
    TR: {
      title: "OSMO 360 PRO",
      subtitle: "Profesyonel sinematografi ayarları için verileri manuel girin.",
      locTypeLabel: "1. Çekim Ortamı",
      timeLabel: "2. Günün Saati",
      contextLabel: "3. Lokasyon Bağlamı",
      activityTypeLabel: "4. Senaryo Seçimi",
      weatherLabel: "5. Hava Durumu",
      extraLabel: "Ek Detaylar",
      locationTypes: { [LocationType.INDOOR]: "İç Mekan", [LocationType.OUTDOOR]: "Dış Mekan" },
      weatherTypes: {
        [WeatherType.SUNNY]: "Güneşli", [WeatherType.CLOUDY]: "Bulutlu", [WeatherType.OVERCAST]: "Kapalı",
        [WeatherType.RAINY]: "Yağmurlu", [WeatherType.FOGGY]: "Sisli", [WeatherType.SNOWY]: "Karlı"
      },
      activities: {
        [ShootingActivity.STATIC_LANDSCAPE]: "Manzara / Tripod", [ShootingActivity.WALKING]: "Yürüyüş",
        [ShootingActivity.RUNNING]: "Koşu", [ShootingActivity.CYCLING]: "Bisiklet",
        [ShootingActivity.MOTORCYCLING]: "Motosiklet", [ShootingActivity.DRIVING]: "Araç",
        [ShootingActivity.VLOGGING]: "Vlog", [ShootingActivity.ACTION]: "Aksiyon",
        [ShootingActivity.PARTY]: "Parti", [ShootingActivity.MUSEUM]: "Müze",
        [ShootingActivity.CONCERT]: "Konser", [ShootingActivity.STUDIO]: "Stüdyo",
        [ShootingActivity.SPORT_HALL]: "Spor", [ShootingActivity.REAL_ESTATE]: "Emlak",
        [ShootingActivity.CAFE_RESTAURANT]: "Kafe", [ShootingActivity.WORKSHOP]: "Atölye",
        [ShootingActivity.OFFICE]: "Ofis"
      },
      contextPlaceholder: "Örn: Dağ başı, dar sokak, plaj...",
      btn: "AYARLARI OLUŞTUR",
      results: "HESAPLANAN PARAMETRELER",
      footer: "Sensörü ve lensleri çekimden önce temizlemeyi unutmayın."
    },
    EN: {
      title: "OSMO 360 PRO",
      subtitle: "Enter manual data for expert cinematography settings.",
      locTypeLabel: "1. Shooting Environment",
      timeLabel: "2. Time of Day",
      contextLabel: "3. Location Context",
      activityTypeLabel: "4. Select Scenario",
      weatherLabel: "5. Weather Conditions",
      extraLabel: "Extra Details",
      locationTypes: { [LocationType.INDOOR]: "Indoor", [LocationType.OUTDOOR]: "Outdoor" },
      weatherTypes: {
        [WeatherType.SUNNY]: "Sunny", [WeatherType.CLOUDY]: "Cloudy", [WeatherType.OVERCAST]: "Overcast",
        [WeatherType.RAINY]: "Rainy", [WeatherType.FOGGY]: "Foggy", [WeatherType.SNOWY]: "Snowy"
      },
      activities: {
        [ShootingActivity.STATIC_LANDSCAPE]: "Landscape / Tripod", [ShootingActivity.WALKING]: "Walking",
        [ShootingActivity.RUNNING]: "Running", [ShootingActivity.CYCLING]: "Cycling",
        [ShootingActivity.MOTORCYCLING]: "Motorcycle", [ShootingActivity.DRIVING]: "Vehicle",
        [ShootingActivity.VLOGGING]: "Vlog", [ShootingActivity.ACTION]: "Action",
        [ShootingActivity.PARTY]: "Party", [ShootingActivity.MUSEUM]: "Museum",
        [ShootingActivity.CONCERT]: "Concert", [ShootingActivity.STUDIO]: "Studio",
        [ShootingActivity.SPORT_HALL]: "Sports", [ShootingActivity.REAL_ESTATE]: "Real Estate",
        [ShootingActivity.CAFE_RESTAURANT]: "Cafe", [ShootingActivity.WORKSHOP]: "Workshop",
        [ShootingActivity.OFFICE]: "Office"
      },
      contextPlaceholder: "E.g.: Mountain top, narrow street, beach...",
      btn: "GENERATE SETTINGS",
      results: "CALCULATED PARAMETERS",
      footer: "Always clean the sensor and lenses before shooting."
    }
  }[lang];

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      const data: EnvironmentData = {
        type: locType,
        activity,
        weather: locType === LocationType.OUTDOOR ? weather : undefined,
        time,
        locationContext,
        description
      };
      const result = calculateProSettings(data);
      setRecommendation(result);
      setLoading(false);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 600);
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 max-w-4xl mx-auto">
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setLang(l => l === 'TR' ? 'EN' : 'TR')}
          className="glass px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest border-white/10 hover:bg-white/10 transition-all uppercase"
        >
          {lang === 'TR' ? 'ENGLISH' : 'TÜRKÇE'}
        </button>
      </div>

      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter italic text-yellow-500 uppercase">
          {t.title}
        </h1>
        <p className="text-white/40 max-w-md mx-auto text-xs md:text-sm font-bold tracking-widest uppercase">
          {t.subtitle}
        </p>
      </header>

      <main className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mekan */}
          <section className="glass rounded-3xl p-6">
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">{t.locTypeLabel}</h2>
            <div className="flex gap-2">
              {[LocationType.INDOOR, LocationType.OUTDOOR].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setLocType(type);
                    setActivity(type === LocationType.INDOOR ? ShootingActivity.STUDIO : ShootingActivity.WALKING);
                  }}
                  className={`flex-1 py-4 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-wider ${
                    locType === type ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 border-white/10 text-white/30'
                  }`}
                >
                  {(t.locationTypes as any)[type]}
                </button>
              ))}
            </div>
          </section>

          {/* Zaman */}
          <section className="glass rounded-3xl p-6">
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">{t.timeLabel}</h2>
            <input 
              type="time" 
              value={time} 
              onChange={e => setTime(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-yellow-500 transition-colors"
            />
          </section>
        </div>

        {/* Lokasyon Bağlamı */}
        <section className="glass rounded-3xl p-6">
          <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">{t.contextLabel}</h2>
          <input 
            type="text" 
            value={locationContext}
            onChange={e => setLocationContext(e.target.value)}
            placeholder={t.contextPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold text-white outline-none placeholder:text-white/10"
          />
        </section>

        {/* Senaryo Seçimi */}
        <section className="glass rounded-3xl p-6">
          <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">{t.activityTypeLabel}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeActivities.map((act) => (
              <button
                key={act}
                onClick={() => setActivity(act)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  activity === act 
                    ? 'bg-white text-black border-white shadow-lg scale-105' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                }`}
              >
                <div className="mb-2">
                  <ActivityIcon name={act} />
                </div>
                <span className="text-[8px] font-black uppercase text-center tracking-tighter">
                  {(t.activities as any)[act]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Hava Durumu */}
        {locType === LocationType.OUTDOOR && (
          <section className="glass rounded-3xl p-6 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">{t.weatherLabel}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.values(WeatherType).map(w => (
                <button 
                  key={w} 
                  onClick={()=>setWeather(w)} 
                  className={`py-3 rounded-xl border text-[8px] font-black uppercase transition-all ${
                    weather === w ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-white/5 border-white/10 text-white/30'
                  }`}
                >
                  {(t.weatherTypes as any)[w]}
                </button>
              ))}
            </div>
          </section>
        )}

        <button 
          onClick={handleCalculate} 
          disabled={loading} 
          className="w-full py-6 rounded-3xl bg-yellow-500 text-black font-black text-xl shadow-[0_20px_40px_rgba(250,204,21,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 italic tracking-tighter"
        >
          {loading ? 'CALCULATING...' : t.btn}
        </button>

        {recommendation && (
          <div className="pt-12">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-black italic uppercase text-yellow-500 tracking-tighter">{t.results}</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <SettingsDisplay settings={recommendation} lang={lang} />
          </div>
        )}
      </main>

      <footer className="mt-24 text-center border-t border-white/5 pt-8">
        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">{t.footer}</p>
      </footer>
    </div>
  );
};

export default App;
