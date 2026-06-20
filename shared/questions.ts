import type { Question, Tense, Option } from './types';

// Sorular kompakt biçimde tanımlanır; id'ler aşağıda otomatik üretilir.
// Her şık: [etiket, emoji (yedek), görsel-üretim metni (İngilizce)].
// Tüm içerik +18 DEĞİLDİR; geçmiş / şimdi / gelecek odaklıdır.
// Mantık "eşleşme": iki partner aynı kişiyi/cevabı işaret ederse doğru sayılır.

type RawOption = [label: string, icon: string, img: string];
interface RawQuestion {
  tense: Tense;
  text: string;
  options: RawOption[]; // 2–4 şık
}

// Bakış açılı ("kim?") şıklarda kişi görselleri
const SELF_IMG = 'smiling young person pointing at themselves';
const OTHER_IMG = 'smiling young person gesturing toward someone else';

const RAW: RawQuestion[] = [
  // ---------------------- GEÇMİŞ ----------------------
  { tense: 'past', text: 'İlk buluşmanız nerede oldu?', options: [['Kafe', '☕', 'cozy coffee shop interior'], ['Restoran', '🍽️', 'romantic restaurant table for two'], ['Sinema', '🎬', 'movie theater seats'], ['Açık hava', '🌳', 'couple on an outdoor date in a park']] },
  { tense: 'past', text: 'İlişkide ilk adımı kim attı?', options: [['Ben', '🙋', SELF_IMG], ['O', '🫵', OTHER_IMG]] },
  { tense: 'past', text: 'Şu ana kadar sana kaç çiçek/gül aldı?', options: [['1–5 arası', '🌹', 'a few red roses'], ['6 ve üzeri', '💐', 'large bouquet of red roses']] },
  { tense: 'past', text: 'İlk "seni seviyorum"u kim söyledi?', options: [['Ben', '💬', SELF_IMG], ['O', '🗣️', OTHER_IMG]] },
  { tense: 'past', text: 'Hangi mevsimde tanıştınız?', options: [['İlkbahar', '🌸', 'spring cherry blossoms'], ['Yaz', '☀️', 'sunny summer beach'], ['Sonbahar', '🍂', 'autumn leaves forest'], ['Kış', '❄️', 'snowy winter landscape']] },
  { tense: 'past', text: 'İlk hediyesi neydi?', options: [['Takı', '💍', 'jewelry gift box necklace'], ['Çiçek', '🌷', 'bouquet of tulips'], ['Kitap', '📖', 'stack of books as a gift'], ['Sürpriz', '🎁', 'wrapped surprise gift']] },
  { tense: 'past', text: 'Nasıl tanıştınız?', options: [['Arkadaş ortamı', '👥', 'group of friends hanging out'], ['Online', '📱', 'smartphone dating app'], ['İş/okul', '🏫', 'university campus building'], ['Tesadüf', '🍀', 'two people meeting by chance on a street']] },
  { tense: 'past', text: 'İlk öpücük nerede gerçekleşti?', options: [['Evde', '🏠', 'cozy living room at home'], ['Dışarıda', '🌆', 'city street at night'], ['Arabada', '🚗', 'car interior at dusk']] },
  { tense: 'past', text: 'İlk birlikte gittiğiniz yer nasıldı?', options: [['Deniz kenarı', '🏖️', 'sandy beach by the sea'], ['Büyük şehir', '🏙️', 'big city skyline'], ['Doğa', '🏞️', 'green nature landscape']] },
  { tense: 'past', text: 'İlk tartışmanızın sebebi neydi?', options: [['Kıskançlık', '😤', 'jealous upset young couple'], ['İletişim', '🗯️', 'couple having a misunderstanding'], ['Saçma bir şey', '🤪', 'couple laughing over a silly argument']] },
  { tense: 'past', text: 'İlk ortak fotoğrafınızı kim çekti?', options: [['Ben', '📸', 'person taking a selfie'], ['O', '🤳', 'person holding a camera taking a photo'], ['Başkası', '🙆', 'stranger taking a photo of a couple']] },
  { tense: 'past', text: 'İlk kez kimin ailesiyle tanıştınız?', options: [['Onunki', '👨‍👩‍👧', 'warm family portrait at dinner'], ['Benimki', '👪', 'happy family gathering at home']] },
  { tense: 'past', text: 'Tanıştığınızda ilk dikkatini çeken neydi?', options: [['Gülüşü', '😄', 'beautiful bright smile close up'], ['Gözleri', '👀', 'close up of expressive eyes'], ['Sesi', '🎙️', 'vintage microphone'], ['Tarzı', '🧥', 'stylish fashionable outfit']] },
  { tense: 'past', text: 'İlk randevuya kim geç kaldı?', options: [['Ben', '⏰', 'person rushing late looking at watch'], ['O', '🕒', 'person checking the time worried'], ['İkimiz de zamanındaydık', '✅', 'punctual happy couple smiling']] },
  { tense: 'past', text: 'İlk mesajı kim attı?', options: [['Ben', '📩', 'person texting on a phone'], ['O', '💌', 'person typing a love message on phone']] },
  { tense: 'past', text: 'İlk yıldönümünüzü nasıl kutladınız?', options: [['Yemek', '🍝', 'romantic candlelit dinner'], ['Gezi', '✈️', 'airplane vacation travel'], ['Evde', '🏡', 'cozy celebration at home'], ['Sürpriz', '🎉', 'surprise party with balloons']] },
  { tense: 'past', text: 'İlk birlikte izlediğiniz filmin türü?', options: [['Romantik', '💕', 'romantic film with hearts'], ['Aksiyon', '💥', 'action movie explosion scene'], ['Komedi', '😂', 'people laughing at a comedy'], ['Korku', '👻', 'spooky horror movie scene']] },
  { tense: 'past', text: 'İlk birlikte yaptığınız yemek neydi?', options: [['Makarna', '🍝', 'plate of pasta'], ['Kahvaltı', '🍳', 'breakfast spread with eggs'], ['Tatlı', '🍰', 'slice of cake dessert']] },
  { tense: 'past', text: 'İlk tatiliniz nasıl gelişti?', options: [['Plan dahilinde', '🗺️', 'travel map and itinerary planning'], ['Tamamen spontane', '🎲', 'spontaneous road trip adventure']] },
  { tense: 'past', text: 'Birbirinize taktığınız ilk lakap tarzı?', options: [['Tatlı', '🍯', 'jar of honey'], ['Komik', '😜', 'playful funny young couple'], ['Klasik (aşkım)', '❤️', 'red heart love']] },
  { tense: 'past', text: 'İlk hediyesini hâlâ saklıyor musun?', options: [['Evet', '📦', 'treasured keepsake gift box'], ['Hayır', '🤷', 'person shrugging with empty hands']] },
  { tense: 'past', text: 'İlişkinin başında birlikte dans ettiniz mi?', options: [['Evet', '💃', 'couple dancing together'], ['Hayır', '🙅', 'person declining to dance']] },
  { tense: 'past', text: 'Birlikte ilk aldığınız şey neydi?', options: [['Bitki', '🪴', 'potted house plant'], ['Ev eşyası', '🛋️', 'cozy sofa furniture'], ['Yemek', '🛒', 'grocery shopping cart with food']] },
  { tense: 'past', text: 'İlk ortak selfie\'de kim poz verdi?', options: [['Ben', '🤩', 'excited person posing for a selfie'], ['O', '😎', 'cool person posing for a photo']] },
  { tense: 'past', text: 'İlk "günaydın" mesajını kim attı?', options: [['Ben', '🌅', 'sunrise good morning message'], ['O', '☀️', 'morning coffee and phone']] },
  { tense: 'past', text: 'İlişkinin başında daha çok kim arardı?', options: [['Ben', '📞', 'person talking on a phone call'], ['O', '☎️', 'person on a phone call smiling']] },
  { tense: 'past', text: 'İlk küslüğünüzde kim barıştırdı?', options: [['Ben', '🤝', 'two people shaking hands to make up'], ['O', '🫂', 'couple hugging and reconciling']] },
  { tense: 'past', text: 'İlk ortak şarkınız oldu mu?', options: [['Evet', '🎵', 'romantic music notes'], ['Hayır', '🚫', 'crossed out music symbol']] },
  { tense: 'past', text: 'Çıkmadan önce ne kadar arkadaştınız?', options: [['Kısa süre', '⏳', 'hourglass with sand'], ['Uzun süre', '📅', 'calendar showing many months'], ['Hemen başladık', '⚡', 'lightning spark']] },
  { tense: 'past', text: 'İlk buluşmada heyecandan ne yaptın?', options: [['Çok konuştum', '🗣️', 'person talking animatedly'], ['Sustum', '🤐', 'shy quiet nervous person'], ['Gayet normaldim', '😌', 'calm relaxed confident person']] },
  { tense: 'past', text: 'İlk kez kim "çıkalım mı" dedi?', options: [['Ben', '💕', 'person asking someone out holding a heart'], ['O', '💘', 'person confessing love with a heart']] },
  { tense: 'past', text: 'İlk birlikte kutladığınız özel gün?', options: [['Doğum günü', '🎂', 'birthday cake with candles'], ['Sevgililer Günü', '💝', 'valentines day hearts and gift'], ['Yılbaşı', '🎄', 'new year christmas tree']] },
  { tense: 'past', text: 'İlk konser/etkinliğe birlikte gittiniz mi?', options: [['Evet', '🎤', 'concert stage with a crowd'], ['Hayır', '❌', 'crossed out concert ticket']] },
  { tense: 'past', text: 'Tanışınca telefon numarasını kim istedi?', options: [['Ben', '📱', 'person asking for a phone number'], ['O', '📲', 'person sharing a phone number']] },
  { tense: 'past', text: 'İlk fotoğrafınız nerede çekildi?', options: [['Dışarıda', '🌳', 'couple photo outdoors in a park'], ['Evde', '🛋️', 'couple photo in a cozy living room'], ['Bir etkinlikte', '🎉', 'couple photo at a party event']] },
  { tense: 'past', text: 'İlk buluşmada hesabı kim ödedi?', options: [['Ben', '🧾', 'person paying a restaurant bill'], ['O', '💳', 'person paying with a credit card'], ['Paylaştık', '🤝', 'two people splitting the bill']] },
  { tense: 'past', text: 'İlk izlenimde "bu iş olur" dedin mi?', options: [['Evet', '✅', 'confident green check mark'], ['Emin değildim', '🤔', 'thoughtful person unsure'], ['Sonradan anladım', '🔁', 'circular arrows realization']] },
  { tense: 'past', text: 'İlk kez kim sürpriz yaptı?', options: [['Ben', '🎁', 'person giving a surprise gift'], ['O', '🎊', 'person throwing a surprise celebration']] },

  // ---------------------- ŞİMDİ ----------------------
  { tense: 'present', text: 'Tatil deyince akla ne gelir?', options: [['Deniz', '🏖️', 'tropical beach and sea'], ['Dağ', '⛰️', 'mountain landscape'], ['Şehir', '🏙️', 'vibrant city travel']] },
  { tense: 'present', text: 'İkiniz de hangisisiniz?', options: [['Sabah insanı', '🌅', 'person enjoying a sunny morning'], ['Gece insanı', '🌙', 'person awake at night under the moon']] },
  { tense: 'present', text: 'İdeal hafta sonu planı?', options: [['Dışarı çıkmak', '🌆', 'people going out in the city'], ['Evde dinlenmek', '🏠', 'relaxing cozy day at home']] },
  { tense: 'present', text: 'Daha çok kim üşür?', options: [['Ben', '🥶', 'person shivering cold wrapped in a blanket'], ['O', '🧊', 'person feeling cold with a scarf']] },
  { tense: 'present', text: 'Sabah içeceği?', options: [['Kahve', '☕', 'cup of coffee'], ['Çay', '🫖', 'cup of tea with teapot']] },
  { tense: 'present', text: 'Damak tadı?', options: [['Tatlı', '🍰', 'sweet dessert cake'], ['Tuzlu', '🥨', 'salty snack pretzel']] },
  { tense: 'present', text: 'Köpek mi kedi mi?', options: [['Köpek', '🐶', 'cute happy dog'], ['Kedi', '🐱', 'cute fluffy cat']] },
  { tense: 'present', text: 'Evde daha düzenli olan?', options: [['Ben', '🧹', 'person tidying and cleaning home'], ['O', '🧺', 'person organizing laundry']] },
  { tense: 'present', text: 'Hangisi daha çok mutlu eder?', options: [['Romantik jest', '💞', 'romantic gesture with flowers'], ['Sürpriz hediye', '🎁', 'surprise wrapped gift']] },
  { tense: 'present', text: 'Daha çok kim geç uyur?', options: [['Ben', '🌃', 'person awake late at night'], ['O', '🦉', 'night owl person on laptop']] },
  { tense: 'present', text: 'Akşam keyfi?', options: [['Film', '🎬', 'watching a movie with popcorn'], ['Dizi', '📺', 'binge watching a tv series']] },
  { tense: 'present', text: 'Daha çok kim fotoğraf çeker?', options: [['Ben', '📸', 'person taking photos with a camera'], ['O', '🤳', 'person taking a selfie']] },
  { tense: 'present', text: 'Tartışma sonrası önce kim barışır?', options: [['Ben', '🤝', 'person reaching out to make peace'], ['O', '🫂', 'person offering a hug']] },
  { tense: 'present', text: 'Parayı daha dikkatli harcayan?', options: [['Ben', '💰', 'person saving money in a piggy bank'], ['O', '🪙', 'person counting coins carefully'], ['İkimiz de rahatız', '🤲', 'couple shopping happily together']] },
  { tense: 'present', text: 'Mutfakta kim daha iyi?', options: [['Ben', '👨‍🍳', 'man cooking happily in kitchen'], ['O', '👩‍🍳', 'woman cooking happily in kitchen']] },
  { tense: 'present', text: 'Daha çok kim güler?', options: [['Ben', '😂', 'person laughing out loud'], ['O', '🤭', 'person giggling cheerfully']] },
  { tense: 'present', text: 'Pizza tercihi?', options: [['Klasik', '🍕', 'classic margherita pizza'], ['Bol malzeme', '🧀', 'loaded pizza with lots of toppings'], ['Sade', '🫓', 'plain simple flatbread']] },
  { tense: 'present', text: 'Daha çok kim kıskanır?', options: [['Ben', '😤', 'jealous frowning person'], ['O', '🙄', 'person rolling eyes jealous']] },
  { tense: 'present', text: 'Sabah ilk iş?', options: [['Telefona bakmak', '📱', 'person checking phone in bed'], ['Kahve', '☕', 'morning cup of coffee'], ['Sarılmak', '🤗', 'couple cuddling in the morning']] },
  { tense: 'present', text: 'Gün içinde daha çok kim mesaj atar?', options: [['Ben', '💬', 'person texting throughout the day'], ['O', '📩', 'person sending many messages']] },
  { tense: 'present', text: 'Ev sıcaklığı tercihi?', options: [['Sıcak sever', '🔥', 'warm cozy fireplace'], ['Serin sever', '❄️', 'cool air conditioning snowflake']] },
  { tense: 'present', text: 'Daha çok kim plan yapar?', options: [['Ben', '🗓️', 'person planning with a calendar'], ['O', '🎲', 'spontaneous carefree person']] },
  { tense: 'present', text: 'Ortak müzik zevki?', options: [['Pop', '🎤', 'pop concert microphone'], ['Rock', '🎸', 'electric guitar rock'], ['Türkçe', '🎶', 'acoustic music notes'], ['Karışık', '🎧', 'headphones with mixed playlist']] },
  { tense: 'present', text: 'Daha çok kim alışveriş yapar?', options: [['Ben', '🛍️', 'person with shopping bags'], ['O', '🛒', 'person pushing a shopping cart']] },
  { tense: 'present', text: 'İdeal akşam?', options: [['Dışarıda yemek', '🍽️', 'dining out at a restaurant'], ['Evde film', '🍿', 'movie night at home with popcorn']] },
  { tense: 'present', text: 'Daha çok kim "acıktım" der?', options: [['Ben', '🍽️', 'hungry person with empty plate'], ['O', '😋', 'person craving food']] },
  { tense: 'present', text: 'Telefonda daha çok kim oyalanır?', options: [['Ben', '📱', 'person scrolling on phone'], ['O', '🕹️', 'person playing mobile games']] },
  { tense: 'present', text: 'Tartışmada daha inatçı olan?', options: [['Ben', '🪨', 'stubborn determined person'], ['O', '🐂', 'stubborn person crossing arms']] },
  { tense: 'present', text: 'Daha çok kim "seni seviyorum" der?', options: [['Ben', '❤️', 'person saying I love you with heart'], ['O', '💗', 'person expressing love'], ['Eşit', '⚖️', 'balanced scale equal']] },
  { tense: 'present', text: 'Yağmurlu hava?', options: [['Severim', '🌧️', 'person enjoying the rain with umbrella'], ['Sevmem', '☔', 'person annoyed by rain']] },
  { tense: 'present', text: 'Daha çok kim sarılmak ister?', options: [['Ben', '🤗', 'person opening arms for a hug'], ['O', '🫂', 'person wanting a warm hug']] },
  { tense: 'present', text: 'En sevdiğiniz ortak aktivite?', options: [['Yürüyüş', '🚶', 'couple walking outdoors'], ['Yemek', '🍴', 'couple enjoying a meal'], ['Film', '🎥', 'couple watching a film'], ['Oyun', '🎮', 'couple playing video games']] },
  { tense: 'present', text: 'Daha çok kim espri yapar?', options: [['Ben', '🤡', 'funny person making jokes'], ['O', '😜', 'playful person being silly']] },
  { tense: 'present', text: 'Hangisini seversin?', options: [['Sürpriz', '🎉', 'surprise party confetti'], ['Planlı', '📋', 'organized checklist planner']] },
  { tense: 'present', text: 'Daha unutkan olan?', options: [['Ben', '🤔', 'forgetful person trying to remember'], ['O', '🙃', 'absent minded person']] },
  { tense: 'present', text: 'İçecek tercihi?', options: [['Soğuk', '🧊', 'iced cold drink'], ['Sıcak', '♨️', 'hot steaming drink']] },
  { tense: 'present', text: 'Alarmı daha çok kim erteler?', options: [['Ben', '😴', 'sleepy person hitting snooze'], ['O', '⏰', 'person turning off alarm clock']] },
  { tense: 'present', text: 'En sevdiğiniz mevsim?', options: [['Yaz', '☀️', 'sunny summer day'], ['Kış', '❄️', 'snowy winter day'], ['İlkbahar', '🌸', 'blooming spring flowers'], ['Sonbahar', '🍂', 'golden autumn leaves']] },

  // ---------------------- GELECEK ----------------------
  { tense: 'future', text: 'Hayalinizdeki düğün tarzı?', options: [['Kır düğünü', '🌾', 'rustic outdoor countryside wedding'], ['Deniz manzaralı', '🌊', 'beachfront wedding by the sea'], ['Salon', '🏛️', 'elegant ballroom wedding']] },
  { tense: 'future', text: 'İlk ortak ev nerede olsun?', options: [['Şehirde', '🏙️', 'modern city apartment'], ['Doğada/köyde', '🌲', 'cozy house in nature'], ['Sahilde', '🏖️', 'beach house by the sea']] },
  { tense: 'future', text: 'Kaç çocuk hayali?', options: [['Yok', '🚫', 'happy couple no children'], ['1', '👶', 'one cute baby'], ['2', '👧👦', 'two children siblings'], ['3+', '👨‍👩‍👧‍👦', 'large happy family with kids']] },
  { tense: 'future', text: 'Balayı nerede olsun?', options: [['Tropik ada', '🏝️', 'tropical island paradise'], ['Avrupa turu', '🗼', 'european city landmarks tour'], ['Doğa kampı', '🏕️', 'camping in nature with tent']] },
  { tense: 'future', text: 'Gelecekte evcil hayvan?', options: [['Köpek', '🐕', 'happy dog pet'], ['Kedi', '🐈', 'cute cat pet'], ['İkisi de', '🐾', 'dog and cat together'], ['Yok', '🙅', 'tidy home no pets']] },
  { tense: 'future', text: 'Hayalinizdeki ortak araba?', options: [['Klasik', '🚗', 'classic sedan car'], ['SUV', '🚙', 'modern suv car'], ['Elektrikli', '⚡', 'electric car charging']] },
  { tense: 'future', text: 'Birlikte ne öğrenmek isterdiniz?', options: [['Dans', '💃', 'couple learning to dance'], ['Yeni dil', '🗣️', 'learning a new language with books'], ['Yemek', '👩‍🍳', 'cooking class together'], ['Enstrüman', '🎸', 'learning to play guitar']] },
  { tense: 'future', text: 'Emeklilik hayali?', options: [['Sahil kasabası', '🏖️', 'seaside retirement town'], ['Dağ evi', '🏔️', 'cabin in the mountains'], ['Gezgin yaşam', '✈️', 'traveling the world in retirement']] },
  { tense: 'future', text: 'Birlikte gidilecek ilk ülke?', options: [['İtalya', '🇮🇹', 'italy colosseum and canals'], ['Japonya', '🇯🇵', 'japan temple and cherry blossoms'], ['Yunanistan', '🇬🇷', 'greece white houses and sea'], ['Fransa', '🇫🇷', 'france eiffel tower paris']] },
  { tense: 'future', text: 'Düğünde ilk dans?', options: [['Mutlaka olmalı', '💃', 'couple first dance at wedding'], ['Eğlence yeter', '🎉', 'fun wedding party dancing crowd']] },
  { tense: 'future', text: 'Ev dekorasyon tarzı?', options: [['Modern', '🛋️', 'modern minimalist living room'], ['Sıcak/rustik', '🪵', 'warm rustic wooden interior'], ['Minimalist', '◻️', 'clean minimalist white room']] },
  { tense: 'future', text: 'Hafta sonu kaçamağı?', options: [['Şehir dışı', '🚗', 'weekend road trip getaway'], ['Evde tatil', '🏡', 'relaxing staycation at home']] },
  { tense: 'future', text: 'Birlikte yapılacak macera?', options: [['Dalış', '🤿', 'scuba diving underwater'], ['Yamaç paraşütü', '🪂', 'paragliding over mountains'], ['Safari', '🦁', 'safari with wild animals'], ['Trekking', '🥾', 'hiking trekking in mountains']] },
  { tense: 'future', text: 'Gelecekte birlikte iş kurar mıydınız?', options: [['Evet', '🤝', 'couple business partners handshake'], ['Hayır', '🙅', 'person declining gesture'], ['Belki', '🤷', 'person unsure shrugging']] },
  { tense: 'future', text: 'Çocuğa isim tarzı?', options: [['Geleneksel', '📜', 'old traditional scroll'], ['Modern', '✨', 'modern sparkle stars'], ['Anlamlı', '💫', 'meaningful glowing symbol']] },
  { tense: 'future', text: 'Birlikte alınacak büyük hayal?', options: [['Ev', '🏠', 'dream house with keys'], ['Dünya turu', '🌍', 'world travel globe'], ['Araba', '🚗', 'brand new car']] },
  { tense: 'future', text: 'Yıldönümü kutlama tarzı?', options: [['Her yıl tatil', '✈️', 'anniversary vacation trip'], ['Romantik yemek', '🕯️', 'romantic candlelit dinner'], ['Sürpriz', '🎁', 'surprise anniversary gift']] },
  { tense: 'future', text: 'Birlikte yaşlanınca ev?', options: [['Bahçeli ev', '🌷', 'house with a flower garden'], ['Şehir merkezi', '🏙️', 'apartment in city center']] },
  { tense: 'future', text: 'Gelecek önceliği?', options: [['Hemen yuva', '🏠', 'cozy family home nest'], ['Önce kariyer', '💼', 'career office briefcase'], ['Önce gezmek', '🌍', 'traveling the world first']] },
  { tense: 'future', text: 'Hayalinizdeki tatil sıklığı?', options: [['Yılda 1 büyük tatil', '🌍', 'one big international vacation'], ['Sık kısa kaçamak', '🚙', 'frequent short weekend trips']] },
  { tense: 'future', text: 'Düğün mevsimi?', options: [['Yaz', '☀️', 'summer outdoor wedding'], ['Sonbahar', '🍂', 'autumn wedding with leaves'], ['İlkbahar', '🌸', 'spring wedding with blossoms']] },
  { tense: 'future', text: 'Evde olmazsa olmaz?', options: [['Büyük mutfak', '🍳', 'large modern kitchen'], ['Geniş salon', '🛋️', 'spacious living room'], ['Bahçe', '🌳', 'beautiful home garden'], ['Çalışma odası', '💻', 'home office study room']] },
  { tense: 'future', text: 'Birlikte koleksiyon?', options: [['Magnet', '🧲', 'fridge magnets collection'], ['Fotoğraf', '📷', 'photo album collection'], ['Biletler', '🎟️', 'collection of event tickets']] },
  { tense: 'future', text: 'Gelecekte taşınmak?', options: [['Yurt dışı', '🌐', 'moving abroad with suitcases'], ['Aynı şehir', '📍', 'staying in the same city map pin'], ['Daha sakin bir yer', '🌄', 'peaceful quiet countryside']] },
  { tense: 'future', text: 'Ortak yaşam hedefi?', options: [['Sağlıklı yaşam', '🥗', 'healthy lifestyle salad and fitness'], ['Maddi özgürlük', '💰', 'financial freedom savings'], ['Bol seyahat', '🧳', 'frequent travel with luggage']] },
  { tense: 'future', text: 'Birlikte yapılacak spor?', options: [['Yürüyüş', '🚶', 'couple walking exercise'], ['Yoga', '🧘', 'couple doing yoga'], ['Fitness', '🏋️', 'couple working out at gym'], ['Yüzme', '🏊', 'swimming in a pool']] },
  { tense: 'future', text: 'Düğün davetli sayısı?', options: [['Küçük & samimi', '👨‍👩‍👧', 'small intimate wedding'], ['Kalabalık', '🎊', 'big crowded wedding celebration']] },
  { tense: 'future', text: 'Evde bitki bahçesi olsun mu?', options: [['Evet', '🪴', 'home full of indoor plants'], ['Hayır', '🚫', 'minimalist home no plants']] },
  { tense: 'future', text: 'Birlikte öğrenilecek mutfak?', options: [['İtalyan', '🍝', 'italian cuisine pasta'], ['Uzak Doğu', '🍜', 'asian cuisine noodles'], ['Tatlılar', '🧁', 'baking desserts and cupcakes']] },
  { tense: 'future', text: 'Hayalinizdeki yatak odası tonu?', options: [['Pastel', '🌸', 'pastel pink bedroom'], ['Koyu/şık', '🖤', 'dark elegant bedroom'], ['Doğal tonlar', '🤍', 'natural earth tone bedroom']] },
  { tense: 'future', text: 'Gelecekte ortak gelenek?', options: [['Cuma film gecesi', '🎬', 'friday movie night at home'], ['Pazar kahvaltısı', '🍳', 'sunday brunch breakfast'], ['Aylık gezi', '🗺️', 'monthly trip adventure']] },
  { tense: 'future', text: 'İlk büyük başarıyı nasıl kutlarsınız?', options: [['Ev alımı', '🏠', 'celebrating buying a new home'], ['Terfi', '📈', 'celebrating a job promotion'], ['Seyahat', '🌍', 'celebrating with a trip']] },
  { tense: 'future', text: 'Yaşlanınca ortak hobi?', options: [['Bahçıvanlık', '🌻', 'gardening with sunflowers'], ['Seyahat', '✈️', 'traveling together'], ['El işi', '🧶', 'knitting and crafts']] },
  { tense: 'future', text: 'Sürpriz partiyi kim daha çok sever?', options: [['Ben', '🎉', 'person loving a surprise party'], ['O', '🎈', 'person enjoying party balloons'], ['İkimiz de', '🥳', 'couple celebrating together']] },
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
  const options: Option[] = q.options.map((o, j) => ({
    id: `${qid}-${j}`,
    label: o[0],
    icon: o[1],
    imgPrompt: o[2],
    role: roleFor(o[0]),
  }));
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
