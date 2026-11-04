# Frontend

Aplicación React con TypeScript, Vite y Tailwind CSS.

## Ejecución local

Desde esta carpeta, con Node.js 22.12 o superior:

```powershell
npm.cmd install
npm.cmd run dev
```

Abrir http://localhost:8443. El servidor usa ese puerto de forma estricta;
si ya está ocupado por esta aplicación, utilizar el servidor existente.

En PowerShell se usa `npm.cmd` para evitar bloqueos de `npm.ps1` por la
política de ejecución de scripts.

## Compilación

```powershell
npm.cmd run build
npm.cmd exec tsc -- --noEmit
```

La compilación se genera en `dist`.
