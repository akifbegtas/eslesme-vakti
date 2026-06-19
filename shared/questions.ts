import type { Question, Tense, Option } from './types';

// Sorular kompakt biçimde tanımlanır; id'ler aşağıda otomatik üretilir.
// Tüm içerik +18 DEĞİLDİR; geçmiş / şimdi / gelecek odaklıdır.
// Mantık "eşleşme": iki partner aynı şıkkı seçerse doğru sayılır.

type RawOption = [label: string, icon: string];
interface RawQuestion {
  tense: Tense;
  text: string;
  options: RawOption[]; // 2–4 şık
}

const RAW: RawQuestion[] = [
  // ---------------------- GEÇMİŞ ----------------------
  { tense: 'past', text: 'İlk buluşmanız nerede oldu?', options: [['Kafe', '☕'], ['Restoran', '🍽️'], ['Sinema', '🎬'], ['Açık hava', '🌳']] },
  { tense: 'past', text: 'İlişkide ilk adımı kim attı?', options: [['Ben', '🙋'], ['O', '🫵']] },
  { tense: 'past', text: 'Şu ana kadar sana kaç çiçek/gül aldı?', options: [['1–5 arası', '🌹'], ['6 ve üzeri', '💐']] },
  { tense: 'past', text: 'İlk "seni seviyorum"u kim söyledi?', options: [['Ben', '💬'], ['O', '🗣️']] },
  { tense: 'past', text: 'Hangi mevsimde tanıştınız?', options: [['İlkbahar', '🌸'], ['Yaz', '☀️'], ['Sonbahar', '🍂'], ['Kış', '❄️']] },
  { tense: 'past', text: 'İlk hediyesi neydi?', options: [['Takı', '💍'], ['Çiçek', '🌷'], ['Kitap', '📖'], ['Sürpriz', '🎁']] },
  { tense: 'past', text: 'Nasıl tanıştınız?', options: [['Arkadaş ortamı', '👥'], ['Online', '📱'], ['İş/okul', '🏫'], ['Tesadüf', '🍀']] },
  { tense: 'past', text: 'İlk öpücük nerede gerçekleşti?', options: [['Evde', '🏠'], ['Dışarıda', '🌆'], ['Arabada', '🚗']] },
  { tense: 'past', text: 'İlk birlikte gittiğiniz yer nasıldı?', options: [['Deniz kenarı', '🏖️'], ['Büyük şehir', '🏙️'], ['Doğa', '🏞️']] },
  { tense: 'past', text: 'İlk tartışmanızın sebebi neydi?', options: [['Kıskançlık', '😤'], ['İletişim', '🗯️'], ['Saçma bir şey', '🤪']] },
  { tense: 'past', text: 'İlk ortak fotoğrafınızı kim çekti?', options: [['Ben', '📸'], ['O', '🤳'], ['Başkası', '🙆']] },
  { tense: 'past', text: 'İlk kez kimin ailesiyle tanıştınız?', options: [['Onunki', '👨‍👩‍👧'], ['Benimki', '👪']] },
  { tense: 'past', text: 'Tanıştığınızda ilk dikkatini çeken neydi?', options: [['Gülüşü', '😄'], ['Gözleri', '👀'], ['Sesi', '🎙️'], ['Tarzı', '🧥']] },
  { tense: 'past', text: 'İlk randevuya kim geç kaldı?', options: [['Ben', '⏰'], ['O', '🕒'], ['İkimiz de zamanındaydık', '✅']] },
  { tense: 'past', text: 'İlk mesajı kim attı?', options: [['Ben', '📩'], ['O', '💌']] },
  { tense: 'past', text: 'İlk yıldönümünüzü nasıl kutladınız?', options: [['Yemek', '🍝'], ['Gezi', '✈️'], ['Evde', '🏡'], ['Sürpriz', '🎉']] },
  { tense: 'past', text: 'İlk birlikte izlediğiniz filmin türü?', options: [['Romantik', '💕'], ['Aksiyon', '💥'], ['Komedi', '😂'], ['Korku', '👻']] },
  { tense: 'past', text: 'İlk birlikte yaptığınız yemek neydi?', options: [['Makarna', '🍝'], ['Kahvaltı', '🍳'], ['Tatlı', '🍰']] },
  { tense: 'past', text: 'İlk tatiliniz nasıl gelişti?', options: [['Plan dahilinde', '🗺️'], ['Tamamen spontane', '🎲']] },
  { tense: 'past', text: 'Birbirinize taktığınız ilk lakap tarzı?', options: [['Tatlı', '🍯'], ['Komik', '😜'], ['Klasik (aşkım)', '❤️']] },
  { tense: 'past', text: 'İlk hediyesini hâlâ saklıyor musun?', options: [['Evet', '📦'], ['Hayır', '🤷']] },
  { tense: 'past', text: 'İlişkinin başında birlikte dans ettiniz mi?', options: [['Evet', '💃'], ['Hayır', '🙅']] },
  { tense: 'past', text: 'Birlikte ilk aldığınız şey neydi?', options: [['Bitki', '🪴'], ['Ev eşyası', '🛋️'], ['Yemek', '🛒']] },
  { tense: 'past', text: 'İlk ortak selfie\'de kim poz verdi?', options: [['Ben', '🤩'], ['O', '😎']] },
  { tense: 'past', text: 'İlk "günaydın" mesajını kim attı?', options: [['Ben', '🌅'], ['O', '☀️']] },
  { tense: 'past', text: 'İlişkinin başında daha çok kim arardı?', options: [['Ben', '📞'], ['O', '☎️']] },
  { tense: 'past', text: 'İlk küslüğünüzde kim barıştırdı?', options: [['Ben', '🤝'], ['O', '🫂']] },
  { tense: 'past', text: 'İlk ortak şarkınız oldu mu?', options: [['Evet', '🎵'], ['Hayır', '🚫']] },
  { tense: 'past', text: 'Çıkmadan önce ne kadar arkadaştınız?', options: [['Kısa süre', '⏳'], ['Uzun süre', '📅'], ['Hemen başladık', '⚡']] },
  { tense: 'past', text: 'İlk buluşmada heyecandan ne yaptın?', options: [['Çok konuştum', '🗣️'], ['Sustum', '🤐'], ['Gayet normaldim', '😌']] },
  { tense: 'past', text: 'İlk kez kim "çıkalım mı" dedi?', options: [['Ben', '💕'], ['O', '💘']] },
  { tense: 'past', text: 'İlk birlikte kutladığınız özel gün?', options: [['Doğum günü', '🎂'], ['Sevgililer Günü', '💝'], ['Yılbaşı', '🎄']] },
  { tense: 'past', text: 'İlk konser/etkinliğe birlikte gittiniz mi?', options: [['Evet', '🎤'], ['Hayır', '❌']] },
  { tense: 'past', text: 'Tanışınca telefon numarasını kim istedi?', options: [['Ben', '📱'], ['O', '📲']] },
  { tense: 'past', text: 'İlk fotoğrafınız nerede çekildi?', options: [['Dışarıda', '🌳'], ['Evde', '🛋️'], ['Bir etkinlikte', '🎉']] },
  { tense: 'past', text: 'İlk buluşmada hesabı kim ödedi?', options: [['Ben', '🧾'], ['O', '💳'], ['Paylaştık', '🤝']] },
  { tense: 'past', text: 'İlk izlenimde "bu iş olur" dedin mi?', options: [['Evet', '✅'], ['Emin değildim', '🤔'], ['Sonradan anladım', '🔁']] },
  { tense: 'past', text: 'İlk kez kim sürpriz yaptı?', options: [['Ben', '🎁'], ['O', '🎊']] },

  // ---------------------- ŞİMDİ ----------------------
  { tense: 'present', text: 'Tatil deyince akla ne gelir?', options: [['Deniz', '🏖️'], ['Dağ', '⛰️'], ['Şehir', '🏙️']] },
  { tense: 'present', text: 'İkiniz de hangisisiniz?', options: [['Sabah insanı', '🌅'], ['Gece insanı', '🌙']] },
  { tense: 'present', text: 'İdeal hafta sonu planı?', options: [['Dışarı çıkmak', '🌆'], ['Evde dinlenmek', '🏠']] },
  { tense: 'present', text: 'Daha çok kim üşür?', options: [['Ben', '🥶'], ['O', '🧊']] },
  { tense: 'present', text: 'Sabah içeceği?', options: [['Kahve', '☕'], ['Çay', '🫖']] },
  { tense: 'present', text: 'Damak tadı?', options: [['Tatlı', '🍰'], ['Tuzlu', '🥨']] },
  { tense: 'present', text: 'Köpek mi kedi mi?', options: [['Köpek', '🐶'], ['Kedi', '🐱']] },
  { tense: 'present', text: 'Evde daha düzenli olan?', options: [['Ben', '🧹'], ['O', '🧺']] },
  { tense: 'present', text: 'Hangisi daha çok mutlu eder?', options: [['Romantik jest', '💞'], ['Sürpriz hediye', '🎁']] },
  { tense: 'present', text: 'Daha çok kim geç uyur?', options: [['Ben', '🌃'], ['O', '🦉']] },
  { tense: 'present', text: 'Akşam keyfi?', options: [['Film', '🎬'], ['Dizi', '📺']] },
  { tense: 'present', text: 'Daha çok kim fotoğraf çeker?', options: [['Ben', '📸'], ['O', '🤳']] },
  { tense: 'present', text: 'Tartışma sonrası önce kim barışır?', options: [['Ben', '🤝'], ['O', '🫂']] },
  { tense: 'present', text: 'Parayı daha dikkatli harcayan?', options: [['Ben', '💰'], ['O', '🪙'], ['İkimiz de rahatız', '🤲']] },
  { tense: 'present', text: 'Mutfakta kim daha iyi?', options: [['Ben', '👨‍🍳'], ['O', '👩‍🍳']] },
  { tense: 'present', text: 'Daha çok kim güler?', options: [['Ben', '😂'], ['O', '🤭']] },
  { tense: 'present', text: 'Pizza tercihi?', options: [['Klasik', '🍕'], ['Bol malzeme', '🧀'], ['Sade', '🫓']] },
  { tense: 'present', text: 'Daha çok kim kıskanır?', options: [['Ben', '😤'], ['O', '🙄']] },
  { tense: 'present', text: 'Sabah ilk iş?', options: [['Telefona bakmak', '📱'], ['Kahve', '☕'], ['Sarılmak', '🤗']] },
  { tense: 'present', text: 'Gün içinde daha çok kim mesaj atar?', options: [['Ben', '💬'], ['O', '📩']] },
  { tense: 'present', text: 'Ev sıcaklığı tercihi?', options: [['Sıcak sever', '🔥'], ['Serin sever', '❄️']] },
  { tense: 'present', text: 'Daha çok kim plan yapar?', options: [['Ben', '🗓️'], ['O', '🎲']] },
  { tense: 'present', text: 'Ortak müzik zevki?', options: [['Pop', '🎤'], ['Rock', '🎸'], ['Türkçe', '🎶'], ['Karışık', '🎧']] },
  { tense: 'present', text: 'Daha çok kim alışveriş yapar?', options: [['Ben', '🛍️'], ['O', '🛒']] },
  { tense: 'present', text: 'İdeal akşam?', options: [['Dışarıda yemek', '🍽️'], ['Evde film', '🍿']] },
  { tense: 'present', text: 'Daha çok kim "acıktım" der?', options: [['Ben', '🍽️'], ['O', '😋']] },
  { tense: 'present', text: 'Telefonda daha çok kim oyalanır?', options: [['Ben', '📱'], ['O', '🕹️']] },
  { tense: 'present', text: 'Tartışmada daha inatçı olan?', options: [['Ben', '🪨'], ['O', '🐂']] },
  { tense: 'present', text: 'Daha çok kim "seni seviyorum" der?', options: [['Ben', '❤️'], ['O', '💗'], ['Eşit', '⚖️']] },
  { tense: 'present', text: 'Yağmurlu hava?', options: [['Severim', '🌧️'], ['Sevmem', '☔']] },
  { tense: 'present', text: 'Daha çok kim sarılmak ister?', options: [['Ben', '🤗'], ['O', '🫂']] },
  { tense: 'present', text: 'En sevdiğiniz ortak aktivite?', options: [['Yürüyüş', '🚶'], ['Yemek', '🍴'], ['Film', '🎥'], ['Oyun', '🎮']] },
  { tense: 'present', text: 'Daha çok kim espri yapar?', options: [['Ben', '🤡'], ['O', '😜']] },
  { tense: 'present', text: 'Hangisini seversin?', options: [['Sürpriz', '🎉'], ['Planlı', '📋']] },
  { tense: 'present', text: 'Daha unutkan olan?', options: [['Ben', '🤔'], ['O', '🙃']] },
  { tense: 'present', text: 'İçecek tercihi?', options: [['Soğuk', '🧊'], ['Sıcak', '♨️']] },
  { tense: 'present', text: 'Alarmı daha çok kim erteler?', options: [['Ben', '😴'], ['O', '⏰']] },
  { tense: 'present', text: 'En sevdiğiniz mevsim?', options: [['Yaz', '☀️'], ['Kış', '❄️'], ['İlkbahar', '🌸'], ['Sonbahar', '🍂']] },

  // ---------------------- GELECEK ----------------------
  { tense: 'future', text: 'Hayalinizdeki düğün tarzı?', options: [['Kır düğünü', '🌾'], ['Deniz manzaralı', '🌊'], ['Salon', '🏛️']] },
  { tense: 'future', text: 'İlk ortak ev nerede olsun?', options: [['Şehirde', '🏙️'], ['Doğada/köyde', '🌲'], ['Sahilde', '🏖️']] },
  { tense: 'future', text: 'Kaç çocuk hayali?', options: [['Yok', '🚫'], ['1', '👶'], ['2', '👧👦'], ['3+', '👨‍👩‍👧‍👦']] },
  { tense: 'future', text: 'Balayı nerede olsun?', options: [['Tropik ada', '🏝️'], ['Avrupa turu', '🗼'], ['Doğa kampı', '🏕️']] },
  { tense: 'future', text: 'Gelecekte evcil hayvan?', options: [['Köpek', '🐕'], ['Kedi', '🐈'], ['İkisi de', '🐾'], ['Yok', '🙅']] },
  { tense: 'future', text: 'Hayalinizdeki ortak araba?', options: [['Klasik', '🚗'], ['SUV', '🚙'], ['Elektrikli', '⚡']] },
  { tense: 'future', text: 'Birlikte ne öğrenmek isterdiniz?', options: [['Dans', '💃'], ['Yeni dil', '🗣️'], ['Yemek', '👩‍🍳'], ['Enstrüman', '🎸']] },
  { tense: 'future', text: 'Emeklilik hayali?', options: [['Sahil kasabası', '🏖️'], ['Dağ evi', '🏔️'], ['Gezgin yaşam', '✈️']] },
  { tense: 'future', text: 'Birlikte gidilecek ilk ülke?', options: [['İtalya', '🇮🇹'], ['Japonya', '🇯🇵'], ['Yunanistan', '🇬🇷'], ['Fransa', '🇫🇷']] },
  { tense: 'future', text: 'Düğünde ilk dans?', options: [['Mutlaka olmalı', '💃'], ['Eğlence yeter', '🎉']] },
  { tense: 'future', text: 'Ev dekorasyon tarzı?', options: [['Modern', '🛋️'], ['Sıcak/rustik', '🪵'], ['Minimalist', '◻️']] },
  { tense: 'future', text: 'Hafta sonu kaçamağı?', options: [['Şehir dışı', '🚗'], ['Evde tatil', '🏡']] },
  { tense: 'future', text: 'Birlikte yapılacak macera?', options: [['Dalış', '🤿'], ['Yamaç paraşütü', '🪂'], ['Safari', '🦁'], ['Trekking', '🥾']] },
  { tense: 'future', text: 'Gelecekte birlikte iş kurar mıydınız?', options: [['Evet', '🤝'], ['Hayır', '🙅'], ['Belki', '🤷']] },
  { tense: 'future', text: 'Çocuğa isim tarzı?', options: [['Geleneksel', '📜'], ['Modern', '✨'], ['Anlamlı', '💫']] },
  { tense: 'future', text: 'Birlikte alınacak büyük hayal?', options: [['Ev', '🏠'], ['Dünya turu', '🌍'], ['Araba', '🚗']] },
  { tense: 'future', text: 'Yıldönümü kutlama tarzı?', options: [['Her yıl tatil', '✈️'], ['Romantik yemek', '🕯️'], ['Sürpriz', '🎁']] },
  { tense: 'future', text: 'Birlikte yaşlanınca ev?', options: [['Bahçeli ev', '🌷'], ['Şehir merkezi', '🏙️']] },
  { tense: 'future', text: 'Gelecek önceliği?', options: [['Hemen yuva', '🏠'], ['Önce kariyer', '💼'], ['Önce gezmek', '🌍']] },
  { tense: 'future', text: 'Hayalinizdeki tatil sıklığı?', options: [['Yılda 1 büyük tatil', '🌍'], ['Sık kısa kaçamak', '🚙']] },
  { tense: 'future', text: 'Düğün mevsimi?', options: [['Yaz', '☀️'], ['Sonbahar', '🍂'], ['İlkbahar', '🌸']] },
  { tense: 'future', text: 'Evde olmazsa olmaz?', options: [['Büyük mutfak', '🍳'], ['Geniş salon', '🛋️'], ['Bahçe', '🌳'], ['Çalışma odası', '💻']] },
  { tense: 'future', text: 'Birlikte koleksiyon?', options: [['Magnet', '🧲'], ['Fotoğraf', '📷'], ['Biletler', '🎟️']] },
  { tense: 'future', text: 'Gelecekte taşınmak?', options: [['Yurt dışı', '🌐'], ['Aynı şehir', '📍'], ['Daha sakin bir yer', '🌄']] },
  { tense: 'future', text: 'Ortak yaşam hedefi?', options: [['Sağlıklı yaşam', '🥗'], ['Maddi özgürlük', '💰'], ['Bol seyahat', '🧳']] },
  { tense: 'future', text: 'Birlikte yapılacak spor?', options: [['Yürüyüş', '🚶'], ['Yoga', '🧘'], ['Fitness', '🏋️'], ['Yüzme', '🏊']] },
  { tense: 'future', text: 'Düğün davetli sayısı?', options: [['Küçük & samimi', '👨‍👩‍👧'], ['Kalabalık', '🎊']] },
  { tense: 'future', text: 'Evde bitki bahçesi olsun mu?', options: [['Evet', '🪴'], ['Hayır', '🚫']] },
  { tense: 'future', text: 'Birlikte öğrenilecek mutfak?', options: [['İtalyan', '🍝'], ['Uzak Doğu', '🍜'], ['Tatlılar', '🧁']] },
  { tense: 'future', text: 'Hayalinizdeki yatak odası tonu?', options: [['Pastel', '🌸'], ['Koyu/şık', '🖤'], ['Doğal tonlar', '🤍']] },
  { tense: 'future', text: 'Gelecekte ortak gelenek?', options: [['Cuma film gecesi', '🎬'], ['Pazar kahvaltısı', '🍳'], ['Aylık gezi', '🗺️']] },
  { tense: 'future', text: 'İlk büyük başarıyı nasıl kutlarsınız?', options: [['Ev alımı', '🏠'], ['Terfi', '📈'], ['Seyahat', '🌍']] },
  { tense: 'future', text: 'Yaşlanınca ortak hobi?', options: [['Bahçıvanlık', '🌻'], ['Seyahat', '✈️'], ['El işi', '🧶']] },
  { tense: 'future', text: 'Sürpriz partiyi kim daha çok sever?', options: [['Ben', '🎉'], ['O', '🎈'], ['İkimiz de', '🥳']] },
];

function pad(n: number): string {
  return String(n).padStart(3, '0');
}

export const QUESTIONS: Question[] = RAW.map((q, i): Question => {
  const qid = `q${pad(i + 1)}`;
  const options: Option[] = q.options.map((o, j) => ({
    id: `${qid}-${j}`,
    label: o[0],
    icon: o[1],
  }));
  return { id: qid, tense: q.tense, text: q.text, options };
});

/** Fisher–Yates ile karıştırılmış soru kimliği listesi döndürür. */
export function shuffledQuestionIds(): string[] {
  const ids = QUESTIONS.map((q) => q.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));
export function getQuestion(id: string): Question | undefined {
  return BY_ID.get(id);
}
