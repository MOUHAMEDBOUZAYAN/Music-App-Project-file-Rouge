# 🎵 SoundWave Music Platform

## 📋 نظرة عامة على المشروع

**SoundWave** هو منصة موسيقية شاملة تتيح للمستخدمين الاستماع إلى الموسيقى، إنشاء قوائم التشغيل، متابعة الفنانين، وإدارة محتواهم الموسيقي. المنصة مصممة لتكون بديلاً احترافياً لـ Spotify مع ميزات إضافية للفنانين.

## ✨ الميزات الرئيسية

### 🎧 للمستمعين
- **استماع مجاني** للموسيقى
- **إنشاء قوائم تشغيل** مخصصة
- **متابعة الفنانين** المفضلين
- **نظام الإعجابات** والتفاعل
- **البحث المتقدم** في الموسيقى
- **واجهة مستخدم متجاوبة** لجميع الأجهزة
- **مشغل موسيقى متقدم** مع تحكم كامل

### 🎤 للفنانين
- **رفع الأغاني والألبومات** بسهولة
- **إدارة المحتوى** من لوحة تحكم مخصصة
- **إحصائيات الأداء** والتفاعل
- **نظام المتابعين** والمشتركين
- **تحميل ملفات صوتية** بجودة عالية

### 🔧 للمديرين
- **لوحة تحكم إدارية** شاملة
- **إدارة المستخدمين** والمحتوى
- **مراقبة النظام** والأداء
- **تقارير مفصلة** عن الاستخدام

## 🏗️ هيكل المشروع

```
Project-Du-Fin-D'Ètude/
└── 📁 SoundWave-Music/                    # المشروع الرئيسي
    ├── 📁 soundwave-frontend/             # تطبيق React.js (Frontend)
    │   ├── 📁 src/
    │   │   ├── 📁 components/            # مكونات React (10+ components)
    │   │   │   ├── 📁 artist/            # CreateAlbum.jsx, UploadSong.jsx
    │   │   │   ├── 📁 auth/              # LoginForm.jsx, RegisterForm.jsx, SpotifyLogin.jsx
    │   │   │   ├── 📁 common/            # AudioPlayer, Header, Footer, Sidebar, Layout, etc.
    │   │   │   ├── 📁 music/             # SongCard.jsx, TrackList.jsx
    │   │   │   └── 📁 player/            # AudioPlayer.jsx, NowPlayingSheet.jsx
    │   │   ├── 📁 pages/                 # صفحات التطبيق (17 pages)
    │   │   │   ├── Home.jsx, Search.jsx, Library.jsx, Profile.jsx
    │   │   │   ├── Artist.jsx, Album.jsx, Song.jsx, Playlist.jsx
    │   │   │   ├── ArtistDashboard.jsx, LikedSongs.jsx
    │   │   │   └── ... (17 صفحات كاملة)
    │   │   ├── 📁 services/              # خدمات API (6 services)
    │   │   │   ├── authService.js, songService.js, albumService.js
    │   │   │   ├── artistService.js, playlistService.js, api.js
    │   │   ├── 📁 store/                 # إدارة الحالة (Context API)
    │   │   │   ├── AuthContext.jsx, MusicContext.jsx, SidebarContext.jsx
    │   │   ├── 📁 styles/                # ملفات CSS
    │   │   │   ├── globals.css, components.css, theme.css
    │   │   ├── 📁 hooks/                 # React Hooks
    │   │   ├── 📁 config/                # ملفات التكوين
    │   │   ├── 📁 utils/                 # وظائف مساعدة
    │   │   ├── App.jsx, main.jsx
    │   │   └── index.css
    │   ├── 📁 public/                    # الملفات العامة
    │   ├── 📄 Dockerfile
    │   ├── 📄 package.json
    │   ├── 📄 vite.config.js
    │   └── 📄 tailwind.config.js
    │
    ├── 📁 soundwave-backend/             # خادم Node.js/Express (Backend)
    │   ├── 📁 src/
    │   │   ├── 📁 controllers/           # منطق الأعمال (9 controllers)
    │   │   │   ├── auth.controller.js, song.controller.js, album.controller.js
    │   │   │   ├── user.controller.js, artist.controller.js, playlist.controller.js
    │   │   │   ├── search.controller.js, social.controller.js, admin.controller.js
    │   │   ├── 📁 models/                # نماذج قاعدة البيانات (8 models)
    │   │   │   ├── User.js, Song.js, Album.js, Playlist.js
    │   │   │   ├── Artist.js, Comment.js, Follow.js, ExternalFavorite.js
    │   │   ├── 📁 routes/                # مسارات API (11 routes)
    │   │   │   ├── auth.routes.js, song.routes.js, album.routes.js
    │   │   │   ├── user.routes.js, artist.routes.js, playlist.routes.js
    │   │   │   ├── search.routes.js, social.routes.js, spotify.routes.js
    │   │   │   ├── favorites.routes.js, admin.routes.js
    │   │   ├── 📁 middleware/            # وسائط التطبيق (7 middlewares)
    │   │   │   ├── auth.middleware.js, error.middleware.js
    │   │   │   ├── cors.middleware.js, logger.middleware.js
    │   │   │   ├── rateLimit.middleware.js, validation.middleware.js
    │   │   ├── 📁 services/              # خدمات خارجية
    │   │   │   └── cloudinary.service.js
    │   │   ├── 📁 config/                # ملفات التكوين
    │   │   │   ├── database.js, jwt.js, spotify.js
    │   │   ├── 📁 utils/                 # وظائف مساعدة
    │   │   ├── 📁 uploads/               # الملفات المرفوعة
    │   │   │   ├── 📁 audio/            # ملفات الصوت
    │   │   │   └── 📁 images/           # الصور
    │   │   └── app.js                    # التطبيق الرئيسي
    │   ├── 📁 tests/                     # اختبارات شاملة
    │   │   ├── 📁 integration/          # اختبارات التكامل
    │   │   ├── 📁 models/               # اختبارات النماذج
    │   │   └── setup.js
    │   ├── 📁 logs/                      # ملفات السجلات
    │   ├── 📄 Dockerfile
    │   ├── 📄 package.json
    │   └── 📄 jest.config.js
    │
    ├── 📄 docker-compose.yml             # إدارة الخدمات
    ├── 📄 start-complete.bat             # بدء التطبيق (Windows)
    └── 📄 README.md                      # هذا الملف
```

## 🛠️ التقنيات المستخدمة

### Frontend
- **React.js 18** - مكتبة واجهة المستخدم
- **React Router** - التنقل بين الصفحات
- **Tailwind CSS** - تصميم متجاوب
- **Axios** - طلبات HTTP
- **React Hot Toast** - إشعارات المستخدم
- **Lucide React** - أيقونات جميلة

### Backend
- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل الويب
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM لـ MongoDB
- **JWT** - المصادقة الآمنة
- **Multer** - رفع الملفات
- **Cloudinary** - تخزين الملفات
- **Jest** - اختبارات الوحدة والتكامل

### DevOps & Containerization
- **Docker** - حاويات التطبيقات
- **Docker Compose** - إدارة الخدمات المتعددة
- **Multi-stage builds** - تحسين حجم الصور
- **Health checks** - مراقبة صحة الخدمات

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
- **Node.js** (الإصدار 16 أو أحدث)
- **npm** (الإصدار 8 أو أحدث)
- **MongoDB** (محلي أو سحابي)
- **Docker** (اختياري - للتشغيل مع الحاويات)

### 1. تثبيت التبعيات

```bash
# تثبيت تبعيات الـ Frontend
cd soundwave-frontend
npm install

# تثبيت تبعيات الـ Backend
cd ../soundwave-backend
npm install
```

### 2. إعداد متغيرات البيئة

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/spotify-callback
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/soundwave
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 3. تشغيل التطبيق

#### الطريقة السريعة (تشغيل كلا الخادمين)
```bash
# من المجلد الرئيسي
npm run start-complete
```

#### الطريقة اليدوية
```bash
# تشغيل الـ Backend
cd soundwave-backend
npm start

# تشغيل الـ Frontend (في terminal منفصل)
cd soundwave-frontend
npm run dev
```

## 🐳 التشغيل مع Docker

### المتطلبات
- **Docker** (الإصدار 20 أو أحدث)
- **Docker Compose** (الإصدار 2 أو أحدث)

### 1. تشغيل المشروع كاملاً مع Docker

```bash
# بناء وتشغيل جميع الخدمات
docker-compose up --build

# تشغيل في الخلفية
docker-compose up -d --build

# إيقاف الخدمات
docker-compose down
```

### 2. الخدمات المتاحة

| الخدمة | البورت | الوصف |
|--------|--------|--------|
| **Frontend** | 3000 | تطبيق React |
| **Backend** | 5000 | API الخادم |
| **MongoDB** | 27017 | قاعدة البيانات |

### 3. الوصول للتطبيق

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### 4. إدارة البيانات

```bash
# حذف جميع البيانات (إعادة تعيين)
docker-compose down -v

# عرض السجلات
docker-compose logs -f

# إعادة بناء خدمة محددة
docker-compose up --build soundwave-backend
```

### 5. متغيرات البيئة في Docker

يتم تعيين المتغيرات التالية تلقائياً:

```env
# Backend
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/soundwave
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000

# MongoDB
MONGO_INITDB_DATABASE=soundwave
```

### 6. ميزات Docker

- ✅ **عزل البيئة** - كل خدمة في حاوية منفصلة
- ✅ **سهولة التشغيل** - أمر واحد فقط
- ✅ **إدارة التبعيات** - MongoDB و Redis
- ✅ **أمان محسن** - مستخدمين غير root
- ✅ **مراقبة الصحة** - Health checks
- ✅ **أداء محسن** - تحسينات متعددة المراحل

## 📱 الصفحات والميزات

### 🏠 الصفحة الرئيسية
- عرض الموسيقى الشائعة
- فئات مختلفة (موسيقى، بودكاست)
- بحث سريع
- وصول سريع للوظائف المهمة

### 🔍 البحث
- بحث متقدم في الأغاني والألبومات والفنانين
- تصفية النتائج
- اقتراحات ذكية

### 📚 المكتبة
- الأغاني المفضلة
- الألبومات المفضلة
- قوائم التشغيل
- الفنانين المتابعين

### 🎤 لوحة تحكم الفنان
- رفع الأغاني الجديدة
- إنشاء الألبومات
- إدارة المحتوى
- إحصائيات الأداء

### 👤 الملف الشخصي
- عرض المعلومات الشخصية
- إدارة الإعدادات
- الأغاني والألبومات المرفوعة

## 🔐 نظام المصادقة

### تسجيل الدخول
- **البريد الإلكتروني وكلمة المرور**
- **تسجيل الدخول عبر Spotify** (اختياري)
- **تسجيل الدخول كفنان أو مستمع**

### الأمان
- **JWT Tokens** للمصادقة
- **تشفير كلمات المرور** باستخدام bcrypt
- **حماية المسارات** الحساسة
- **التحقق من الصلاحيات**

## 🎵 إدارة المحتوى

### رفع الأغاني
- **دعم ملفات MP3, WAV, M4A**
- **رفع غلاف الأغنية**
- **إضافة معلومات مفصلة** (العنوان، الفنان، النوع، السنة)
- **ربط الأغنية بالألبوم**

### إدارة الألبومات
- **إنشاء ألبومات جديدة**
- **إضافة أغاني للألبوم**
- **رفع غلاف الألبوم**
- **تنظيم المحتوى**

## 📊 نظام الاختبارات

### اختبارات الوحدة (Unit Tests)
- **اختبار الموديلات** (User, Song, Album)
- **اختبار الخدمات** والوظائف المساعدة
- **اختبار التحقق من البيانات**

### اختبارات التكامل (Integration Tests)
- **اختبار API Endpoints**
- **اختبار المصادقة**
- **اختبار العمليات CRUD**
- **اختبار العلاقات بين البيانات**

### تشغيل الاختبارات
```bash
# جميع الاختبارات
npm test

# اختبارات الموديلات فقط
npm run test:models

# اختبارات API فقط
npm run test:integration

# مع تقرير التغطية
npm run test:coverage
```

## 🌐 API Documentation

### مسارات المصادقة
```
POST /api/auth/register     # تسجيل مستخدم جديد
POST /api/auth/login        # تسجيل الدخول
GET  /api/auth/me          # بيانات المستخدم الحالي
PUT  /api/auth/update-profile # تحديث الملف الشخصي
POST /api/auth/logout      # تسجيل الخروج
```

### مسارات الأغاني
```
GET    /api/songs                    # جميع الأغاني
GET    /api/songs/:id               # أغنية محددة
GET    /api/songs/artist/:artistId  # أغاني فنان محدد
POST   /api/songs                   # إنشاء أغنية جديدة
PUT    /api/songs/:id               # تحديث أغنية
DELETE /api/songs/:id               # حذف أغنية
POST   /api/songs/:id/like          # إعجاب/إلغاء إعجاب
```

### مسارات الألبومات
```
GET    /api/albums                    # جميع الألبومات
GET    /api/albums/:id               # ألبوم محدد
GET    /api/albums/artist/:artistId  # ألبومات فنان محدد
POST   /api/albums                   # إنشاء ألبوم جديد
PUT    /api/albums/:id               # تحديث ألبوم
DELETE /api/albums/:id               # حذف ألبوم
POST   /api/albums/:id/like          # إعجاب/إلغاء إعجاب
```

### مسارات المستخدمين
```
GET  /api/users/profile/:id    # ملف مستخدم محدد
GET  /api/users/search         # البحث عن المستخدمين
POST /api/users/follow/:id     # متابعة/إلغاء متابعة
GET  /api/users/following      # قائمة المتابعين
GET  /api/users/followers      # قائمة المتابعين
```

## 📱 التصميم المتجاوب

### الأجهزة المدعومة
- **الهواتف الذكية** (Mobile)
- **الأجهزة اللوحية** (Tablet)
- **أجهزة سطح المكتب** (Desktop)

### الميزات المتجاوبة
- **شريط تنقل سفلي** للهواتف
- **شريط جانبي** للأجهزة الكبيرة
- **مشغل موسيقى متكيف** مع حجم الشاشة
- **تصميم مرن** يتكيف مع جميع الأحجام

## 🔧 إدارة المشروع

### Scripts المتاحة

#### Frontend
```bash
npm run dev          # تشغيل في وضع التطوير
npm run build        # بناء للإنتاج
npm run preview      # معاينة البناء
npm run lint         # فحص الكود
```

#### Backend
```bash
npm start            # تشغيل الإنتاج
npm run dev          # تشغيل التطوير
npm test             # تشغيل الاختبارات
npm run lint         # فحص الكود
```

### إدارة قاعدة البيانات
```bash
# إنشاء قاعدة البيانات
npm run setup-database

# إعادة تعيين قاعدة البيانات
npm run reset-database
```

## 🚀 النشر والإنتاج

### متطلبات الإنتاج
- **خادم Node.js** مستقر
- **قاعدة بيانات MongoDB** سحابية
- **خدمة تخزين الملفات** (Cloudinary)
- **شهادة SSL** للأمان

### خطوات النشر
1. **إعداد متغيرات البيئة** للإنتاج
2. **بناء تطبيق Frontend** للإنتاج
3. **تشغيل اختبارات شاملة**
4. **نشر على الخادم**
5. **إعداد قاعدة البيانات**
6. **اختبار الوظائف**

## 🤝 المساهمة في المشروع

### كيفية المساهمة
1. **Fork** المشروع
2. **إنشاء فرع** جديد للميزة
3. **كتابة الكود** مع الاختبارات
4. **تشغيل الاختبارات** للتأكد من عملها
5. **إنشاء Pull Request**

### معايير الكود
- **اتباع ESLint** rules
- **كتابة تعليقات** واضحة
- **إضافة اختبارات** للكود الجديد
- **تحديث الوثائق** عند الحاجة

## 📞 الدعم والمساعدة

### المشاكل الشائعة
- **مشاكل الاتصال بقاعدة البيانات**
- **أخطاء رفع الملفات**
- **مشاكل المصادقة**
- **أخطاء التصميم المتجاوب**

### الحصول على المساعدة
- **إنشاء Issue** جديد
- **وصف المشكلة** بالتفصيل
- **إرفاق لقطات الشاشة** إن أمكن
- **توفير معلومات النظام**

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة **MIT** - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 👥 فريق التطوير / Livrables du Projet

### 📌 معلومات المطور (Developer Information)

**المطور الرئيسي والمطور الوحيد للمشروع (Sole Developer)**

- **الاسم**: Mohamed Bouzayan (محمد بوزيان)
- **البريد الإلكتروني**: mohammedbouzi177@gmail.com
- **المدرسة**: المدرسة الرقمية أحمد Hensalie (École Numérique Ahmed Hensalie)
- **نوع المشروع**: مشروع نهاية الدراسة (Projet de Fin d'Études)

### 🎯 مسؤوليات التطوير (Development Responsibilities)

تم تطوير هذا المشروع بالكامل من طرف **Mohamed Bouzayan**، ويشمل:

- ✅ **تطوير Frontend الكامل** (React.js, Tailwind CSS, Vite)
- ✅ **تطوير Backend الكامل** (Node.js, Express.js, MongoDB)
- ✅ **تصميم قاعدة البيانات** (MongoDB Schema Design)
- ✅ **تصميم واجهة المستخدم** (UI/UX Design)
- ✅ **إعداد Docker و Docker Compose**
- ✅ **إعداد CI/CD والتكامل**
- ✅ **كتابة الاختبارات** (Unit Tests & Integration Tests)
- ✅ **توثيق المشروع** (Documentation)

### 📦 Livrables du Projet

1. **itinéraire de l'application complète** (Code Source)
   - Frontend React.js
   - Backend Node.js/Express
   - Configuration Docker

2. **Documentation technique**
   - README.md
   - Documentation API
   - Guide d'installation

3. **Tests et qualité**
   - Tests unitaires
   - Tests d'intégration
   - Rapports de couverture

4. **Présentation et démonstration**
   - Vidéo de démonstration
   - Présentation PowerPoint
   - Documentation utilisateur

---

**Contact**: mohammedbouzi177@gmail.com

## 🎯 خطة التطوير المستقبلية

### الميزات القادمة
- **نظام التعليقات** على الأغاني
- **نظام التقييمات** والمراجعات
- **نظام الإشعارات** الفورية
- **دعم البث المباشر**
- **نظام الاشتراكات** المدفوعة
- **تطبيق الهاتف المحمول**

### التحسينات المخططة
- **تحسين الأداء** والسرعة
- **إضافة المزيد من الاختبارات**
- **تحسين الأمان**
- **دعم المزيد من تنسيقات الملفات**

---

## 🎵 استمتع بالموسيقى مع SoundWave! 🎵

**SoundWave** - منصة موسيقية شاملة تجمع بين البساطة والقوة لتقديم تجربة استماع استثنائية.

---

*تم إنشاء هذا المشروع كجزء من مشروع التخرج في المدرسة الوطنية للفنون التطبيقية (ENAA)*
