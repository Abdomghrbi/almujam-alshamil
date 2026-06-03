'use client';

import { useState } from 'react';

const locationData = {
  'سوريا': ['دمشق', 'حلب', 'حمص', 'اللاذقية', 'طرطوس', 'حماة', 'دير الزور', 'إدلب', 'الحسكة', 'الرقة', 'درعا', 'السويداء', 'القنيطرة'],
  'العراق': ['بغداد', 'البصرة', 'نينوى', 'أربيل', 'السليمانية', 'كركوك', 'النجف', 'كربلاء', 'ذي قار', 'الأنبار'],
  'السعودية': ['الرياض', 'مكة المكرمة', 'المدينة المنورة', 'الشرقية', 'عسير', 'جازان', 'القصيم', 'نجران', 'تبوك', 'حائل', 'الباحة', 'الحدود الشمالية', 'الجوف'],
  'مصر': ['القاهرة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'الغربية', 'القليوبية', 'المنوفية', 'البحيرة', 'كفر الشيخ', 'الفيوم', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'جنوب سيناء', 'شمال سيناء', 'مطروح', 'بورسعيد', 'السويس', 'الإسماعيلية'],
  'الأردن': ['عمان', 'إربد', 'البلقاء', 'الكرك', 'العقبة', 'معان', 'الزرقاء', 'جرش', 'عجلون', 'مادبا', 'الطفيلة'],
  'لبنان': ['بيروت', 'جبل لبنان', 'الشمال', 'البقاع', 'الجنوب', 'النبطية'],
  'فلسطين': ['القدس', 'رام الله', 'نابلس', 'الخليل', 'جنين', 'غزة', 'الناصرة', 'عكا', 'صفد'],
  'اليمن': ['صنعاء', 'عدن', 'تعز', 'الحديدة', 'حضرموت', 'إب', 'مأرب', 'ذمار', 'عمران', 'حجة', 'الضالع', 'أبين', 'لحج', 'المهرة', 'سقطرى'],
  'المغرب': ['الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'أكادير', 'وجدة', 'تطوان', 'بني ملال', 'الرشيدية', 'العيون', 'الداخلة'],
  'الجزائر': ['الجزائر العاصمة', 'وهران', 'قسنطينة', 'عنابة', 'بجاية', 'تيزي وزو', 'سطيف', 'ورقلة', 'بسكرة', 'باتنة', 'تلمسان', 'الشلف', 'تبسة', 'الوادي', 'غرداية'],
  'تونس': ['تونس', 'صفاقس', 'سوسة', 'القيروان', 'بنزرت', 'نابل', 'قابس', 'مدنين', 'الكاف', 'تطاوين', 'قفصة', 'المهدية', 'المنستير'],
  'ليبيا': ['طرابلس', 'بنغازي', 'مصراتة', 'الزاوية', 'سبها', 'البيضاء', 'طبرق', 'درنة', 'سرت', 'المرج', 'زوارة', 'غريان', 'الكفرة'],
  'السودان': ['الخرطوم', 'شمال كردفان', 'غرب دارفور', 'كسلا', 'بورتسودان', 'ود مدني', 'نهر النيل', 'سنار'],
  'عمان': ['مسقط', 'صلالة', 'نزوى', 'صحار', 'البريمي', 'صور', 'إبراء'],
  'الإمارات': ['أبوظبي', 'دبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين'],
  'الكويت': ['العاصمة', 'حولي', 'الفروانية', 'الأحمدي', 'الجهراء', 'مبارك الكبير'],
  'قطر': ['الدوحة', 'الريان', 'الخور', 'الوكرة', 'الشمال', 'أم صلال'],
  'البحرين': ['المنامة', 'المحرق', 'الرفاع', 'عيسى', 'سترة'],
  'موريتانيا': ['نواكشوط', 'نواذيبو', 'كيهيدي', 'الزويرات'],
  'الصومال': ['مقديشو', 'هرجيسا', 'كيسمايو', 'بوصاصو'],
  'جيبوتي': ['جيبوتي'],
  'جزر القمر': ['موروني'],
};

export default function LocationPicker({ onChange }) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const countries = Object.keys(locationData).sort();
  const states = selectedCountry ? locationData[selectedCountry] || [] : [];

  const emitChange = (country, state, district) => {
    onChange?.({ country, state, district });
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedDistrict('');
    emitChange(country, '', '');
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedDistrict('');
    emitChange(selectedCountry, state, '');
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    emitChange(selectedCountry, selectedState, district);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1">البلد</label>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          required
          className="input-field !py-2 !text-sm"
        >
          <option value="">اختر البلد</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1">المحافظة</label>
        <select
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          disabled={!selectedCountry}
          className="input-field !py-2 !text-sm"
        >
          <option value="">اختر المحافظة</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1">المنطقة (اختياري)</label>
        <input
          type="text"
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          placeholder="الحي / القرية"
          className="input-field !py-2 !text-sm"
        />
      </div>
    </div>
  );
}
