# 🦊 PERSONAJE 3D SETUP - Guía Completa

> Cómo usar el personaje flotante 3D, cambiar modelos y animar.

---

## 📍 Ubicación en el Proyecto

El módulo de personaje 3D está aquí:

```
src/features/character/
├── components/
│   ├── FloatingCharacter3D.tsx      ← Componente principal
│   ├── GenericModel.tsx             ← Cargador de modelos .glb
│   └── ChatBubble.tsx               ← Burbuja de mensajes
├── hooks/
│   └── useSatelliteMessages.ts      ← Gestor de mensajes
└── [documentación]
```

---

## 🚀 USO BÁSICO

### Paso 1: Importar el Componente

```jsx
import { FloatingCharacter3D } from '@/features/character'

function App() {
  return (
    <FloatingCharacter3D
      modelPath="/models/Fox.glb"
      position="bottom-right"
      size="md"
    />
  )
}
```

### Paso 2: Props Disponibles

```jsx
<FloatingCharacter3D
  // 📍 MODELO (REQUERIDO)
  modelPath="/models/MiModelo.glb"
  // 📍 POSICIÓN (opcional)
  position="bottom-right" // bottom-right, bottom-left, top-right, top-left
  // 📍 TAMAÑO (opcional)
  size="md" // sm (pequeño), md (medio), lg (grande)
  // 📍 ANIMACIONES (opcional)
  isAnimating={true} // true = ejecutar animación, false = idle
  animationAction="walk" // Nombre de la animación
  // 📍 MENSAJES (opcional)
  message={activeMessage}
  onDismissMessage={() => setMessage(null)}
/>
```

---

## 🎬 Animaciones - Cómo Funcionan

### 1. **Detección Automática**

Cuando cargas un modelo, las animaciones se detectan automáticamente:

```javascript
// En browser console (F12), verás:
📦 [/models/MiModelo.glb] Animaciones detectadas: [
  "Idle",
  "Walk",
  "Run",
  "Talk"
]
```

### 2. **Ejecutar una Animación**

```jsx
const [isAnimating, setIsAnimating] = useState(false)

useEffect(() => {
  setIsAnimating(true) // Inicia animación

  setTimeout(() => {
    setIsAnimating(false) // Vuelve a Idle
  }, 3000)
}, [])

return (
  <FloatingCharacter3D
    modelPath="/models/MiModelo.glb"
    isAnimating={isAnimating}
    animationAction="talk" // ← Nombre de animación
  />
)
```

### 3. **Transiciones Suaves**

Las transiciones entre animaciones son automáticas (0.5s crossfade suave):

- Si `isAnimating=true` + `animactionAction="walk"` → Cambia a walk
- Si `isAnimating=false` → Vuelve a primera animación (Idle)

---

## 📦 Cambiar de Modelo .glb

### Opción A: Desde Blender

1. **Abre tu modelo en Blender**
2. **Crea animaciones** o verifica que las tenga
3. **Exporta como glTF 2.0**:
   - File → Export → glTF 2.0 (.glb)
   - ✅ Marca: "Export Animations"
   - Filename: `MiPersonaje.glb`
   - Click "Export"

### Opción B: Si ya tienes un .glb

1. **Copia el archivo**

   ```
   public/models/MiPersonaje.glb
   ```

2. **Actualiza el código**

   ```jsx
   <FloatingCharacter3D
     modelPath="/models/MiPersonaje.glb"  ← CAMBIAR AQUÍ
     position="bottom-right"
   />
   ```

3. **Recarga el navegador** (F5)

### Opción C: Ver qué animaciones tiene tu modelo

Abre browser console (F12):

- Recarga página
- Busca: `📦 [/models/...] Animaciones detectadas:`
- Copia esos nombres para usar en `animationAction`

---

## 💬 Mensajes y Chat

### Usar Mensajes Mock (Auto)

```jsx
import { FloatingCharacter3D, useSatelliteMessages } from '@/features/character'

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

### Controlar Mensajes Manualmente

```jsx
import { useSatelliteMessages } from '@/features/character'

function App() {
  const [manualMessage, setManualMessage] = useState(null)

  // Desactiva mock messages (enabled=false) y usa mensaje manual
  const { activeMessage, isAnimating } = useSatelliteMessages(
    false, // Mock desactivado
    manualMessage, // Tu mensaje externo
  )

  const showMessage = () => {
    setManualMessage({
      id: 'msg-1',
      timestamp: Date.now(),
      type: 'info', // alert, warning, info
      title: '[SAT-INFO] Hola',
      content: 'Este es un mensaje personalizado',
      icon: '👋',
    })
  }

  return (
    <>
      <button onClick={showMessage}>Mostrar Mensaje</button>
      <FloatingCharacter3D
        modelPath="/models/MiModelo.glb"
        message={activeMessage}
        isAnimating={isAnimating}
      />
    </>
  )
}
```

---

## 📱 Responsive Design

### Tamaños Disponibles

```jsx
// Pequeño (móvil)
<FloatingCharacter3D size="sm" />
// w-40 sm:w-56 md:w-64 (ancho)
// h-40 sm:h-56 md:h-64 (alto)

// Medio (default)
<FloatingCharacter3D size="md" />
// w-56 sm:w-72 md:w-80
// h-56 sm:h-72 md:h-80

// Grande (desktop)
<FloatingCharacter3D size="lg" />
// w-72 sm:w-96 md:w-[33vw]
// h-72 sm:h-96 md:h-[33vh]
```

### Posiciones

```jsx
<FloatingCharacter3D position="bottom-right" />  // Esquina inferior derecha (default)
<FloatingCharacter3D position="bottom-left" />   // Esquina inferior izquierda
<FloatingCharacter3D position="top-right" />     // Esquina superior derecha
<FloatingCharacter3D position="top-left" />      // Esquina superior izquierda
```

**Mobile**: Automáticamente responsive

- En móvil (<640px): Se ajusta al tamaño de pantalla
- En desktop (≥640px): Tamaño fijo + más detalle

---

## 🎨 Estilos del Chat

### Colores Automáticos

```javascript
{
  alert:   { bg: rojo (rgba 127,29,29),      border: rojo claro }
  warning: { bg: naranja (rgba 120,53,15),   border: naranja claro }
  info:    { bg: azul (rgba 30,58,138),      border: azul claro }
}
```

Especifica el tipo en el mensaje:

```jsx
{
  type: 'alert',    // ← Determina color
  title: '[SAT-ALERT] Alerta',
  content: 'Algo importante',
  icon: '🛰️'
}
```

---

## 🐛 Troubleshooting

### El modelo no aparece

```bash
❌ Error: 404 /models/MiModelo.glb
✅ Solución: Verifica que el archivo esté en public/models/
```

### El modelo es muy grande/pequeño

```jsx
// Opción 1: Cambiar escala en sizeConfig
// src/features/character/components/FloatingCharacter3D.tsx
const sizeConfig = {
  md: { scale: 0.5 }, // 0.5 = 50%, prueba 0.3, 0.7, etc
}

// Opción 2: Editar en Blender
// Select All > Scale > 0.3 > Confirm
```

### No veo las animaciones en console

```javascript
// Abre F12 > Console
// Recarga página
// Busca: 📦 Animaciones detectadas:

// Si está vacío: Tu modelo no tiene animaciones
// Solución: Agregar animaciones en Blender o usar un modelo con animaciones
```

### El chat no se ve en móvil

```jsx
// Mobile: Se centra arriba, 90% ancho
// Desktop: Se posiciona cerca de la cabeza
// Normal, es behavior mobile-first diseñado así
```

---

## 📊 Ejemplo Completo

```jsx
import { useState } from 'react'
import { FloatingCharacter3D, useSatelliteMessages } from '@/features/character'

export function VirtualAssistant() {
  const [showCustomMessage, setShowCustomMessage] = useState(false)

  const { activeMessage, isAnimating, dismissMessage } = useSatelliteMessages(
    true, // Habilitar mock messages automáticos
    showCustomMessage
      ? {
          id: 'custom-1',
          timestamp: Date.now(),
          type: 'info',
          title: '[PERSONALIZADO] Hola!',
          content: 'Este es un mensaje personalizado',
          icon: '👋',
        }
      : null,
  )

  return (
    <div>
      <button
        onClick={() => setShowCustomMessage(true)}
        className="z-50 relative"
      >
        Mostrar Mensaje
      </button>

      <FloatingCharacter3D
        modelPath="/models/YourCharacter.glb"
        position="bottom-right"
        size="md"
        message={activeMessage}
        isAnimating={isAnimating}
        animationAction="talk"
        onDismissMessage={dismissMessage}
      />
    </div>
  )
}
```

---

## 🔗 Recursos Adicionales

- **Cambiar Modelo**: `src/features/character/HOW_TO_CHANGE_MODEL.md`
- **Arquitectura Interna**: `src/features/character/CHARACTER_MODULE_GUIDE.md`
- **Estructura de Carpetas**: `CARPETAS_ESTRUCTURA.md` (este repo)

---

## ✅ Próximos Pasos

1. ✅ Cambiar el modelo `/models/Fox.glb` a tu propio personaje
2. ✅ Configurar animaciones que quieras ejecutar
3. ✅ Ajustar posición y tamaño según necesites
4. ✅ Integrar con backend/API para mensajes dinámicos

¡Listo! 🚀
