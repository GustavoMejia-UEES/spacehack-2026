# 📦 STRUCTURE - Character Module Refactored

## Descripción General

Módulo **3D Character** standalone y exportable para React/Vite.

- ✅ Componentes sin audio (puro visual)
- ✅ Soporte para cualquier modelo .glb
- ✅ Mobile-first responsive design
- ✅ Animaciones automáticas detectadas
- ✅ Totalmente reutilizable en otros proyectos

---

## Estructura de Archivos

```
src/features/character/
│
├── 📁 components/
│   ├── FloatingCharacter3D.tsx          [260 líneas]
│   │   ├─ Componente principal
│   │   ├─ Canvas 3D + ChatBubble overlay
│   │   ├─ Responsive positioning (móvil/desktop)
│   │   ├─ Props: modelPath, position, size, isAnimating, message
│   │   └─ Usa: GenericModel + ChatBubble
│   │
│   ├── GenericModel.tsx                 [200+ líneas] ⭐ NUEVO
│   │   ├─ Cargador universal de modelos .glb
│   │   ├─ Detección automática de animaciones
│   │   ├─ CrossFade 0.5s entre animaciones
│   │   ├─ useGLTF + useAnimations hooks
│   │   └─ Sin dependencias de modelos específicos
│   │
│   ├── ChatBubble.tsx                   [150+ líneas]
│   │   ├─ Burbuja de mensajes overlay
│   │   ├─ Mobile-first (centered top vs desktop near-head)
│   │   ├─ Colores según tipo: alert/warning/info
│   │   ├─ Indicador LIVE pulsante
│   │   └─ Pointer visual solo en desktop
│   │
│   ├── N8NInput.tsx                     [Opcional]
│   │   └─ Integración con N8N webhook (para futuro)
│   │
│   ├── SatelliteNotification.tsx        [Mantener]
│   ├── CharacterControls.tsx            [Mantener]
│   └── CharacterViewer.tsx              [Mantener]
│
├── 📁 hooks/
│   ├── useSatelliteMessages.ts          [160+ líneas]
│   │   ├─ Gestiona estado de mensajes
│   │   ├─ Mock messages automáticos c/12s
│   │   ├─ Soporte mensajes externos (N8N, Socket)
│   │   ├─ Auto-dismiss después 6s
│   │   ├─ SIN lógica de audio
│   │   └─ Interfaz: SatelliteMessage (sin audioUrl)
│   │
│   └── useCharacterAnimations.ts        [Placeholder]
│
├── 📁 models/
│   └── [Se depende de GenericModel.tsx]
│
├── 📁 types/
│   └── [Tipos compartidos]
│
├── 📄 HOW_TO_CHANGE_MODEL.md            [Guía 3 pasos] ⭐ NUEVO
│   ├─ Prerequisitos
│   ├─ Exportar desde Blender
│   ├─ Copiar archivo .glb
│   ├─ Actualizar componente
│   ├─ Troubleshooting
│   └─ FAQ animaciones
│
├── 📄 CHARACTER_MODULE_GUIDE.md         [Documentación] ⭐ NUEVO
│   ├─ Arquitectura interna
│   ├─ Componentes detallados
│   ├─ Flujo de datos
│   ├─ Personalización
│   ├─ Exportabilidad
│   ├─ Debugging
│   └─ Próximos pasos
│
└── 📄 STRUCTURE.md                      [Este archivo] ⭐ NUEVO
    └─ Resumen de archivos y cambios
```

---

## 🔄 Cambios Principales vs Anterior

### ❌ Eliminado

- **Audio Logic**: `audioRef.current`, `Audio()` elements
- **Fox.tsx específico**: Ahora `GenericModel.tsx` (universal)
- **Hardcoded model path**: Antes `/models/FoxPreview.glb` → Ahora prop dinámico

### ✅ Agregado

- **GenericModel.tsx**: Cargador reusable universal
- **JSDoc extenso**: Documentación inline en cada archivo
- **Mobile-first improvements**: ChatBubble mejorado
- **HOW_TO_CHANGE_MODEL.md**: Guía práctica
- **CHARACTER_MODULE_GUIDE.md**: Documentación arquitectónica

### 🔧 Refactorizado

- **FloatingCharacter3D**: Ahora acepta `modelPath` prop
- **ChatBubble**: Mejor responsive design
- **useSatelliteMessages**: Sin audio, simplificado

---

## 📋 Tamaños de Archivo

| Archivo                   | Líneas | Propósito              |
| ------------------------- | ------ | ---------------------- |
| FloatingCharacter3D.tsx   | ~260   | Canvas 3D principal    |
| GenericModel.tsx          | ~200   | Cargador universal     |
| ChatBubble.tsx            | ~150   | Burbuja de chat        |
| useSatelliteMessages.ts   | ~160   | Hook de mensajes       |
| HOW_TO_CHANGE_MODEL.md    | ~150   | Guía rápida            |
| CHARACTER_MODULE_GUIDE.md | ~400+  | Documentación completa |

**Total: ~1320 líneas de código + documentación**

---

## 🚀 Uso Rápido

### Uso Básico

```jsx
import { FloatingCharacter3D } from './features/character/components/FloatingCharacter3D'

export default function App() {
  return (
    <FloatingCharacter3D
      modelPath="/models/MiModelo.glb"
      position="bottom-right"
      size="md"
    />
  )
}
```

### Con Mensajes

```jsx
import { useSatelliteMessages } from './features/character/hooks/useSatelliteMessages'

function App() {
  const { activeMessage, isAnimating, dismissMessage } =
    useSatelliteMessages(true)

  return (
    <FloatingCharacter3D
      modelPath="/models/MiModelo.glb"
      message={activeMessage}
      isAnimating={isAnimating}
      onDismissMessage={dismissMessage}
    />
  )
}
```

---

## 🔗 Dependencias Requeridas

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "three": "*",
  "@react-three/fiber": "*",
  "@react-three/drei": "*",
  "tailwindcss": "^4.0.0"
}
```

**Nota**: Todas están probablemente ya en tu package.json. Si no:

```bash
npm install three @react-three/fiber @react-three/drei
```

---

## 📦 Exportabilidad Checklist

- ✅ Sin imports de archivos hardcodeados (todo es prop-based)
- ✅ Sin dependencies externas raras
- ✅ Sin imports from `@/` paths (usar relativos)
- ✅ Componentes sin estado global (solo props + local state)
- ✅ Funciona con copy-paste a otro proyecto
- ✅ public/models/ es configurable

**Para usar en otro proyecto:**

```bash
cp -r character/ /otro-proyecto/src/features/
cd /otro-proyecto
npm install three @react-three/fiber @react-three/drei
# ¡Listo! Usar como en "Uso Rápido"
```

---

## 🎓 Archivo a Leer Primero

1. **Si quieres cambiar de modelo**: → `HOW_TO_CHANGE_MODEL.md`
2. **Si quieres entender la arquitectura**: → `CHARACTER_MODULE_GUIDE.md`
3. **Si quieres ver el código**: → `FloatingCharacter3D.tsx` (punto de entrada)

---

## ✅ Validación Pre-Deployment

- [ ] Componentes compilan sin errores (npm run build)
- [ ] ChatBubble responsive en móvil (<640px)
- [ ] Modelo .glb se carga correctamente
- [ ] Animaciones se detectan en consola
- [ ] No hay imports rotos

---

## 🐛 Debugging Rápido

```bash
# Ver si hay errores de compilación
npm run build

# En navegador (F12 > Console)
# Busca:
# 📦 [path] Animaciones detectadas: [...]
# ▶️ Animación: ...
# 📡 Mensaje...
```

---

## 🎯 Próximas Mejoras (Futuro)

- [ ] Agregar audio con Web Speech API
- [ ] Socket.io para mensajes en tiempo real
- [ ] Gestos del ratón (head tracking)
- [ ] Lip-sync animation
- [ ] Performance optimization (LOD levels)

---

**Última actualización**: 26/03/2025
**Estado**: ✅ Refactorización completada
**Versión**: 2.0 (Standalone Exportable)
