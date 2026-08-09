import { PackageItem, StudioProfile, Invoice } from '../types';

export const DEFAULT_STUDIO_PROFILE: StudioProfile = {
  name: 'វិក្កយបត្រ Digital Pro',
  khmerName: 'វិក្កយបត្រ Digital Pro',
  tagline: 'ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រ Digital Pro សម្រាប់ជាងថតរូប',
  phone: '012 345 678',
  secondaryPhone: '098 765 432',
  telegramUsername: 'digitalprostudio',
  address: 'រាជធានីភ្នំពេញ, ប្រទេសកម្ពុជា',
  email: 'digitalpro@gmail.com',
  facebookPage: 'វិក្កយបត្រ Digital Pro',
  logoUrl: '/digital_pro_logo.svg', // Permanent default system & studio logo
  khqrImageUrl: '', // Users can upload their Bakong KHQR
  bankAccountName: 'LAY MEAN',
  bankAccountNumber: '000 123 456',
  bankName: 'ABA Bank',
  exchangeRateKHR: 4100,
  termsAndConditions: [
    'ប្រាក់កក់មិនអាចដកវិញបានទេ ក្នុងករណីលុបចោលកម្មវិធីដោយឯកតោភាគី។',
    'សូមទូទាត់ប្រាក់នៅសល់ ៥០% ថ្ងៃថត និងប្រាក់នៅសល់ទាំងអស់ពេលទទួលរូបថតចុងក្រោយ។',
    'ការផ្លាស់ប្តូរថ្ងៃថតត្រូវជូនដំណឹងយ៉ាងតិច ១៤ ថ្ងៃមុនកាលបរិច្ឆេទថត។'
  ]
};

export const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-pw-std',
    nameKhmer: 'កញ្ចប់ Pre-wedding Standard',
    nameEnglish: 'Pre-wedding Standard Package',
    category: 'pre_wedding',
    price: 450,
    description: 'កញ្ចប់ថត Pre-wedding កម្រិតស្តង់ដារ សម្រាប់គូស្នេហ៍',
    includedItems: [
      'ថតរូប Pre-wedding ពេញ ១ថ្ងៃ (ក្នុងក្រុង ឬស្ទូឌីយោ)',
      'សម្លៀកបំពាក់ ២ឈុត (បុរាណ ១, សកល ១)',
      'រៀបចំក្បាល និងមេកអាប់ ២ឈុត',
      'ផ្តល់ជូនរូបថតទំហំ 60x90cm ចំនួន ១ផ្ទាំង (ប៉ាណូ)',
      'រូបថតទំហំ 13x18cm ចំនួន ៣០សន្លឹក',
      'ផ្តល់ជូនសាច់រូបដើម (Soft Copy) ទាំងអស់'
    ],
    recommendedCount: 'អាវ ២ឈុត, ប៉ាណូ ១, រូបថត ៣០សន្លឹក'
  },
  {
    id: 'pkg-pw-vip',
    nameKhmer: 'កញ្ចប់ Pre-wedding VIP High-End',
    nameEnglish: 'Pre-wedding VIP Package',
    category: 'pre_wedding',
    price: 950,
    description: 'កញ្ចប់ថត Pre-wedding VIP កម្រិតជាន់ខ្ពស់ ជាមួយអាល់ប៊ុម VIP',
    includedItems: [
      'ថតរូប Pre-wedding ពេញ ២ថ្ងៃ (ខេត្ត ឬរមណីយដ្ឋាន)',
      'សម្លៀកបំពាក់ ៤ឈុត (បុរាណ ២, សកល ២)',
      'រៀបចំក្បាល និងមេកអាប់ ៤ឈុត ជាមួយជាងជំនាញ',
      'អាល់ប៊ុម VIP 30x40cm ចំនួន ១ក្បាល (២០ទំព័រ)',
      'រូបថតទំហំ 70x110cm ជាមួយស៊ុមឈើ VIP ចំនួន ២ផ្ទាំង (ប៉ាណូ)',
      'វីដេអូ Highlight Cinematic Pre-wedding 4K',
      'ផ្តល់ជូនសាច់រូបដើម (Soft Copy) ទាំងអស់'
    ],
    recommendedCount: 'អាវ ៤ឈុត, អាល់ប៊ុម ១, ប៉ាណូ ២, វីដេអូ 4K'
  },
  {
    id: 'pkg-wd-std',
    nameKhmer: 'កញ្ចប់ ថ្ងៃមង្គលការ Standard (ថតរូប)',
    nameEnglish: 'Wedding Day Photo Standard',
    category: 'wedding_day',
    price: 650,
    description: 'សេវាកម្មថតរូបថ្ងៃមង្គលការពេញមួយថ្ងៃ (ពិធីសំពះផ្ទឹម និងពិធីលៀងសាយភោជន៍)',
    includedItems: [
      'ជាងថតរូប ២នាក់ (Photo Crew 2 Cameras)',
      'ថតរូបពិធីព្រឹក និងពិធីល្ងាចពេញលេញ',
      'ភ្លើងជំនួយក្នុងពិធី និង Flash System',
      'ផ្តល់ជូនរូបថតទំហំ 13x18cm ចំនួន ១០០សន្លឹក ក្នុងអាល់ប៊ុម',
      'ផ្តល់ជូនសាច់រូប Edit ស្អាត និងសាច់រូបដើមទាំងអស់'
    ],
    recommendedCount: 'ជាងថតរូប ២នាក់, រូបថត ១០០សន្លឹក'
  },
  {
    id: 'pkg-wd-vip',
    nameKhmer: 'កញ្ចប់ ថ្ងៃមង្គលការ VIP (រូបថត + វីដេអូ Highlight 4K)',
    nameEnglish: 'Wedding Day Full Photo & Video VIP',
    category: 'wedding_day',
    price: 1550,
    description: 'សេវាកម្មថតរូប និងថតវីដេអូថ្ងៃមង្គលការពេញលេញកម្រិត VIP ជាមួយ Drone',
    includedItems: [
      'ជាងថតរូប ២នាក់ (Senior Photographers)',
      'ជាងថតវីដេអូ ២នាក់ + ថត Drone Aerial View 4K',
      'ថតពិធីសំពះផ្ទឹមព្រឹក និងពិធីលៀងសាយភោជន៍ល្ងាច',
      'វីដេអូ Highlight 3-5 នាទី + វីដេអូពេញកម្មវិធី',
      'អាល់ប៊ុមរូបថតមង្គលការ VIP 30x40cm',
      'ស៊ុមរូបថត 60x90cm ចំនួន ១ផ្ទាំង',
      'Flash Drive / Cloud Drive រូបថត និងវីដេអូទាំងអស់'
    ],
    recommendedCount: 'ក្រុមការងារ ៤នាក់ + Drone, អាល់ប៊ុម VIP, វីដេអូ 4K'
  },
  {
    id: 'pkg-combo-grand',
    nameKhmer: 'កញ្ចប់ Combo ពេញលេញ (Pre-wedding + ថ្ងៃមង្គលការ)',
    nameEnglish: 'Grand Combo Package (Pre-wedding + Wedding Day)',
    category: 'combo',
    price: 2200,
    description: 'កញ្ចប់ពិសេសបំផុតប្រូម៉ូសិន ថត Pre-wedding និង ថ្ងៃការពេញលេញ',
    includedItems: [
      'កញ្ចប់ថត Pre-wedding VIP (អាវ ៤ឈុត + អាល់ប៊ុម + ប៉ាណូ ២)',
      'កញ្ចប់ថតរូប និងវីដេអូថ្ងៃការពេញលេញ VIP (ក្រុមការងារ ៤នាក់ + Drone)',
      'វីដេអូបង្ហាញក្នុងពិធីមង្គលការ (Wedding Opening Video)',
      'បញ្ចុះតម្លៃពិសេស $300 និងថែមជូនរូបថតស៊ុមតូច ៥ផ្ទាំង'
    ],
    recommendedCount: 'ថតរៀបអាពាហ៍ពិពាហ៍ពេញលេញ'
  }
];

export const INITIAL_INVOICES: Invoice[] = [];
