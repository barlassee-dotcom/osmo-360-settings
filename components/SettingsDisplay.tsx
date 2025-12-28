
import React from 'react';
import { ProSettings } from '../types';

interface Props {
  settings: ProSettings;
}

const SettingsDisplay: React.FC<Props> = ({ settings }) => {
  const SettingItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col p-4 glass rounded-xl border border-white/10">
      <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-lg font-bold mono text-white">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SettingItem label="Resolution" value={settings.resolution} />
        <SettingItem label="FPS" value={settings.fps} />
        <SettingItem label="Shutter" value={settings.shutterSpeed} />
        <SettingItem label="ISO" value={settings.iso} />
        <SettingItem label="EV (Pozlama)" value={settings.ev} />
        <SettingItem label="White Balance" value={settings.whiteBalance} />
        <SettingItem label="Color Profile" value={settings.colorProfile} />
        <SettingItem label="ND Filter" value={settings.ndFilter} />
      </div>

      <div className="glass p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-bold mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Neden bu ayarlar?
        </h3>
        <p className="text-gray-300 leading-relaxed italic">
          "{settings.explanation}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {settings.proTips.map((tip, idx) => (
          <div key={idx} className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
            <div className="flex items-start">
              <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full mr-3 mt-1 uppercase">İPUCU {idx + 1}</span>
              <p className="text-sm text-yellow-100/90 font-medium leading-tight">{tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsDisplay;
