# Portafolio creativo 3D

Portafolio interactivo de **Juan Camilo Cabezas Montoya**, ingeniero de sistemas. La portada combina React, Vite y React Three Fiber con un avatar FBX animado, controles de cámara restringidos e interfaz adaptable a pantallas pequeñas.

## Requisitos

- Node.js compatible con Vite 8
- npm

## Desarrollo local

```sh
npm install
npm run dev
```

## Verificación de producción

```sh
npm run lint
npm run build
npm run preview
```

## Tecnologías

- React y Vite
- React Three Fiber y Three.js
- `@react-three/drei` (`useFBX`, `useAnimations`, `OrbitControls`)

El avatar animado se carga desde `public/model/FBX/Unarmed Walk Forward.fbx`. En la escena también se utilizan iluminación, animación con `useFrame` y una geometría interactiva.

## Atribución y licencia del modelo de vehículo

La carpeta `public/model/` también contiene el modelo de vehículo y sus texturas. Ese recurso está sujeto a la licencia **CC BY-NC 4.0** y requiere atribución; no se permite su uso comercial. El crédito solicitado está en [`public/model/license.txt`](./public/model/license.txt). Esta restricción corresponde al modelo de vehículo, no al avatar FBX.
