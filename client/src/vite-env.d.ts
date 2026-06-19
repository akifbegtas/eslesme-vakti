/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GitHub Pages + ayrı backend kurulumunda Render sunucusunun adresi. */
  readonly VITE_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
