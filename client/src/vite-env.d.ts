/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GitHub Pages + ayrı backend kurulumunda Render sunucusunun adresi. */
  readonly VITE_SERVER_URL?: string;
  /** '1' ise şık görselleri önce yerel (Unsplash ile indirilmiş) dosyalardan. */
  readonly VITE_USE_LOCAL_PHOTOS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
