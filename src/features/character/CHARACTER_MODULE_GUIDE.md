# 🏗️ CHARACTER MODULE - GUÍA DE ARQUITECTURA INTERNA

## Estructura del Módulo

```
src/features/character/
├── components/
│   ├── FloatingCharacter3D.tsx      ⭐ Componente principal (entrada)
│   ├── GenericModel.tsx             ⭐ Cargador universal de modelos
│   ├── ChatBubble.tsx               💬 Burbuja de mensajes
│   ├── N8NInput.tsx                 🌐 Integración N8N (opcional)
│   └── [otros componentes]
├── hooks/
│   ├── useSatelliteMessages.ts      📡 Gestor de mensajes
│   └── useCharacterAnimations.ts    🎬 (placeholder)
├── models/
│   └── GenericModel.tsx derivado
├── types/
│   └── [tipos compartidos]
├── HOW_TO_CHANGE_MODEL.md           📖 Guía rápida (3 pasos)
└── CHARACTER_MODULE_GUIDE.md        📚 Este archivo
```

---

## 🎯 Componentes Principales

### 1. **FloatingCharacter3D.tsx**

**Propósito:** Componente principal que renderiza todo (canvas 3D + burbuja de chat)

**Props:**

```typescript
interface FloatingCharacter3DProps {
  modelPath: string // "/models/MiModelo.glb"
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'sm' | 'md' | 'lg'
  isAnimating?: boolean // Activa/desactiva animación
  message?: SatelliteMessage | null
  animationAction?: string // "walk", "run", etc.
  onDismissMessage?: () => void
}
```

**¿Cómo funciona internamente?**

1. **Canvas 3D** (React Three Fiber)
   - `HeadPositionTracker`: Rastrea la cabeza del modelo 3D y proyecta su posición a 2D para la burbuja
   - `GenericModel`: Carga y anima el modelo .glb
   - `Float`: Hace flotar el modelo suavemente
   - `Environment`: Iluminación automática

2. **ChatBubble Overlay**
   - Se posiciona diferente en móvil (centered top) vs desktop (cerca de la cabeza)
   - Recibe screenX/screenY del HeadPositionTracker

**Código de ejemplo (Uso):**

```jsx
function DemoPage() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [message, setMessage] = (useState < SatelliteMessage) | (null > null)

  return (
    <FloatingCharacter3D
      modelPath="/models/Fox.glb"
      position="bottom-right"
      size="md"
      isAnimating={isAnimating}
      message={message}
      onDismissMessage={() => setMessage(null)}
    />
  )
}
```

---

### 2. **GenericModel.tsx**

**Propósito:** Componente reutilizable que carga cualquier .glb y detecta animaciones automáticamente

**Props:**

```typescript
interface GenericModelProps {
  modelPath: string // Ruta relativa a /public
  action?: string // Nombre de animación
  isAnimating?: boolean // Si debe ejecutarse
  scale?: number | [number, number, number]
  position?: [number, number, number]
  onAnimationsLoaded?: (names: string[]) => void
}
```

**Lógica de Animaciones:**

```
IsAnimating: true + action: "walk"
    ↓
useAnimations hook detecta todas las animaciones
    ↓
Busca una llamada "walk" en la lista
    ↓
Hace CrossFade (0.5s) a la animación "walk"
    ↓
Ejecuta ▶️


IsAnimating: false
    ↓
CrossFade (0.5s) a la primera animación (IDLE)
    ↓
Ejecuta IDLE ▶️
```

**Console output útil:**

```
📦 [/models/Fox.glb] Animaciones detectadas: ["Idle", "Walk", "Run"]
▶️ Animación: "Walk"
▶️ Volviendo a: "Idle"
```

---

### 3. **ChatBubble.tsx**

**Propósito:** Overlay visual para mostrar mensajes

**Características Mobile-First:**

- **Móvil (<640px)**
  - Se centra en la parte superior
  - Usa 90% del ancho
  - Sin pointer (tail)
  - Tap para cerrar

- **Desktop (≥640px)**
  - Se posiciona cerca de la cabeza del modelo
  - Incluye pointer visual
  - Botón cerrar en esquina

**Colores según tipo:**

```javascript
{
  alert: { bg: rgba(127, 29, 29, 0.9), border: rgba(248, 113, 113, 1) }
  warning: { bg: rgba(120, 53, 15, 0.9), border: rgba(251, 146, 60, 1) }
  info: { bg: rgba(30, 58, 138, 0.9), border: rgba(96, 165, 250, 1) }
}
```

---

### 4. **useSatelliteMessages.ts**

**Propósito:** Hook que gestiona el estado de mensajes

**API:**

```typescript
const {
  messages, // Array de todos los mensajes
  activeMessage, // El mensaje actual (null si no hay)
  isAnimating, // Si el personaje está animando
  dismissMessage, // Función para cerrar el mensaje
} = useSatelliteMessages(
  (enabled = true), // Activa mock messages automáticos
  externalMessage, // Mensaje externo (N8N, Socket, etc.)
)
```

**Flujo temporal:**

```
Message llega (mock o externo)
    ↓
activeMessage = message
    ↓
isAnimating = true
    ↓
[6 segundos de espera]
    ↓
activeMessage = null
    ↓
isAnimating = false
```

**Para integrar N8N:**

```jsx
const [n8nMessage, setN8nMessage] = useState<SatelliteMessage | null>(null)

const { activeMessage, isAnimating } = useSatelliteMessages(
  false,            // Desactiva mock messages
  n8nMessage        // Usa mensaje de N8N
)

// Cuando llegue respuesta de N8N:
const handleN8NResponse = (text: string) => {
  setN8nMessage({
    id: `n8n-${Date.now()}`,
    timestamp: Date.now(),
    type: 'info',
    title: '[N8N] Respuesta',
    content: text,
    icon: '🤖'
  })
}
```

---

## 🔄 Flujo de Datos Típico

### Escenario: Usuario hace clic en botón, se muestra mensaje

```
User Click
    ↓
setIsAnimating(true)
    ↓
FloatingCharacter3D recibe prop isAnimating
    ↓
setShowBubble(true)
    ↓
HeadPositionTracker calcula posición de cabeza
    ↓
ChatBubble recibe screenX, screenY
    ↓
Se renderiza bubble en la posición correcta
    ↓
GenericModel recibe action prop
    ↓
useAnimations busca y ejecuta la animación
    ↓
[6 segundos después, useSatelliteMessages auto-dismisses]
    ↓
activeMessage = null
    ↓
setShowBubble(false)
    ↓
Vuelta a IDLE animation
```

---

## 🎨 Personalización

### Cambiar posición inicial

**Archivo:** `FloatingCharacter3D.tsx`, línea ~69

```javascript
const positionConfig = {
  'bottom-right': 'bottom-2 sm:bottom-4 right-2 sm:right-4',  ← AQUÍ
  'bottom-left': 'bottom-2 sm:bottom-4 left-2 sm:left-4',
  'top-right': 'top-2 sm:top-4 right-2 sm:right-4',
  'top-left': 'top-2 sm:top-4 left-2 sm:left-4',
}
```

**Unidades Tailwind:**

- `bottom-2` = 0.5rem (8px)
- `bottom-4` = 1rem (16px)
- `bottom-8` = 2rem (32px)
- `sm:` = breakpoint móvil (≥640px)

### Cambiar tamaño base del modelo

**Archivo:** `FloatingCharacter3D.tsx`, línea ~53

```javascript
const sizeConfig = {
  sm: {
    scale: 0.3, // 30% del tamaño original ← AQUÍ
  },
  md: {
    scale: 0.5, // 50%
  },
  lg: {
    scale: 0.7, // 70%
  },
}
```

### Cambiar colores de burbuja

**Archivo:** `ChatBubble.tsx`, línea ~55

```javascript
const getBgColor = (type: string) => {
  switch (type) {
    case 'alert':
      return {
        bg: 'rgba(127, 29, 29, 0.9)',      ← RGBA (R, G, B, Alpha)
        border: 'rgba(248, 113, 113, 1)'
      }
    // ...
  }
}
```

---

## 🚀 Exportabilidad: Cómo Copiar a Otro Proyecto

### Paso 1: Copiar carpeta

```bash
cp -r src/features/character/ /otro-proyecto/src/features/character/
```

### Paso 2: Instalar dependencias (si no las tiene)

```bash
npm install three @react-three/fiber @react-three/drei
```

### Paso 3: Asegurar que public/models/ existe

```bash
mkdir -p public/models/
```

### Paso 4: Usar el componente

```jsx
import { FloatingCharacter3D } from './features/character/components/FloatingCharacter3D'

function App() {
  return (
    <FloatingCharacter3D
      modelPath="/models/TuModelo.glb"
      position="bottom-right"
    />
  )
}
```

✅ **¡Listo! Sin cambios adicionales necesarios.**

---

## 🐛 Debugging

### Ver todas las animaciones disponibles

Abre consola (F12) y busca:

```
📦 [/models/MiModelo.glb] Animaciones detectadas: [...]
```

### Ver estado de animación en tiempo real

Agrega esto en FloatingCharacter3D:

```jsx
useEffect(() => {
  console.log('🎬 isAnimating:', isAnimating)
  console.log('💬 activeMessage:', activeMessage)
}, [isAnimating, activeMessage])
```

### Ver posición de cabeza proyectada

En HeadPositionTracker:

```jsx
console.log(`Head projected to: X=${screenX}, Y=${screenY}`)
```

---

## 📊 Dependencias

```json
"dependencies": {
  "react": "^19.2.0",              // Core
  "react-dom": "^19.2.0",
  "three": "latest",               // 3D Graphics
  "@react-three/fiber": "latest",  // React + Three.js bridge
  "@react-three/drei": "latest",   // Utilities (Float, Environment, etc)
  "tailwindcss": "^4.0.0"          // Responsive styles
}
```

---

## 🎓 Próximos Pasos

### Para agregar Audio (futuro)

1. Crear nuevo hook: `useCharacterAudio.ts`
2. En useSatelliteMessages, agregar `audioUrl?: string`
3. Reproducir audio con Web Speech API o ElevenLabs
4. Sincronizar con animación lip-sync (si el modelo lo soporta)

### Para Socket.io (futuro)

```jsx
useEffect(() => {
  socket.on('message', (data) => {
    setExternalMessage({
      id: data.id,
      content: data.text,
      // ...
    })
  })
}, [])
```

### Para Gestos del Ratón (futuro)

```jsx
const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

// En GenericModel: rotar modelo según ratón
```

---

## 📞 Contacto / Soporte

Ver `HOW_TO_CHANGE_MODEL.md` para guía rápida.

Todos los componentes tienen **JSDoc detallado** en su cabecera. ¡Léelos!
