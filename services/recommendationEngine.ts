
import { LocationType, ShootingActivity, WeatherType, ProSettings, EnvironmentData } from "../types";

export function calculateProSettings(data: EnvironmentData): ProSettings {
  const { type, activity, weather, time } = data;
  
  const hour = parseInt(time.split(':')[0]);
  const isNight = hour >= 20 || hour < 6;
  const isGoldenHour = (hour >= 6 && hour <= 8) || (hour >= 17 && hour <= 19);
  const isMidday = hour >= 10 && hour <= 15;

  let res = "5.7K";
  let fps = "30";
  let shutter = "1/60";
  let iso = "100";
  let ev = "0.0";
  let wb = "5600K";
  let color = "Normal";
  let nd = "Gerekli Değil";
  let explanation = "";
  let tips: string[] = [];

  // 1. Hareketli Senaryolar (FPS ve Shutter)
  const highMotion = [
    ShootingActivity.RUNNING, 
    ShootingActivity.CYCLING, 
    ShootingActivity.MOTORCYCLING, 
    ShootingActivity.ACTION,
    ShootingActivity.SPORT_HALL
  ];

  if (highMotion.includes(activity)) {
    fps = "60";
    res = "4K";
    shutter = isNight ? "1/60" : "1/120"; // Gece hareketi için ışık toplamak adına biraz yavaşlatıyoruz
  } else if (activity === ShootingActivity.STATIC_LANDSCAPE || activity === ShootingActivity.REAL_ESTATE) {
    fps = "24";
    res = "5.7K";
    shutter = "1/50";
  }

  // 2. Işık ve Zaman Analizi
  if (type === LocationType.INDOOR) {
    wb = "4000K";
    nd = "Kullanmayın";
    shutter = "1/50"; // 50Hz anti-flicker
    
    if (activity === ShootingActivity.CONCERT || activity === ShootingActivity.PARTY) {
      iso = "800 - 1600";
      explanation = "Düşük ışıklı kapalı alan çekimi için yüksek ISO ve titreme önleyici enstantane hızı seçildi.";
      tips = ["Grenleri önlemek için ISO limitini manuel sabitleyin.", "Ses için rüzgar gürültüsü azaltmayı kapatın.", "Objelerden 1.5m uzak durarak dikiş izini azaltın."];
    } else {
      iso = "200 - 400";
      explanation = "Standart iç mekan aydınlatması için optimize edilmiş temiz görüntü ayarları.";
      tips = ["Beyaz dengesini manuel (Kelvin) olarak sabitleyin.", "HDR modunu kapalı tutun.", "Kamera yüksekliğini göğüs hizasına çekin."];
    }
  } else {
    // DIŞ MEKAN ANALİZİ
    if (isNight) {
      iso = "1600 - 3200";
      wb = "4500K";
      nd = "Kullanmayın";
      ev = "+0.3";
      explanation = "Gece çekimi için maksimum ışık hassasiyeti ve kontrast dengesi sağlandı.";
      tips = ["Görüntüdeki grenleri post-prodüksiyonda temizleyin.", "Hareketi azaltıp shutter'ı 1/50'ye çekebilirsiniz.", "Işık kaynaklarını dikiş hattından uzak tutun."];
    } else if (isGoldenHour) {
      wb = "6000K";
      nd = "ND4 veya ND8";
      iso = "100";
      ev = "-0.3";
      explanation = "Altın saatlerin sıcaklığını vurgulayan ve parlamaları kontrol eden ayarlar.";
      tips = ["Güneşi tam arkaya veya tam yana (dikiş hattı olmayan yere) alın.", "Renkleri korumak için D-Log M kullanın.", "ND filtre ile gökyüzü dokusunu koruyun."];
    } else if (isMidday && weather === WeatherType.SUNNY) {
      wb = "5600K";
      nd = "ND32 veya ND64";
      iso = "100";
      ev = "-0.7";
      explanation = "Sert öğle güneşinde aşırı pozlamayı önlemek için güçlü ND filtre ve negatif EV seçildi.";
      tips = ["Aşırı pozlama uyarısını (zebra) açın.", "Gökyüzü detayları için mutlaka ND kullanın.", "Keskinlik (Sharpness) değerini -1'e çekin."];
    } else {
      wb = "Auto";
      iso = "100 - 400";
      nd = "ND16";
      explanation = "Gün ışığı koşulları için dengeli sinematik görünüm.";
      tips = ["Hava bulutluysa WB değerini 6500K yapın.", "ND filtre hareket bulanıklığına yardımcı olur.", "Lenslerinizi her yöne doğrultup pozlamayı kontrol edin."];
    }
  }

  // 3. Renk Profili
  if (activity === ShootingActivity.MOTORCYCLING || activity === ShootingActivity.ACTION) {
    color = "D-Log M (10-bit)";
  }

  return {
    resolution: res,
    fps: fps,
    shutterSpeed: shutter,
    iso: iso,
    ev: ev,
    whiteBalance: wb,
    colorProfile: color,
    ndFilter: nd,
    explanation: explanation,
    proTips: tips.length > 0 ? tips : ["Lens temizliğini kontrol edin.", "Batarya seviyesinden emin olun.", "Hafıza kartı hızını (V30+) kontrol edin."]
  };
}
