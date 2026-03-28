# 🦊 Cómo Cambiar de Modelo en 3 Pasos

## Introducción

Este guía te muestra cómo cambiar el modelo 3D del personaje flotante de un .glb a otro en **3 sencillos pasos**.

---

## **PASO 1: Preparar tu modelo .glb**

### Opción A: Tienes un modelo en Blender

1. Abre tu modelo en **Blender**
2. Selecciona todo: `Ctrl+A` (Select All)
3. Exporta como glTF 2.0:
   - **File** → **Export** → **glTF 2.0 (.glb/.gltf)**
   - Marca: ✅ **Export Animations** (importante para que se incluyan)
   - Filename: `MiModelo.glb`
   - Click **Export glTF 2.0**

### Opción B: Ya tienes un .glb

- Listo para el paso 2

---

## **PASO 2: Copiar el archivo a la carpeta public**

```bash
# Copia tu archivo .glb aquí:
public/models/MiModelo.glb
```

**Estructura esperada:**

```
spacehack-app/
├── public/
│   └── models/
│       ├── FoxPreview.glb      (modelo anterior)
│       └── MiModelo.glb        (tu modelo nuevo) ← AQUÍ
├── src/
│   └── features/
│       └── character/
│           ├── components/
│           ├── hooks/
│           └── ...
```

---

## **PASO 3: Actualizar el componente**

### En el archivo donde uses FloatingCharacter3D:

**ANTES:**

```jsx
<FloatingCharacter3D
  modelPath="/models/FoxPreview.glb"
  size="md"
  position="bottom-right"
/>
```

**DESPUÉS:**

```jsx
<FloatingCharacter3D
  modelPath="/models/MiModelo.glb"    ← ¡Cambiar aquí!
  size="md"
  position="bottom-right"
/>
```

✅ **¡Listo! Tu modelo debería aparecer.**

---

## 🔍 Troubleshooting

### El modelo no aparece

1. Verifica que el archivo exista en `public/models/`
2. Abre la **consola del navegador** (F12)
3. Busca errores como:
   ```
   Failed to load model: 404 /models/MiModelo.glb
   ```
   → Comprueba que el nombre del archivo sea exacto

### El modelo es demasiado grande/pequeño

1. Abre [FloatingCharacter3D.tsx](src/features/character/components/FloatingCharacter3D.tsx)
2. Busca `sizeConfig`:
   ```jsx
   const sizeConfig = {
     md: {
       scale: 0.5,  ← Aumenta a 1, reduce a 0.2
     }
   }
   ```
3. Recarga el navegador

### El modelo está rotado raro

- Edita tu modelo en Blender y aplica **Apply All Transforms**
- O ajusta la posición en GenericModel.tsx

### No veo las animaciones en la consola

1. En la consola, busca:
   ```
   📦 [/models/MiModelo.glb] Animaciones detectadas: [...]
   ```
2. Si está vacío, tu modelo no tiene animaciones
3. Propiedades esperadas:
   - Primera animación = **idle** (automática)
   - Otras animaciones = nombres como "walk", "run", "talk"

### Quiero cambiar qué animación se ejecuta

En el componente, pasa el prop `animationAction`:

```jsx
<FloatingCharacter3D
  modelPath="/models/MiModelo.glb"
  animationAction="walk"   ← Nombre de la animación
  isAnimating={true}
/>
```

---

## 📚 Recursos

- [FloatingCharacter3D.tsx](src/features/character/components/FloatingCharacter3D.tsx) - Componente principal
- [GenericModel.tsx](src/features/character/components/GenericModel.tsx) - Cargador de modelos universal
- [ChatBubble.tsx](src/features/character/components/ChatBubble.tsx) - Burbuja de mensajes

---

## ¿Preguntas?

Revisa el archivo `CHARACTER_MODULE_GUIDE.md` para documentación completa sobre cómo funciona el sistema interno.
