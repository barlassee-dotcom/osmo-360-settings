
import React, { useState, useRef } from 'react';
import { DeviceType, LocationType, WeatherType, ShootingActivity, ProSettings, RecommendationRequest, AppLang, EnvironmentData } from './types';
import { getSettingsRecommendation } from './services/geminiService';
import SettingsDisplay from './components/SettingsDisplay';

const App: React.FC = () => {
  const [lang, setLang] = useState<AppLang>('TR');
  const [loading, setLoading] = useState(false);
  const [locType, setLocType] = useState<LocationType>(LocationType.OUTDOOR);
  const [activity, setActivity] = useState<ShootingActivity>(ShootingActivity.WALKING);
  const [country, setCountry] = useState('Türkiye');
  const [city, setCity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [weather, setWeather] = useState<WeatherType>(WeatherType.SUNNY);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<ProSettings | null>(null);
  const [autoData, setAutoData] = useState<{ weather: string, temp: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    TR: {
      title: "OSMO 360 DANIŞMANI",
      subtitle: "Mekan, hava durumu ve aktiviteye göre profesyonel çekim rehberi.",
      shootNow: "ŞİMDİ ÇEKİM YAPACAĞIM",
      locTypeLabel: "1. Mekan Türü",
      activityTypeLabel: "2. Ne Çekiyorsunuz?",
      locTimeLabel: "3. Lokasyon ve Zaman",
      extraLabel: "Ek Detaylar & Fotoğraf",
      locationTypes: {
        [LocationType.INDOOR]: "İç Mekan",
        [LocationType.OUTDOOR]: "Dış Mekan"
      },
      country: "ÜLKE",
      city: "ŞEHİR",
      date: "TARİH",
      time: "SAAT",
      weatherLabel: "HAVA DURUMU",
      weatherTypes: {
        [WeatherType.SUNNY]: "Güneşli",
        [WeatherType.CLOUDY]: "Bulutlu",
        [WeatherType.OVERCAST]: "Kapalı / Kasvetli",
        [WeatherType.RAINY]: "Yağmurlu",
        [WeatherType.FOGGY]: "Sisli",
        [WeatherType.SNOWY]: "Karlı"
      },
      activities: {
        [ShootingActivity.STATIC]: "Sabit / Tripod",
        [ShootingActivity.WALKING]: "Yürüyüş",
        [ShootingActivity.RUNNING]: "Koşu",
        [ShootingActivity.CYCLING]: "Bisiklet",
        [ShootingActivity.MOTORCYCLING]: "Motor Sürüşü",
        [ShootingActivity.DRIVING]: "Araç Sürüşü",
        [ShootingActivity.VLOGGING]: "Vlog / Elinde",
        [ShootingActivity.ACTION]: "Extreme Aksiyon",
        [ShootingActivity.PARTY]: "Parti / Etkinlik",
        [ShootingActivity.MUSEUM]: "Müze / Sergi",
        [ShootingActivity.CONCERT]: "Konser / Sahne",
        [ShootingActivity.STUDIO]: "Stüdyo / Röportaj",
        [ShootingActivity.SPORT_HALL]: "Spor Salonu",
        [ShootingActivity.REAL_ESTATE]: "Emlak / Ev Turu",
        [ShootingActivity.CAFE_RESTAURANT]: "Kafe / Restoran",
        [ShootingActivity.WORKSHOP]: "Atölye / Üretim",
        [ShootingActivity.OFFICE]: "Ofis / Toplantı"
      },
      descPlaceholder: "Örn: Kask üzerine monteli, az ışıklı oda, hızlı geçişler...",
      upload: "Ortam fotoğrafı yükle (Opsiyonel)",
      uploadSub: "AI ışık ve renk sıcaklığını analiz eder",
      btn: "PRO AYARLARI OLUŞTUR",
      loading: "STRATEJİ BELİRLENİYOR...",
      results: "DİNAMİK PRO AYARLAR",
      footer: "Lenslerinizi silmeyi unutmayın!",
      autoLocSuccess: "Akıllı veriler hazır!",
      manualOr: "VEYA MANUEL VERİ GİRİŞİ",
      satelliteData: "UYDU VERİLERİ",
      errors: {
        geoDenied: "Konum izni reddedildi. Lütfen tarayıcı ayarlarından konuma izin verin.",
        apiError: "Analiz sırasında bir sorun oluştu. Lütfen tekrar deneyin.",
        noData: "Konum bilgisi alınamadı, lütfen manuel formu kullanın."
      },
      activityIcons: {
        [ShootingActivity.STATIC]: '🔭',
        [ShootingActivity.WALKING]: '🚶',
        [ShootingActivity.RUNNING]: '🏃',
        [ShootingActivity.CYCLING]: '🚲',
        [ShootingActivity.MOTORCYCLING]: '🏍️',
        [ShootingActivity.DRIVING]: '🚗',
        [ShootingActivity.VLOGGING]: '🤳',
        [ShootingActivity.ACTION]: '⚡',
        [ShootingActivity.PARTY]: '🎉',
        [ShootingActivity.MUSEUM]: '🏛️',
        [ShootingActivity.CONCERT]: '🎸',
        [ShootingActivity.STUDIO]: '🎙️',
        [ShootingActivity.SPORT_HALL]: '🏀',
        [ShootingActivity.REAL_ESTATE]: '🏠',
        [ShootingActivity.CAFE_RESTAURANT]: '☕',
        [ShootingActivity.WORKSHOP]: '🛠️',
        [ShootingActivity.OFFICE]: '💼'
      }
    },
    EN: {
      title: "OSMO 360 ADVISOR",
      subtitle: "Pro 360 guide based on location, weather, and activity.",
      shootNow: "I'M SHOOTING NOW",
      locTypeLabel: "1. Location Type",
      activityTypeLabel: "2. What are you shooting?",
      locTimeLabel: "3. Location & Time",
      extraLabel: "Extra Details & Photo",
      locationTypes: {
        [LocationType.INDOOR]: "Indoor",
        [LocationType.OUTDOOR]: "Outdoor"
      },
      country: "COUNTRY",
      city: "CITY",
      date: "DATE",
      time: "TIME",
      weatherLabel: "WEATHER",
      weatherTypes: {
        [WeatherType.SUNNY]: "Sunny",
        [WeatherType.CLOUDY]: "Cloudy",
        [WeatherType.OVERCAST]: "Overcast",
        [WeatherType.RAINY]: "Rainy",
        [WeatherType.FOGGY]: "Foggy",
        [WeatherType.SNOWY]: "Snowy"
      },
      activities: {
        [ShootingActivity.STATIC]: "Static / Tripod",
        [ShootingActivity.WALKING]: "Walking",
        [ShootingActivity.RUNNING]: "Running",
        [ShootingActivity.CYCLING]: "Cycling",
        [ShootingActivity.MOTORCYCLING]: "Motorcycling",
        [ShootingActivity.DRIVING]: "Driving",
        [ShootingActivity.VLOGGING]: "Vlogging",
        [ShootingActivity.ACTION]: "Extreme Action",
        [ShootingActivity.PARTY]: "Party / Event",
        [ShootingActivity.MUSEUM]: "Museum / Exhibit",
        [ShootingActivity.CONCERT]: "Concert / Stage",
        [ShootingActivity.STUDIO]: "Studio / Interview",
        [ShootingActivity.SPORT_HALL]: "Indoor Sports",
        [ShootingActivity.REAL_ESTATE]: "Real Estate / Tour",
        [ShootingActivity.CAFE_RESTAURANT]: "Cafe / Restaurant",
        [ShootingActivity.WORKSHOP]: "Workshop / Studio",
        [ShootingActivity.OFFICE]: "Office / Meeting"
      },
      descPlaceholder: "E.g.: Helmet mounted, low light room, fast transitions...",
      upload: "Upload environment photo (Optional)",
      uploadSub: "AI analyzes light and color temperature",
      btn: "GENERATE PRO SETTINGS",
      loading: "PLANNING STRATEGY...",
      results: "DYNAMIC PRO SETTINGS",
      footer: "Don't forget to wipe your lenses!",
      autoLocSuccess: "Smart data ready!",
      manualOr: "OR MANUAL DATA ENTRY",
      satelliteData: "SATELLITE DATA",
      errors: {
        geoDenied: "Location permission denied. Please allow location in settings.",
        apiError: "Something went wrong during analysis. Please try again.",
        noData: "Could not get location. Please use the manual form."
      },
      activityIcons: {
        [ShootingActivity.STATIC]: '🔭',
        [ShootingActivity.WALKING]: '🚶',
        [ShootingActivity.RUNNING]: '🏃',
        [ShootingActivity.CYCLING]: '🚲',
        [ShootingActivity.MOTORCYCLING]: '🏍️',
        [ShootingActivity.DRIVING]: '🚗',
        [ShootingActivity.VLOGGING]: '🤳',
        [ShootingActivity.ACTION]: '⚡',
        [ShootingActivity.PARTY]: '🎉',
        [ShootingActivity.MUSEUM]: '🏛️',
        [ShootingActivity.CONCERT]: '🎸',
        [ShootingActivity.STUDIO]: '🎙️',
        [ShootingActivity.SPORT_HALL]: '🏀',
        [ShootingActivity.REAL_ESTATE]: '🏠',
        [ShootingActivity.CAFE_RESTAURANT]: '☕',
        [ShootingActivity.WORKSHOP]: '🛠️',
        [ShootingActivity.OFFICE]: '💼'
      }
    }
  }[lang];

  const getPosition = (options: PositionOptions): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const handleShootNow = async () => {
    setLoading(true);
    setAutoData(null);
    try {
      let position: GeolocationPosition;
      try {
        // Try high accuracy first
        position = await getPosition({ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
      } catch (e) {
        // Fallback to basic accuracy if GPS is slow/weak
        position = await getPosition({ enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
      }
      
      const { latitude, longitude } = position.coords;
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      if (!weatherRes.ok) throw new Error("Weather API failed");
      const weatherJson = await weatherRes.json();
      
      const current = weatherJson.current_weather;
      const weatherCodes: any = { 0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast", 45: "Foggy", 48: "Foggy", 51: "Drizzle", 61: "Rain", 71: "Snow" };
      const weatherDesc = weatherCodes[current.weathercode] || "Variable";
      
      const env: EnvironmentData = {
        type: LocationType.OUTDOOR,
        activity: activity,
        weather: weatherDesc,
        temp: `${current.temperature}°C`,
        time: new Date().toLocaleTimeString(),
        isAuto: true
      };

      setAutoData({ weather: weatherDesc, temp: `${current.temperature}°C` });
      
      const result = await getSettingsRecommendation({
        device: DeviceType.OSMO_360,
        envData: env,
        lang: lang
      });
      setRecommendation(result);
    } catch (err: any) {
      console.error("Shoot Now Error:", err);
      if (err.code === 1) alert(t.errors.geoDenied);
      else if (err.code === 2 || err.code === 3) alert(t.errors.noData);
      else alert(t.errors.apiError);
    } finally {
      setLoading(false);
    }
  };

  const getAdvice = async () => {
    setLoading(true);
    setRecommendation(null);
    setAutoData(null);
    try {
      const env: EnvironmentData = {
        type: locType,
        activity: activity,
        country: locType === LocationType.OUTDOOR ? country : undefined,
        city: locType === LocationType.OUTDOOR ? city : undefined,
        date: locType === LocationType.OUTDOOR ? date : undefined,
        time: locType === LocationType.OUTDOOR ? time : undefined,
        weather: locType === LocationType.OUTDOOR ? weather : undefined,
        description: description
      };
      const result = await getSettingsRecommendation({
        device: DeviceType.OSMO_360,
        envData: env,
        image: image || undefined,
        lang: lang
      });
      setRecommendation(result);
    } catch (error: any) {
      console.error("Manual Entry Error:", error);
      alert(t.errors.apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 max-w-4xl mx-auto">
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setLang(l => l === 'TR' ? 'EN' : 'TR')}
          className="glass px-6 py-2 rounded-full text-[10px] font-black tracking-widest border-white/20 hover:bg-white/10 hover:border-yellow-500/50 transition-all uppercase"
        >
          {lang === 'TR' ? 'SWITCH TO ENGLISH' : 'TÜRKÇE\'YE GEÇ'}
        </button>
      </div>

      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-white/5 border border-white/10 px-4">
          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">360° Vision Assistant</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter italic">
          {t.title}
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base px-4 font-medium opacity-80">
          {t.subtitle}
        </p>
      </header>

      <main className="space-y-6">
        <section className="glass rounded-3xl p-6 shadow-2xl">
          <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6 flex items-center">
            <span className="w-4 h-px bg-yellow-500/50 mr-2"></span>
            {t.activityTypeLabel}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.values(ShootingActivity).map((act) => (
              <button
                key={act}
                onClick={() => setActivity(act)}
                className={`flex flex-col items-center justify-center py-4 px-1 rounded-2xl border-2 transition-all duration-300 ${
                  activity === act 
                    ? 'bg-yellow-500 border-yellow-500 text-black shadow-[0_0_25px_rgba(250,204,21,0.4)] scale-105' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                }`}
              >
                <span className="text-2xl mb-2">{(t.activityIcons as any)[act]}</span>
                <span className="text-[9px] font-black uppercase text-center leading-none tracking-tighter px-1">
                  {(t.activities as any)[act]}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-r from-yellow-500 via-yellow-200 to-orange-500 animate-gradient-x shadow-2xl">
          <button 
            onClick={handleShootNow}
            disabled={loading}
            className="w-full bg-[#0a0a0a] py-6 rounded-[22px] flex flex-col items-center justify-center group hover:bg-black/40 transition-all"
          >
            <span className="text-2xl font-black text-white tracking-tighter italic uppercase">{t.shootNow}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping"></span>
              <span className="text-[10px] text-yellow-500/80 font-bold tracking-widest uppercase">Smart Sensing Enabled</span>
            </div>
          </button>
        </section>

        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-white/5"></div>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{t.manualOr}</span>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>

        <div className="space-y-6">
          <section className="glass rounded-3xl p-6">
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">{t.locTypeLabel}</h2>
            <div className="grid grid-cols-2 gap-4">
              {[LocationType.INDOOR, LocationType.OUTDOOR].map((type) => (
                <button
                  key={type}
                  onClick={() => setLocType(type)}
                  className={`py-5 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-wider ${
                    locType === type ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/50'
                  }`}
                >
                  {(t.locationTypes as any)[type]}
                </button>
              ))}
            </div>
          </section>

          {locType === LocationType.OUTDOOR && (
            <section className="glass rounded-3xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
              <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t.locTimeLabel}</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={country} onChange={e=>setCountry(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-yellow-500 outline-none placeholder:text-white/20" placeholder={t.country} />
                <input type="text" value={city} onChange={e=>setCity(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-yellow-500 outline-none placeholder:text-white/20" placeholder={t.city} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold uppercase" />
                <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold uppercase" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Object.values(WeatherType).map(w => (
                  <button key={w} onClick={()=>setWeather(w)} className={`py-3 rounded-xl border text-[9px] font-black uppercase transition-colors ${weather === w ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
                    {(t.weatherTypes as any)[w]}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="glass rounded-3xl p-6 space-y-4">
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t.extraLabel}</h2>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder={t.descPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm font-medium focus:ring-1 focus:ring-yellow-500 outline-none min-h-[100px] placeholder:text-white/10 text-white" />
            
            <div onClick={()=>fileInputRef.current?.click()} className="p-10 border-2 border-dashed border-white/10 rounded-2xl text-center cursor-pointer hover:border-yellow-500/30 transition-all bg-white/[0.01]">
              {image ? <img src={image} className="max-h-48 mx-auto rounded-xl shadow-2xl border border-white/10" /> : (
                <>
                  <p className="text-xs font-black text-white/60 uppercase tracking-widest">{t.upload}</p>
                  <p className="text-[9px] text-white/20 mt-2 uppercase italic font-bold tracking-tight">{t.uploadSub}</p>
                </>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e)=>{
                 const file = e.target.files?.[0];
                 if (file) {
                   const reader = new FileReader();
                   reader.onloadend = () => setImage(reader.result as string);
                   reader.readAsDataURL(file);
                 }
              }} />
            </div>
          </section>
        </div>

        <button onClick={getAdvice} disabled={loading} className="w-full py-6 rounded-3xl bg-white text-black font-black text-xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-yellow-500 hover:scale-[1.01] transition-all disabled:opacity-50 italic uppercase tracking-tighter">
          {loading ? t.loading : t.btn}
        </button>

        {autoData && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 p-5 rounded-2xl flex items-center justify-between animate-in slide-in-from-left-4">
             <div className="flex items-center gap-4">
               <span className="text-2xl">📡</span>
               <div>
                 <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">{t.satelliteData}</p>
                 <p className="text-xs text-white/90 font-bold uppercase">{autoData.weather} • {autoData.temp} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
               </div>
             </div>
             <span className="text-[9px] text-yellow-500/40 font-black italic uppercase tracking-tighter">{t.autoLocSuccess}</span>
          </div>
        )}

        {recommendation && (
          <section className="mt-14 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase whitespace-nowrap">{t.results}</h2>
              <div className="h-px w-full bg-gradient-to-r from-yellow-500 to-transparent"></div>
            </div>
            <SettingsDisplay settings={recommendation} lang={lang} />
          </section>
        )}
      </main>

      <footer className="mt-20 text-center text-white/10 text-[8px] font-mono uppercase tracking-[0.5em] opacity-50">
        <p>© 2024 DJI OSMO 360 AI ENGINE</p>
        <p className="mt-2 text-yellow-500/20">{t.footer}</p>
      </footer>

      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
        ::placeholder {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

export default App;
