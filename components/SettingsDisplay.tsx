
import React from 'react';
import { ProSettings, AppLang } from '../types';

interface Props {
  settings: ProSettings;
  lang: AppLang;
}

const SettingsDisplay: React.FC<Props> = ({ settings, lang }) => {
  const labels = {
    TR: {
      res: "Çözünürlük",
      fps: "FPS",
      shutter: "Enstantane",
      iso: "ISO",
      ev: "Pozlama (EV)",
      wb: "Beyaz Dengesi",
      color: "Renk Profili",
      nd: "ND Filtre",
      why: "Neden bu ayarlar?",
      tip: "İPUCU"
    },
    EN: {
      res: "Resolution",
      fps: "FPS",
      shutter: "Shutter",
      iso: "ISO",
      ev: "Exposure (EV)",
      wb: "White Balance",
      color: "Color Profile",
      nd: "ND Filter",
      why: "Why these settings?",
      tip: "TIP"
    }
  }[lang];

  const SettingItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col p-4 glass rounded-xl border border-white/10">
      <span className="text-[10px] font-semibold text-yellow-500 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-base font-bold mono text-white truncate" title={value}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SettingItem label={labels.res} value={settings.resolution} />
        <SettingItem label={labels.fps} value={settings.fps} />
        <SettingItem label={labels.shutter} value={settings.shutterSpeed} />
        <SettingItem label={labels.iso} value={settings.iso} />
        <SettingItem label={labels.ev} value={settings.ev} />
        <SettingItem label={labels.wb} value={settings.whiteBalance} />
        <SettingItem label={labels.color} value={settings.colorProfile} />
        <SettingItem label={labels.nd} value={settings.ndFilter} />
      </div>

      <div className="glass p-5 rounded-2xl border border-white/10">
        <h3 className="text-lg font-bold mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {labels.why}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed italic">
          "{settings.explanation}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {settings.proTips.map((tip, idx) => (
          <div key={idx} className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
            <div className="flex items-start">
              <span className="bg-yellow-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-full mr-2 mt-1 uppercase whitespace-nowrap">{labels.tip} {idx + 1}</span>
              <p className="text-xs text-yellow-100/90 font-medium leading-tight">{tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsDisplay;
