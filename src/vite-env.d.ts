/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DD_SERVICE?: string;
  readonly VITE_DD_ENV?: string;
  readonly VITE_DD_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
