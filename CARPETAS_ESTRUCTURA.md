# 📁 CARPETAS_ESTRUCTURA - Organización del Proyecto

> Entender dónde está cada cosa y cómo está organizado el proyecto.

---

## 🏗️ Estructura General del Proyecto

```
spacehack-app/
├── app/                              ← Configuración TanStack Start
├── public/
│   └── models/                       ← 🎨 Modelos 3D .glb
│       ├── Fox.glb                   ← Modelo default
│       └── [tus modelos aquí]
├── src/
│   ├── api/                          ← Backend endpoints
│   ├── components/                   ← Componentes compartidos
│   ├── features/                     ← 🎯 Features independientes
│   │   └── character/                ← 🦊 MÓDULO PERSONAJE 3D
│   │       ├── components/
│   │       ├── hooks/
│   │       └── index.ts
│   ├── routes/                       ← Rutas de la app
│   ├── styles/                       ← CSS global
│   └── main.tsx                      ← Entry point
├── dist/                             ← Build output
├── node_modules/                     ← Dependencias
├── package.json                      ← Scripts y dependencias
├── vite.config.ts                    ← Config Vite
└── tsconfig.json                     ← Config TypeScript
```

---

## 🎯 MÓDULO CHARACTER - Estructura Detallada

Este es el módulo que refactorizaste. Aquí encontrarás todo lo del personaje 3D:

```
src/features/character/
│
├── components/
│   ├── FloatingCharacter3D.tsx      ← 🎬 COMPONENTE PRINCIPAL
│   │   Purpose:  Renderiza personaje 3D + burbuja de chat
│   │   Props:    modelPath, position, size, isAnimating, message, etc
│   │   Tamaño:   ~260 líneas
│   │   Contiene:
│   │     - Canvas 3D (@react-three/fiber)
│   │     - HeadPositionTracker (3D→2D projection)
│   │     - Renderiza GenericModel internamente
│   │
│   ├── GenericModel.tsx              ← 🔧 CARGADOR UNIVERSAL DE MODELOS
│   │   Purpose:  Carga .glb y auto-detecta animaciones
│   │   Props:    modelPath, action, isAnimating, scale, position
│   │   Tamaño:   ~200 líneas
│   │   Features:
│   │     - useGLTF() → Carga modelo
│   │     - useAnimations() → Detecta animaciones
│   │     - CrossFade 0.5s smooth transitions
│   │     - Logs: "📦 [path] Animaciones detectadas: [...]"
│   │
│   └── ChatBubble.tsx                ← 💬 BURBUJA DE MENSAJES
│       Purpose:  Overlay de mensajes/chat
│       Props:    message, isVisible, isMobile, position
│       Tamaño:   ~150 líneas
│       Features:
│         - Mobile-first responsive
│         - Colores: alert, warning, info
│         - LIVE pulsing indicator
│         - Pointer tail en desktop
│
├── hooks/
│   ├── useSatelliteMessages.ts       ← 📡 GESTOR DE MENSAJES
│   │   Purpose:  State management para mensajes
│   │   Tamaño:   ~160 líneas
│   │   Removed:  ❌ Audio logic (todo removido)
│   │   Features:
│   │     - Mock messages rotation
│   │     - External message support
│   │     - Auto-dismiss 6s
│   │     - Returns: { messages, activeMessage, isAnimating, dismissMessage }
│   │
│   └── [más hooks futuros]
│
├── index.ts                          ← 📤 EXPORTS
│   Expone:
│     - FloatingCharacter3D
│     - useSatelliteMessages
│     - ChatBubble (si necesitas usar directo)
│
└── 📄 DOCUMENTACIÓN
    ├── HOW_TO_CHANGE_MODEL.md        ← Guía rápida
    ├── CHARACTER_MODULE_GUIDE.md     ← Arquitectura completa
    ├── STRUCTURE.md                  ← Resumen cambios
    └── README_REFACTORING.md         ← Entrega
```

---

## 📊 Mapeo de Carpetas Importantes

### 1️⃣ Public - Assets Estáticos

```
public/
├── models/
│   ├── Fox.glb                       ← Modelo default (usado en demos)
│   └── [TUS MODELOS]                 ← Aquí copias nuevos personajes
├── fonts/
├── images/
└── [otros assets]
```

**Cómo agregar un modelo:**

1. Copia tu archivo `.glb` a `public/models/`
2. Usa en código: `modelPath="/models/TuModelo.glb"`

---

### 2️⃣ Src/Routes - Páginas y Demos

```
src/routes/
├── demo/
│   ├── DemoPage.tsx                  ← 🎮 PÁGINA CON DEMOSTRACIÓN
│   │   Aquí se ve FloatingCharacter3D en acción
│   │   Muestra el personaje posicionado bottom-right
│   │   Incluye ejemplos de uso
│   │
│   └── [más demos]
├── about/
├── api/
└── [más rutas]
```

**Para ver tu personaje en acción:**

```
1. npm run dev
2. Abre: http://localhost:5173/demo
3. Verás el personaje 3D en pantalla
```

---

### 3️⃣ Src/Components - Global Shared Components

```
src/components/
├── Header.tsx
├── Footer.tsx
├── Layout.tsx
└── [componentes globales]
```

Los componentes locales del módulo character están en `src/features/character/components/`.

---

### 4️⃣ Src/Api - Backend Integration

```
src/api/
├── client.ts                         ← Configuración API
├── endpoints/
│   ├── character.ts                  ← Endpoints para personaje (futuro)
│   ├── chat.ts                       ← Endpoints para mensajes (futuro)
│   └── [más endpoints]
└── [tipos y utilis]
```

Aquí conectarías con backend para obtener:

- Mensajes dinámicos del servidor
- Configuración del personaje
- Datos de animaciones

---

### 5️⃣ Src/Styles - CSS Global

```
src/styles/
├── globals.css                       ← Estilos globales
├── tailwind.config.ts                ← Configuración Tailwind
├── [variables, temas]
└── [más CSS]
```

FloatingCharacter3D usa **Tailwind CSS**. Classes como `absolute bottom-8 right-8 z-40` vienen de aquí.

---

## 🔄 Flow de Datos - Cómo Se Comunican Los Archivos

```
┌─────────────────────────────────────────────────────────┐
│ DemoPage.tsx (o tu página que use el personaje)         │
│ ├─ Imports: FloatingCharacter3D, useSatelliteMessages  │
│ ├─ State: activeMessage, isAnimating, dismissMessage   │
│ └─ JSX: <FloatingCharacter3D modelPath=... message=... │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────┐
    │ FloatingCharacter3D.tsx              │
    │ ├─ Props: modelPath, message, etc   │
    │ ├─ Canvas 3D setup                  │
    │ └─ Imports: GenericModel, ChatBubble│
    └──┬────────────────┬──────────────────┘
       │                │
       ▼                ▼
  ┌────────────┐  ┌──────────────────┐
  │GenericModel│  │  ChatBubble      │
  │────────────│  │──────────────────│
  │- useGLTF() │  │- Overlay message │
  │- useAnimat │  │- LIVE indicator  │
  │- Logs: 📦 │  │- Socket position │
  └────────────┘  └──────────────────┘
```

---

## 🎓 Cómo Encontrar Código Específico

### ❓ "¿Dónde está la lógica de animaciones?"

→ `src/features/character/components/GenericModel.tsx` línea 120-140

### ❓ "¿Dónde está el detector de modelos?"

→ `src/features/character/components/GenericModel.tsx` línea 40-60 (useGLTF)

### ❓ "¿Dónde está el responsivo mobile?"

→ `src/features/character/components/ChatBubble.tsx` línea 50-80 (isMobile logic)

### ❓ "¿Dónde está el 3D canvas setup?"

→ `src/features/character/components/FloatingCharacter3D.tsx` línea 80-120 (Canvas component)

### ❓ "¿Dónde se exportan los componentes?"

→ `src/features/character/index.ts`

---

## 📦 Build Output

Después de `npm run build`:

```
dist/
├── client/                           ← Frontend compilado
│   ├── assets/                       ← JS, CSS bundles
│   ├── index.html                    ← Entry HTML
│   └── [recursos]
└── server/                           ← Backend compilado (si aplica)
```

El personaje 3D se incluye en:

- `assets/[hash].js` → Código compilado
- `assets/[hash].css` → Estilos compilados
- Los modelos `.glb` se sirven desde `public/` (no se bundleean)

---

## 🚀 Flujo Dev → Build → Deploy

```
1. DESARROLLO (npm run dev)
   ├─ Vite dev server en :5173
   ├─ Hot reload automático
   ├─ Modelos se cargan desde public/models/
   └─ Ves errores en tiempo real en consola

2. BUILD (npm run build)
   ├─ TypeScript check
   ├─ Compilación a dist/
   ├─ Minificación de código
   └─ Verifica no hay errores

3. PREVIEW (npm run preview)
   ├─ Sirve dist/ localmente
   ├─ Simula producción
   └─ Verifica que funciona después del build

4. DEPLOY
   ├─ dist/client/ → CDN o server web
   ├─ dist/server/ → Backend (si aplica)
   └─ public/models/ → Static assets
```

---

## 📋 Checklist - Qué Cambió vs Original

| Archivo                   | Cambio                                         | Estado         |
| ------------------------- | ---------------------------------------------- | -------------- |
| `FloatingCharacter3D.tsx` | Completamente refactorizado + modelPath prop   | ✅ NUEVO       |
| `GenericModel.tsx`        | Creado nuevo (cargador universal)              | ✅ NUEVO       |
| `ChatBubble.tsx`          | Mejorado mobile-first                          | ✅ ACTUALIZADO |
| `useSatelliteMessages.ts` | Audio removido, simplificado                   | ✅ ACTUALIZADO |
| `index.ts`                | Exports actualizados                           | ✅ ACTUALIZADO |
| `Fox.tsx`                 | ❌ YA NO SE USA (reemplazado por GenericModel) | 🗑️ REMOVIDO    |
| Build                     | 5 errores TS fixes, build limpio               | ✅ VALIDADO    |

---

## 🧩 Dependencias Clave

En `package.json`:

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "@react-three/fiber": "^9.x",      ← 3D Canvas
    "@react-three/drei": "^9.x",       ← 3D Utils
    "three": "^r168",                  ← Three.js
    "tailwindcss": "^4.x",             ← Estilos
    "typescript": "^5.x"               ← Type checking
  }
}
```

**Importante**: Si cambias versiones, recorre `package.json` y ejecuta:

```bash
npm install
npm run build  # Verifica compatibility
```

---

## ✅ Próximos Pasos

1. **Agregar modelos**: Copia .glb a `public/models/`
2. **Usar en tu página**: Import `FloatingCharacter3D` de `@/features/character`
3. **Conectar con API**: Usa `useEffect` para cargar datos del servidor
4. **Deploy**: Verifica que `dist/` se suba con `public/models/`

---

## 🔗 Documentación Relacionada

- **HOW_TO_CHANGE_MODEL.md** ← Guía rápida para cambiar modelos
- **CHARACTER_MODULE_GUIDE.md** ← Arquitectura técnica profunda
- **PERSONAJE_3D_SETUP.md** ← Guía de uso (animaciones, mensajes, etc)
- **README.md** ← Quick start

¡Listo! 🚀
