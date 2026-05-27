'use client';

import { useState, useEffect } from 'react';

// Data: country → states → cities
const locationData = {
  'سوريا': {
    states: {
      'دمشق': { cities: ['دمشق', 'جرمانا', 'دورا'] },
      'حلب': { cities: ['حلب', 'منبج', 'الباب', 'عفرين'] },
      'حمص': { cities: ['حمص', 'تدمر', 'المخرم'] },
      'اللاذقية': { cities: ['اللاذقية', 'جبلة', 'القرداحة', 'الحفة'] },
      'طرطوس': { cities: ['طرطوس', 'بانياس', 'صافيتا', 'دركيش'] },
      'حماه': { cities: ['حماه', 'سلمية', 'مصياف', 'محردة'] },
      'دير الزور': { cities: ['دير الزور', 'الميادين', 'البوكمال'] },
      'إدلب': { cities: ['إدلب', 'معرة النعمان', 'سراقب', 'أريحا'] },
      'الحسكة': { cities: ['الحسكة', 'القامشلي', 'المالكية'] },
      'الرقة': { cities: ['الرقة', 'الطبقة', 'تل أبيض'] },
      'درعا': { cities: ['درعا', 'نوى', 'ازرع', 'جاسم'] },
      'السويداء': { cities: ['السويداء', 'شهبا', 'صلخد'] },
      'القنيطرة': { cities: ['القنيطرة', 'فيق'] },
    }
  },
  'العراق': {
    states: {
      'بغداد': { cities: ['بغداد', 'أبو غريب', 'المحمودية'] },
      'البصرة': { cities: ['البصرة', 'القرنة', 'الفاو'] },
      'نينوى': { cities: ['الموصل', 'تلكيف', 'الحدباء'] },
      'أربيل': { cities: ['أربيل', 'شقلاوه', 'كويسنجق'] },
      'السليمانية': { cities: ['السليمانية', 'حلبجة', 'بانه'] },
      'كركوك': { cities: ['كركوك', 'داقوق'] },
      'النجف': { cities: ['النجف', 'الكوفة'] },
      'كربلاء': { cities: ['كربلاء'] },
      'ذي قار': { cities: ['الناصرية', 'سوق الشيوخ'] },
      'الأنبار': { cities: ['الرمادي', 'الفلوجة', 'حديثة'] },
    }
  },
  'السعودية': {
    states: {
      'الرياض': { cities: ['الرياض', 'الخرج', 'المجمعة', 'الدوادمي'] },
      'مكة المكرمة': { cities: ['مكة', 'جدة', 'الطائف', 'القنفذة', 'الليث'] },
      'المدينة المنورة': { cities: ['المدينة', 'ينبع', 'بدر', 'الحناكية'] },
      'الشرقية': { cities: ['الدمام', 'الخبر', 'الظهران', 'الأحساء', 'القطيف'] },
      'عسير': { cities: ['أبها', 'خميس مشيط', 'بيشة'] },
      'جازان': { cities: ['جازان', 'صبياء', 'أبو عريش'] },
      'القصيم': { cities: ['بريدة', 'عنيزة', 'الرس'] },
      'نجران': { cities: ['نجران', 'شرورة'] },
      'تبوك': { cities: ['تبوك', 'تيماء', 'ضباء'] },
      'حائل': { cities: ['حائل'] },
      'الباحة': { cities: ['الباحة', 'المندق'] },
      'الحدود الشمالية': { cities: ['عرعر', 'رفحاء'] },
      'الجوف': { cities: ['سكاكا', 'دومة الجندل'] },
    }
  },
  'مصر': {
    states: {
      'القاهرة': { cities: ['القاهرة', 'حلوان', 'المعادي'] },
      'الإسكندرية': { cities: ['الإسكندرية', 'برج العرب'] },
      'الدقهلية': { cities: ['المنصورة', 'طلخا', 'ميت غمر'] },
      'الشرقية': { cities: ['الزقازيق', 'بلبيس', 'أبو حماد'] },
      'الغربية': { cities: ['طنطا', 'المحلة الكبرى', 'كفر الزيات'] },
      'القليوبية': { cities: ['بنها', 'شبرا الخيمة', 'قليوب'] },
      'المنوفية': { cities: ['شبين الكوم', 'منوف'] },
      'البحرية': { cities: ['دمنهور', 'كفر الدوار'] },
      'كفر الشيخ': { cities: ['كفر الشيخ', 'دسوق'] },
      'الفيوم': { cities: ['الفيوم', 'إطسا'] },
      'أسيوط': { cities: ['أسيوط', 'منفلوط'] },
      'سوهاج': { cities: ['سوهاج', 'أخميم'] },
      'قنا': { cities: ['قنا', 'نجع حمادي'] },
      'الأقصر': { cities: ['الأقصر', 'إسنا'] },
      'أسوان': { cities: ['أسوان', 'كوم أمبو'] },
      'البحر الأحمر': { cities: ['الغردقة', 'مرسى علم'] },
      'جنوب سيناء': { cities: ['شرم الشيخ', 'دهب'] },
      'شمال سيناء': { cities: ['العريش', 'رفح'] },
      'مطروح': { cities: ['مرسى مطروح', 'سيوة'] },
      'بورسعيد': { cities: ['بورسعيد'] },
      'السويس': { cities: ['السويس'] },
      'الإسماعيلية': { cities: ['الإسماعيلية', 'فايد'] },
    }
  },
  'الأردن': {
    states: {
      'عمان': { cities: ['عمان', 'الزرقاء', 'مادبا', 'السلط'] },
      'إربد': { cities: ['إربد', 'الرمثا', 'المفرق', 'عجلون'] },
      'البلقاء': { cities: ['السلط'] },
      'الكرك': { cities: ['الكرك'] },
      'العقبة': { cities: ['العقبة'] },
      'معان': { cities: ['معان', 'البتراء'] },
      'الزرقاء': { cities: ['الزرقاء', 'الرصيفة'] },
      'جرش': { cities: ['جرش'] },
      'عجلون': { cities: ['عجلون'] },
      'مادبا': { cities: ['مادبا', 'ذيبان'] },
      'الطفيلة': { cities: ['الطفيلة'] },
    }
  },
  'لبنان': {
    states: {
      'بيروت': { cities: ['بيروت'] },
      'جبل لبنان': { cities: ['عاليه', 'بعبدا', 'جبيل', 'كسروان', 'المتن'] },
      'الشمال': { cities: ['طرابلس', 'المنية', 'زغرتا', 'بشرّي', 'الكورة'] },
      'البقاع': { cities: ['زحلة', 'بعلبك', 'الهرمل', 'راشيا'] },
      'الجنوب': { cities: ['صيدا', 'صور', 'جزين'] },
      'النبطية': { cities: ['النبطية', 'مرجعيون', 'بنت جبيل'] },
    }
  },
  'فلسطين': {
    states: {
      'القدس': { cities: ['القدس', 'بيت لحم', 'بيت جالا'] },
      'رام الله': { cities: ['رام الله', 'البيرة'] },
      'نابلس': { cities: ['نابلس', 'طولكرم', 'قلقيلية'] },
      'الخليل': { cities: ['الخليل', 'بيت لحم', 'دورا'] },
      'جنين': { cities: ['جنين'] },
      'غزة': { cities: ['غزة', 'خان يونس', 'رفح', 'دير البلح'] },
      'الناصرة': { cities: ['الناصرة', 'حيفا'] },
      'عكا': { cities: ['عكا'] },
      'صفد': { cities: ['صفد', 'طبريا'] },
    }
  },
  'اليمن': {
    states: {
      'صنعاء': { cities: ['صنعاء', 'همدان', 'سنحان'] },
      'عدن': { cities: ['عدن', 'الشيخ عثمان'] },
      'تعز': { cities: ['تعز', 'المخا'] },
      'الحديدة': { cities: ['الحديدة', 'زبيد'] },
      'حضرموت': { cities: ['المكلا', 'سيئون', 'تريم'] },
      'إب': { cities: ['إب', 'العدين'] },
      'مأرب': { cities: ['مأرب'] },
      'ذمار': { cities: ['ذمار'] },
      'عمران': { cities: ['عمران'] },
      'حجة': { cities: ['حجة'] },
      'الضالع': { cities: ['الضالع'] },
      'أبين': { cities: ['زنجبار', 'جعار'] },
      'لحج': { cities: ['لحج', 'الحوطة'] },
      'المهرة': { cities: ['الغيضة'] },
      'سقطرى': { cities: ['حديبو'] },
    }
  },
  'المغرب': {
    states: {
      'الدار البيضاء': { cities: ['الدار البيضاء', 'المحمدية'] },
      'الرباط': { cities: ['الرباط', 'سلا', 'تمارة'] },
      'مراكش': { cities: ['مراكش'] },
      'فاس': { cities: ['فاس', 'مكناس'] },
      'طنجة': { cities: ['طنجة', 'أصيلة'] },
      'أكادير': { cities: ['أكادير', 'إنزكان'] },
      'وجدة': { cities: ['وجدة'] },
      'تطوان': { cities: ['تطوان'] },
      'بني ملال': { cities: ['بني ملال'] },
      'الرشيدية': { cities: ['الرشيدية'] },
      'العيون': { cities: ['العيون'] },
      'الداخلة': { cities: ['الداخلة'] },
    }
  },
  'الجزائر': {
    states: {
      'الجزائر العاصمة': { cities: ['الجزائر'] },
      'وهران': { cities: ['وهران', 'أرزيو'] },
      'قسنطينة': { cities: ['قسنطينة'] },
      'عنابة': { cities: ['عنابة'] },
      'بجاية': { cities: ['بجاية'] },
      'تيزي وزو': { cities: ['تيزي وزو'] },
      'سطيف': { cities: ['سطيف'] },
      'ورقلة': { cities: ['ورقلة', 'حاسي مسعود'] },
      'بسكرة': { cities: ['بسكرة'] },
      'باتنة': { cities: ['باتنة'] },
      'تلمسان': { cities: ['تلمسان'] },
      'الشلف': { cities: ['الشلف'] },
      'تبسة': { cities: ['تبسة'] },
      'الوادي': { cities: ['الوادي'] },
      'غرداية': { cities: ['غرداية'] },
    }
  },
  'تونس': {
    states: {
      'تونس': { cities: ['تونس', 'أريانة', 'بن عروس'] },
      'صفاقس': { cities: ['صفاقس'] },
      'سوسة': { cities: ['سوسة'] },
      'القيروان': { cities: ['القيروان'] },
      'بنزرت': { cities: ['بنزرت'] },
      'نابل': { cities: ['نابل', 'الحمامات'] },
      'قابس': { cities: ['قابس'] },
      'مدنين': { cities: ['مدنين', 'جربة'] },
      'الكاف': { cities: ['الكاف'] },
      'تطاوين': { cities: ['تطاوين'] },
      'قفصة': { cities: ['قفصة'] },
      'المهدية': { cities: ['المهدية'] },
      'المنستير': { cities: ['المنستير'] },
    }
  },
  'ليبيا': {
    states: {
      'طرابلس': { cities: ['طرابلس', 'تاجوراء'] },
      'بنغازي': { cities: ['بنغازي'] },
      'مصراتة': { cities: ['مصراتة'] },
      'الزاوية': { cities: ['الزاوية'] },
      'سبها': { cities: ['سبها'] },
      'البيضاء': { cities: ['البيضاء'] },
      'طبرق': { cities: ['طبرق'] },
      'درنة': { cities: ['درنة'] },
      'سرت': { cities: ['سرت'] },
      'المرج': { cities: ['المرج'] },
      'زوارة': { cities: ['زوارة'] },
      'غريان': { cities: ['غريان'] },
      'الكفرة': { cities: ['الكفرة'] },
    }
  },
  'السودان': {
    states: {
      'الخرطوم': { cities: ['الخرطوم', 'أم درمان', 'بحري'] },
      'شمال كردفان': { cities: ['الأبيض'] },
      'غرب دارفور': { cities: ['الجنينة'] },
      'كسلا': { cities: ['كسلا'] },
      'بورتسودان': { cities: ['بورتسودان'] },
      'ود مدني': { cities: ['ود مدني'] },
      'نهر النيل': { cities: ['الدامر', 'عطبرة'] },
      'سنار': { cities: ['سنار'] },
    }
  },
  'عمان': {
    states: {
      'مسقط': { cities: ['مسقط', 'مطرح', 'العامرات'] },
      'صلالة': { cities: ['صلالة'] },
      'نزوى': { cities: ['نزوى'] },
      'صحار': { cities: ['صحار'] },
      'البريمي': { cities: ['البريمي'] },
      'صور': { cities: ['صور'] },
      'إبراء': { cities: ['إبراء'] },
    }
  },
  'الإمارات': {
    states: {
      'أبوظبي': { cities: ['أبوظبي', 'العين', 'الظفرة'] },
      'دبي': { cities: ['دبي'] },
      'الشارقة': { cities: ['الشارقة'] },
      'عجمان': { cities: ['عجمان'] },
      'رأس الخيمة': { cities: ['رأس الخيمة'] },
      'الفجيرة': { cities: ['الفجيرة'] },
      'أم القيوين': { cities: ['أم القيوين'] },
    }
  },
  'الكويت': {
    states: {
      'العاصمة': { cities: ['الكويت'] },
      'حولي': { cities: ['حولي', 'السالمية'] },
      'الفروانية': { cities: ['الفروانية'] },
      'الأحمدي': { cities: ['الأحمدي', 'المنقف'] },
      'الجهراء': { cities: ['الجهراء'] },
      'مبارك الكبير': { cities: ['مبارك الكبير'] },
    }
  },
  'قطر': {
    states: {
      'الدوحة': { cities: ['الدوحة'] },
      'الريان': { cities: ['الريان'] },
      'الخور': { cities: ['الخور'] },
      'الوكرة': { cities: ['الوكرة'] },
      'الشمال': { cities: ['الشمال'] },
      'أم صلال': { cities: ['أم صلال'] },
    }
  },
  'البحرين': {
    states: {
      'المنامة': { cities: ['المنامة'] },
      'المحرق': { cities: ['المحرق'] },
      'الرفاع': { cities: ['الرفاع'] },
      'عيسى': { cities: ['مدينة عيسى'] },
      'سترة': { cities: ['سترة'] },
    }
  },
  'موريتانيا': {
    states: {
      'نواكشوط': { cities: ['نواكشوط'] },
      'نواذيبو': { cities: ['نواذيبو'] },
      'كيهيدي': { cities: ['كيهيدي'] },
      'الزويرات': { cities: ['الزويرات'] },
    }
  },
  'الصومال': {
    states: {
      'مقديشو': { cities: ['مقديشو'] },
      'هرجيسا': { cities: ['هرجيسا'] },
      'كيسمايو': { cities: ['كيسمايو'] },
      'بوصاصو': { cities: ['بوصاصو'] },
    }
  },
  'جيبوتي': {
    states: {
      'جيبوتي': { cities: ['جيبوتي'] },
    }
  },
  'جزر القمر': {
    states: {
      'موروني': { cities: ['موروني'] },
    }
  },
};

export default function LocationPicker({ onChange }) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const countries = Object.keys(locationData).sort();
  const states = selectedCountry ? Object.keys(locationData[selectedCountry].states) : [];
  const cities = selectedCountry && selectedState ? locationData[selectedCountry].states[selectedState].cities : [];

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setSelectedRegion('');
    emitChange(country, '', '', '');
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity('');
    setSelectedRegion('');
    emitChange(selectedCountry, state, '', '');
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    emitChange(selectedCountry, selectedState, city, selectedRegion);
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    emitChange(selectedCountry, selectedState, selectedCity, region);
  };

  const emitChange = (country, state, city, region) => {
    onChange({ country, state, city, region });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1">البلد</label>
        <select value={selectedCountry} onChange={(e) => handleCountryChange(e.target.value)} required className="input-field !py-2 !text-sm">
          <option value="">اختر البلد</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1">المحافظة</label>
        <select value={selectedState} onChange={(e) => handleStateChange(e.target.value)} disabled={!selectedCountry} className="input-field !py-2 !text-sm">
          <option value="">اختر المحافظة</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1">المدينة</label>
        <select value={selectedCity} onChange={(e) => handleCityChange(e.target.value)} disabled={!selectedState} className="input-field !py-2 !text-sm">
          <option value="">اختر المدينة</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-500 mb-1">المنطقة (اختياري)</label>
        <input
          type="text"
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          placeholder="الحي / القرية"
          className="input-field !py-2 !text-sm"
        />
      </div>
    </div>
  );
}