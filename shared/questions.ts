import type { Question, Tense, Option } from './types';

// Sorular kompakt biçimde tanımlanır; id'ler aşağıda otomatik üretilir.
// Her şık: [etiket, emoji (yedek), foto anahtar kelimesi (tek güçlü İngilizce sözcük)].
// Anahtar kelime LoremFlickr'da gerçek stok foto araması için kullanılır.
// Tüm içerik +18 DEĞİLDİR; geçmiş / şimdi / gelecek odaklıdır.

type RawOption = [label: string, icon: string, kw: string];
interface RawQuestion {
  tense: Tense;
  text: string;
  options: RawOption[]; // 2–4 şık
}

// Bakış açılı ("kim?") şıklarda kişi fotoğrafı
const SELF = 'selfie';
const OTHER = 'selfie';

const RAW: RawQuestion[] = [
  // ---------------------- GEÇMİŞ ----------------------
  { tense: 'past', text: 'İlk buluşmanız nerede oldu?', options: [['Kafe', '☕', 'cafe'], ['Restoran', '🍽️', 'restaurant'], ['Sinema', '🎬', 'cinema'], ['Açık hava', '🌳', 'park']] },
  { tense: 'past', text: 'İlişkide ilk adımı kim attı?', options: [['Ben', '🙋', SELF], ['O', '🫵', OTHER]] },
  { tense: 'past', text: 'Şu ana kadar sana kaç çiçek/gül aldı?', options: [['1–5 arası', '🌹', 'rose'], ['6 ve üzeri', '💐', 'bouquet']] },
  { tense: 'past', text: 'İlk "seni seviyorum"u kim söyledi?', options: [['Ben', '💬', SELF], ['O', '🗣️', OTHER]] },
  { tense: 'past', text: 'Hangi mevsimde tanıştınız?', options: [['İlkbahar', '🌸', 'blossom'], ['Yaz', '☀️', 'beach'], ['Sonbahar', '🍂', 'autumn'], ['Kış', '❄️', 'snow']] },
  { tense: 'past', text: 'İlk hediyesi neydi?', options: [['Takı', '💍', 'jewelry'], ['Çiçek', '🌷', 'flowers'], ['Kitap', '📖', 'books'], ['Sürpriz', '🎁', 'gift']] },
  { tense: 'past', text: 'Nasıl tanıştınız?', options: [['Arkadaş ortamı', '👥', 'friends'], ['Online', '📱', 'smartphone'], ['İş/okul', '🏫', 'campus'], ['Tesadüf', '🍀', 'street']] },
  { tense: 'past', text: 'İlk öpücük nerede gerçekleşti?', options: [['Evde', '🏠', 'home'], ['Dışarıda', '🌆', 'city'], ['Arabada', '🚗', 'car']] },
  { tense: 'past', text: 'İlk birlikte gittiğiniz yer nasıldı?', options: [['Deniz kenarı', '🏖️', 'beach'], ['Büyük şehir', '🏙️', 'skyline'], ['Doğa', '🏞️', 'nature']] },
  { tense: 'past', text: 'İlk tartışmanızın sebebi neydi?', options: [['Kıskançlık', '😤', 'argument'], ['İletişim', '🗯️', 'talking'], ['Saçma bir şey', '🤪', 'laughing']] },
  { tense: 'past', text: 'İlk ortak fotoğrafınızı kim çekti?', options: [['Ben', '📸', 'selfie'], ['O', '🤳', 'camera'], ['Başkası', '🙆', 'photographer']] },
  { tense: 'past', text: 'İlk kez kimin ailesiyle tanıştınız?', options: [['Onunki', '👨‍👩‍👧', 'family'], ['Benimki', '👪', 'family']] },
  { tense: 'past', text: 'Tanıştığınızda ilk dikkatini çeken neydi?', options: [['Gülüşü', '😄', 'smile'], ['Gözleri', '👀', 'eyes'], ['Sesi', '🎙️', 'microphone'], ['Tarzı', '🧥', 'fashion']] },
  { tense: 'past', text: 'İlk randevuya kim geç kaldı?', options: [['Ben', '⏰', 'watch'], ['O', '🕒', 'clock'], ['İkimiz de zamanındaydık', '✅', 'couple']] },
  { tense: 'past', text: 'İlk mesajı kim attı?', options: [['Ben', '📩', 'texting'], ['O', '💌', 'smartphone']] },
  { tense: 'past', text: 'İlk yıldönümünüzü nasıl kutladınız?', options: [['Yemek', '🍝', 'dinner'], ['Gezi', '✈️', 'travel'], ['Evde', '🏡', 'home'], ['Sürpriz', '🎉', 'party']] },
  { tense: 'past', text: 'İlk birlikte izlediğiniz filmin türü?', options: [['Romantik', '💕', 'romance'], ['Aksiyon', '💥', 'action'], ['Komedi', '😂', 'comedy'], ['Korku', '👻', 'horror']] },
  { tense: 'past', text: 'İlk birlikte yaptığınız yemek neydi?', options: [['Makarna', '🍝', 'pasta'], ['Kahvaltı', '🍳', 'breakfast'], ['Tatlı', '🍰', 'cake']] },
  { tense: 'past', text: 'İlk tatiliniz nasıl gelişti?', options: [['Plan dahilinde', '🗺️', 'map'], ['Tamamen spontane', '🎲', 'roadtrip']] },
  { tense: 'past', text: 'Birbirinize taktığınız ilk lakap tarzı?', options: [['Tatlı', '🍯', 'honey'], ['Komik', '😜', 'clown'], ['Klasik (aşkım)', '❤️', 'heart']] },
  { tense: 'past', text: 'İlk hediyesini hâlâ saklıyor musun?', options: [['Evet', '📦', 'giftbox'], ['Hayır', '🤷', 'shrug']] },
  { tense: 'past', text: 'İlişkinin başında birlikte dans ettiniz mi?', options: [['Evet', '💃', 'dancing'], ['Hayır', '🙅', 'sitting']] },
  { tense: 'past', text: 'Birlikte ilk aldığınız şey neydi?', options: [['Bitki', '🪴', 'plant'], ['Ev eşyası', '🛋️', 'sofa'], ['Yemek', '🛒', 'groceries']] },
  { tense: 'past', text: 'İlk ortak selfie\'de kim poz verdi?', options: [['Ben', '🤩', 'selfie'], ['O', '😎', 'selfie']] },
  { tense: 'past', text: 'İlk "günaydın" mesajını kim attı?', options: [['Ben', '🌅', 'sunrise'], ['O', '☀️', 'coffee']] },
  { tense: 'past', text: 'İlişkinin başında daha çok kim arardı?', options: [['Ben', '📞', 'telephone'], ['O', '☎️', 'phone']] },
  { tense: 'past', text: 'İlk küslüğünüzde kim barıştırdı?', options: [['Ben', '🤝', 'handshake'], ['O', '🫂', 'hug']] },
  { tense: 'past', text: 'İlk ortak şarkınız oldu mu?', options: [['Evet', '🎵', 'music'], ['Hayır', '🚫', 'headphones']] },
  { tense: 'past', text: 'Çıkmadan önce ne kadar arkadaştınız?', options: [['Kısa süre', '⏳', 'hourglass'], ['Uzun süre', '📅', 'calendar'], ['Hemen başladık', '⚡', 'lightning']] },
  { tense: 'past', text: 'İlk buluşmada heyecandan ne yaptın?', options: [['Çok konuştum', '🗣️', 'talking'], ['Sustum', '🤐', 'shy'], ['Gayet normaldim', '😌', 'relaxed']] },
  { tense: 'past', text: 'İlk kez kim "çıkalım mı" dedi?', options: [['Ben', '💕', 'selfie'], ['O', '💘', 'selfie']] },
  { tense: 'past', text: 'İlk birlikte kutladığınız özel gün?', options: [['Doğum günü', '🎂', 'birthday'], ['Sevgililer Günü', '💝', 'valentine'], ['Yılbaşı', '🎄', 'christmas']] },
  { tense: 'past', text: 'İlk konser/etkinliğe birlikte gittiniz mi?', options: [['Evet', '🎤', 'concert'], ['Hayır', '❌', 'stage']] },
  { tense: 'past', text: 'Tanışınca telefon numarasını kim istedi?', options: [['Ben', '📱', 'selfie'], ['O', '📲', 'selfie']] },
  { tense: 'past', text: 'İlk fotoğrafınız nerede çekildi?', options: [['Dışarıda', '🌳', 'park'], ['Evde', '🛋️', 'livingroom'], ['Bir etkinlikte', '🎉', 'party']] },
  { tense: 'past', text: 'İlk buluşmada hesabı kim ödedi?', options: [['Ben', '🧾', 'receipt'], ['O', '💳', 'creditcard'], ['Paylaştık', '🤝', 'handshake']] },
  { tense: 'past', text: 'İlk izlenimde "bu iş olur" dedin mi?', options: [['Evet', '✅', 'checkmark'], ['Emin değildim', '🤔', 'thinking'], ['Sonradan anladım', '🔁', 'lightbulb']] },
  { tense: 'past', text: 'İlk kez kim sürpriz yaptı?', options: [['Ben', '🎁', 'gift'], ['O', '🎊', 'confetti']] },

  // ---------------------- ŞİMDİ ----------------------
  { tense: 'present', text: 'Tatil deyince akla ne gelir?', options: [['Deniz', '🏖️', 'beach'], ['Dağ', '⛰️', 'mountain'], ['Şehir', '🏙️', 'city']] },
  { tense: 'present', text: 'İkiniz de hangisisiniz?', options: [['Sabah insanı', '🌅', 'sunrise'], ['Gece insanı', '🌙', 'night']] },
  { tense: 'present', text: 'İdeal hafta sonu planı?', options: [['Dışarı çıkmak', '🌆', 'nightlife'], ['Evde dinlenmek', '🏠', 'cozy']] },
  { tense: 'present', text: 'Daha çok kim üşür?', options: [['Ben', '🥶', 'selfie'], ['O', '🧊', 'selfie']] },
  { tense: 'present', text: 'Sabah içeceği?', options: [['Kahve', '☕', 'coffee'], ['Çay', '🫖', 'tea']] },
  { tense: 'present', text: 'Damak tadı?', options: [['Tatlı', '🍰', 'dessert'], ['Tuzlu', '🥨', 'pretzel']] },
  { tense: 'present', text: 'Köpek mi kedi mi?', options: [['Köpek', '🐶', 'dog'], ['Kedi', '🐱', 'cat']] },
  { tense: 'present', text: 'Evde daha düzenli olan?', options: [['Ben', '🧹', 'selfie'], ['O', '🧺', 'selfie']] },
  { tense: 'present', text: 'Hangisi daha çok mutlu eder?', options: [['Romantik jest', '💞', 'flowers'], ['Sürpriz hediye', '🎁', 'gift']] },
  { tense: 'present', text: 'Daha çok kim geç uyur?', options: [['Ben', '🌃', 'selfie'], ['O', '🦉', 'selfie']] },
  { tense: 'present', text: 'Akşam keyfi?', options: [['Film', '🎬', 'cinema'], ['Dizi', '📺', 'television']] },
  { tense: 'present', text: 'Daha çok kim fotoğraf çeker?', options: [['Ben', '📸', 'camera'], ['O', '🤳', 'selfie']] },
  { tense: 'present', text: 'Tartışma sonrası önce kim barışır?', options: [['Ben', '🤝', 'handshake'], ['O', '🫂', 'hug']] },
  { tense: 'present', text: 'Parayı daha dikkatli harcayan?', options: [['Ben', '💰', 'savings'], ['O', '🪙', 'coins'], ['İkimiz de rahatız', '🤲', 'shopping']] },
  { tense: 'present', text: 'Mutfakta kim daha iyi?', options: [['Ben', '👨‍🍳', 'chef'], ['O', '👩‍🍳', 'cooking']] },
  { tense: 'present', text: 'Daha çok kim güler?', options: [['Ben', '😂', 'laughing'], ['O', '🤭', 'smile']] },
  { tense: 'present', text: 'Pizza tercihi?', options: [['Klasik', '🍕', 'pizza'], ['Bol malzeme', '🧀', 'cheese'], ['Sade', '🫓', 'flatbread']] },
  { tense: 'present', text: 'Daha çok kim kıskanır?', options: [['Ben', '😤', 'selfie'], ['O', '🙄', 'selfie']] },
  { tense: 'present', text: 'Sabah ilk iş?', options: [['Telefona bakmak', '📱', 'smartphone'], ['Kahve', '☕', 'coffee'], ['Sarılmak', '🤗', 'hug']] },
  { tense: 'present', text: 'Gün içinde daha çok kim mesaj atar?', options: [['Ben', '💬', 'texting'], ['O', '📩', 'smartphone']] },
  { tense: 'present', text: 'Ev sıcaklığı tercihi?', options: [['Sıcak sever', '🔥', 'fireplace'], ['Serin sever', '❄️', 'snowflake']] },
  { tense: 'present', text: 'Daha çok kim plan yapar?', options: [['Ben', '🗓️', 'planner'], ['O', '🎲', 'dice']] },
  { tense: 'present', text: 'Ortak müzik zevki?', options: [['Pop', '🎤', 'microphone'], ['Rock', '🎸', 'guitar'], ['Türkçe', '🎶', 'music'], ['Karışık', '🎧', 'headphones']] },
  { tense: 'present', text: 'Daha çok kim alışveriş yapar?', options: [['Ben', '🛍️', 'shopping'], ['O', '🛒', 'supermarket']] },
  { tense: 'present', text: 'İdeal akşam?', options: [['Dışarıda yemek', '🍽️', 'restaurant'], ['Evde film', '🍿', 'popcorn']] },
  { tense: 'present', text: 'Daha çok kim "acıktım" der?', options: [['Ben', '🍽️', 'selfie'], ['O', '😋', 'selfie']] },
  { tense: 'present', text: 'Telefonda daha çok kim oyalanır?', options: [['Ben', '📱', 'smartphone'], ['O', '🕹️', 'gaming']] },
  { tense: 'present', text: 'Tartışmada daha inatçı olan?', options: [['Ben', '🪨', 'selfie'], ['O', '🐂', 'selfie']] },
  { tense: 'present', text: 'Daha çok kim "seni seviyorum" der?', options: [['Ben', '❤️', 'selfie'], ['O', '💗', 'selfie'], ['Eşit', '⚖️', 'couple']] },
  { tense: 'present', text: 'Yağmurlu hava?', options: [['Severim', '🌧️', 'umbrella'], ['Sevmem', '☔', 'rain']] },
  { tense: 'present', text: 'Daha çok kim sarılmak ister?', options: [['Ben', '🤗', 'selfie'], ['O', '🫂', 'selfie']] },
  { tense: 'present', text: 'En sevdiğiniz ortak aktivite?', options: [['Yürüyüş', '🚶', 'walking'], ['Yemek', '🍴', 'dining'], ['Film', '🎥', 'cinema'], ['Oyun', '🎮', 'gaming']] },
  { tense: 'present', text: 'Daha çok kim espri yapar?', options: [['Ben', '🤡', 'selfie'], ['O', '😜', 'selfie']] },
  { tense: 'present', text: 'Hangisini seversin?', options: [['Sürpriz', '🎉', 'confetti'], ['Planlı', '📋', 'planner']] },
  { tense: 'present', text: 'Daha unutkan olan?', options: [['Ben', '🤔', 'selfie'], ['O', '🙃', 'selfie']] },
  { tense: 'present', text: 'İçecek tercihi?', options: [['Soğuk', '🧊', 'lemonade'], ['Sıcak', '♨️', 'tea']] },
  { tense: 'present', text: 'Alarmı daha çok kim erteler?', options: [['Ben', '😴', 'sleeping'], ['O', '⏰', 'alarmclock']] },
  { tense: 'present', text: 'En sevdiğiniz mevsim?', options: [['Yaz', '☀️', 'summer'], ['Kış', '❄️', 'winter'], ['İlkbahar', '🌸', 'spring'], ['Sonbahar', '🍂', 'autumn']] },

  // ---------------------- GELECEK ----------------------
  { tense: 'future', text: 'Hayalinizdeki düğün tarzı?', options: [['Kır düğünü', '🌾', 'wedding'], ['Deniz manzaralı', '🌊', 'seaside'], ['Salon', '🏛️', 'ballroom']] },
  { tense: 'future', text: 'İlk ortak ev nerede olsun?', options: [['Şehirde', '🏙️', 'apartment'], ['Doğada/köyde', '🌲', 'cottage'], ['Sahilde', '🏖️', 'beachhouse']] },
  { tense: 'future', text: 'Kaç çocuk hayali?', options: [['Yok', '🚫', 'couple'], ['1', '👶', 'baby'], ['2', '👧👦', 'children'], ['3+', '👨‍👩‍👧‍👦', 'family']] },
  { tense: 'future', text: 'Balayı nerede olsun?', options: [['Tropik ada', '🏝️', 'island'], ['Avrupa turu', '🗼', 'paris'], ['Doğa kampı', '🏕️', 'camping']] },
  { tense: 'future', text: 'Gelecekte evcil hayvan?', options: [['Köpek', '🐕', 'dog'], ['Kedi', '🐈', 'cat'], ['İkisi de', '🐾', 'pets'], ['Yok', '🙅', 'cozy']] },
  { tense: 'future', text: 'Hayalinizdeki ortak araba?', options: [['Klasik', '🚗', 'car'], ['SUV', '🚙', 'suv'], ['Elektrikli', '⚡', 'tesla']] },
  { tense: 'future', text: 'Birlikte ne öğrenmek isterdiniz?', options: [['Dans', '💃', 'dancing'], ['Yeni dil', '🗣️', 'books'], ['Yemek', '👩‍🍳', 'cooking'], ['Enstrüman', '🎸', 'guitar']] },
  { tense: 'future', text: 'Emeklilik hayali?', options: [['Sahil kasabası', '🏖️', 'seaside'], ['Dağ evi', '🏔️', 'cabin'], ['Gezgin yaşam', '✈️', 'travel']] },
  { tense: 'future', text: 'Birlikte gidilecek ilk ülke?', options: [['İtalya', '🇮🇹', 'venice'], ['Japonya', '🇯🇵', 'japan'], ['Yunanistan', '🇬🇷', 'santorini'], ['Fransa', '🇫🇷', 'paris']] },
  { tense: 'future', text: 'Düğünde ilk dans?', options: [['Mutlaka olmalı', '💃', 'dancing'], ['Eğlence yeter', '🎉', 'party']] },
  { tense: 'future', text: 'Ev dekorasyon tarzı?', options: [['Modern', '🛋️', 'modern'], ['Sıcak/rustik', '🪵', 'rustic'], ['Minimalist', '◻️', 'minimalist']] },
  { tense: 'future', text: 'Hafta sonu kaçamağı?', options: [['Şehir dışı', '🚗', 'roadtrip'], ['Evde tatil', '🏡', 'cozy']] },
  { tense: 'future', text: 'Birlikte yapılacak macera?', options: [['Dalış', '🤿', 'diving'], ['Yamaç paraşütü', '🪂', 'paragliding'], ['Safari', '🦁', 'safari'], ['Trekking', '🥾', 'hiking']] },
  { tense: 'future', text: 'Gelecekte birlikte iş kurar mıydınız?', options: [['Evet', '🤝', 'handshake'], ['Hayır', '🙅', 'office'], ['Belki', '🤷', 'thinking']] },
  { tense: 'future', text: 'Çocuğa isim tarzı?', options: [['Geleneksel', '📜', 'vintage'], ['Modern', '✨', 'modern'], ['Anlamlı', '💫', 'heart']] },
  { tense: 'future', text: 'Birlikte alınacak büyük hayal?', options: [['Ev', '🏠', 'house'], ['Dünya turu', '🌍', 'travel'], ['Araba', '🚗', 'car']] },
  { tense: 'future', text: 'Yıldönümü kutlama tarzı?', options: [['Her yıl tatil', '✈️', 'vacation'], ['Romantik yemek', '🕯️', 'candlelight'], ['Sürpriz', '🎁', 'gift']] },
  { tense: 'future', text: 'Birlikte yaşlanınca ev?', options: [['Bahçeli ev', '🌷', 'garden'], ['Şehir merkezi', '🏙️', 'apartment']] },
  { tense: 'future', text: 'Gelecek önceliği?', options: [['Hemen yuva', '🏠', 'house'], ['Önce kariyer', '💼', 'office'], ['Önce gezmek', '🌍', 'travel']] },
  { tense: 'future', text: 'Hayalinizdeki tatil sıklığı?', options: [['Yılda 1 büyük tatil', '🌍', 'vacation'], ['Sık kısa kaçamak', '🚙', 'roadtrip']] },
  { tense: 'future', text: 'Düğün mevsimi?', options: [['Yaz', '☀️', 'summer'], ['Sonbahar', '🍂', 'autumn'], ['İlkbahar', '🌸', 'spring']] },
  { tense: 'future', text: 'Evde olmazsa olmaz?', options: [['Büyük mutfak', '🍳', 'kitchen'], ['Geniş salon', '🛋️', 'livingroom'], ['Bahçe', '🌳', 'garden'], ['Çalışma odası', '💻', 'office']] },
  { tense: 'future', text: 'Birlikte koleksiyon?', options: [['Magnet', '🧲', 'magnets'], ['Fotoğraf', '📷', 'photographs'], ['Biletler', '🎟️', 'tickets']] },
  { tense: 'future', text: 'Gelecekte taşınmak?', options: [['Yurt dışı', '🌐', 'suitcase'], ['Aynı şehir', '📍', 'city'], ['Daha sakin bir yer', '🌄', 'countryside']] },
  { tense: 'future', text: 'Ortak yaşam hedefi?', options: [['Sağlıklı yaşam', '🥗', 'salad'], ['Maddi özgürlük', '💰', 'savings'], ['Bol seyahat', '🧳', 'luggage']] },
  { tense: 'future', text: 'Birlikte yapılacak spor?', options: [['Yürüyüş', '🚶', 'walking'], ['Yoga', '🧘', 'yoga'], ['Fitness', '🏋️', 'gym'], ['Yüzme', '🏊', 'swimming']] },
  { tense: 'future', text: 'Düğün davetli sayısı?', options: [['Küçük & samimi', '👨‍👩‍👧', 'wedding'], ['Kalabalık', '🎊', 'celebration']] },
  { tense: 'future', text: 'Evde bitki bahçesi olsun mu?', options: [['Evet', '🪴', 'houseplants'], ['Hayır', '🚫', 'minimalist']] },
  { tense: 'future', text: 'Birlikte öğrenilecek mutfak?', options: [['İtalyan', '🍝', 'pasta'], ['Uzak Doğu', '🍜', 'ramen'], ['Tatlılar', '🧁', 'cupcake']] },
  { tense: 'future', text: 'Hayalinizdeki yatak odası tonu?', options: [['Pastel', '🌸', 'bedroom'], ['Koyu/şık', '🖤', 'bedroom'], ['Doğal tonlar', '🤍', 'bedroom']] },
  { tense: 'future', text: 'Gelecekte ortak gelenek?', options: [['Cuma film gecesi', '🎬', 'movienight'], ['Pazar kahvaltısı', '🍳', 'brunch'], ['Aylık gezi', '🗺️', 'travel']] },
  { tense: 'future', text: 'İlk büyük başarıyı nasıl kutlarsınız?', options: [['Ev alımı', '🏠', 'house'], ['Terfi', '📈', 'success'], ['Seyahat', '🌍', 'travel']] },
  { tense: 'future', text: 'Yaşlanınca ortak hobi?', options: [['Bahçıvanlık', '🌻', 'gardening'], ['Seyahat', '✈️', 'travel'], ['El işi', '🧶', 'knitting']] },
  { tense: 'future', text: 'Sürpriz partiyi kim daha çok sever?', options: [['Ben', '🎉', 'selfie'], ['O', '🎈', 'selfie'], ['İkimiz de', '🥳', 'celebration']] },
];

function pad(n: number): string {
  return String(n).padStart(3, '0');
}

// "Kim?" sorularında şık rolleri: Ben/Benimki = self, O/Onunki = other,
// diğer her şey (Eşit, İkimiz de, Başkası, Paylaştık...) = shared (ortak cevap).
const SELF_LABELS = new Set(['Ben', 'Benimki']);
const OTHER_LABELS = new Set(['O', 'Onunki']);

function roleFor(label: string): 'self' | 'other' | 'shared' {
  if (SELF_LABELS.has(label)) return 'self';
  if (OTHER_LABELS.has(label)) return 'other';
  return 'shared';
}

export const QUESTIONS: Question[] = RAW.map((q, i): Question => {
  const qid = `q${pad(i + 1)}`;
  // Her soru tam 2 şık: çoktan seçmeli olanlarda ilk iki şık kullanılır
  // (fotoğrafları zaten q-0/q-1'de yüklü olduğundan yeniden indirme gerekmez).
  const options: Option[] = q.options.slice(0, 2).map((o, j) => {
    const role = roleFor(o[0]);
    // "Kim?" şıklarında kişi fotoğrafı kullan: Ben/Benimki = selfie (kendi),
    // O/Onunki = portre (karşıdaki). Nesne yerine kişi → anlamlı ve tutarlı.
    const imgPrompt =
      role === 'self' ? 'selfie' : role === 'other' ? 'portrait' : o[2];
    return { id: `${qid}-${j}`, label: o[0], icon: o[1], imgPrompt, role };
  });
  // Hem self hem other şıkkı varsa bu bir bakış açılı ("kim?") sorudur.
  const perspective =
    options.some((o) => o.role === 'self') &&
    options.some((o) => o.role === 'other');
  return { id: qid, tense: q.tense, text: q.text, options, perspective };
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
