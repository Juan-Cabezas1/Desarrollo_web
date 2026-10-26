import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls, useAnimations, useFBX } from '@react-three/drei'
import './App.css'

const MODEL_PATH = '/model/FBX/Unarmed Walk Forward.fbx'

function AnimatedAvatar() {
  const group = useRef(null)
  const fbx = useFBX(MODEL_PATH)
  const { actions } = useAnimations(fbx.animations, group)
  const actionName = Object.keys(actions)[0]

  useEffect(() => {
    const action = actions[actionName]
    action?.reset().fadeIn(0.3).play()

    return () => action?.fadeOut(0.3)
  }, [actions, actionName])

  useFrame(({ clock }) => {
    if (!group.current) return

    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.08
    group.current.position.y = -1.55 + Math.sin(clock.elapsedTime * 1.2) * 0.035
  })

  return (
    <group ref={group} position={[2.05, -1.55, 0]} scale={0.01}>
      <primitive object={fbx} />
    </group>
  )
}

function InteractiveShape() {
  const mesh = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  useFrame((_, delta) => {
    if (!mesh.current) return

    mesh.current.rotation.x += delta * 0.28
    mesh.current.rotation.y += delta * 0.42
    mesh.current.scale.setScalar(active ? 1.18 : hovered ? 1.08 : 1)
  })

  return (
    <mesh
      ref={mesh}
      position={[-1.35, 1.1, 0.2]}
      onClick={() => setActive((value) => !value)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[0.34, 1]} />
      <meshStandardMaterial
        color={active ? '#c9ff75' : hovered ? '#b5f4ff' : '#6d8dff'}
        metalness={0.55}
        roughness={0.24}
        wireframe={active}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[-3, 6, 5]} intensity={2.2} />
      <pointLight position={[3, 2, -2]} intensity={32} color="#637cff" />
      <Suspense fallback={null}>
        <AnimatedAvatar />
        <ContactShadows
          position={[2.05, -1.57, 0]}
          opacity={0.38}
          scale={4.5}
          blur={2.6}
          far={2.5}
          color="#090d1b"
        />
      </Suspense>
      <InteractiveShape />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-0.35}
        maxAzimuthAngle={0.35}
        target={[0, 0.25, 0]}
      />
    </>
  )
}

function App() {
  return (
    <main>
      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="hero-glow hero-glow--blue" />
        <div className="hero-glow hero-glow--violet" />
        <Canvas
          className="hero-canvas"
          camera={{ position: [0, 1.15, 8], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          aria-hidden="true"
        >
          <Scene />
        </Canvas>

        <div className="hero-content">
          <nav className="topbar" aria-label="Navegación principal">
            <a className="brand" href="#inicio" aria-label="Inicio">
              <span className="brand-mark">JC</span>
              <span>JUAN CAMILO CABEZAS MONTOYA</span>
            </a>
            <a className="availability" href="#proyectos">
              <span className="availability-dot" />
              <span>Diseño y desarrollo creativo</span>
            </a>
          </nav>

          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              INGENIERO DE SISTEMAS · DESARROLLO WEB
            </p>
            <h1 id="hero-title">
              Ideas digitales,
              <br />
              <span>en movimiento.</span>
            </h1>
            <p className="hero-description">
              Diseño y desarrollo experiencias interactivas que conectan
              tecnología, movimiento y una buena historia.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#proyectos">
                Ver proyectos
                <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="#experiencia">
                Explorar la escena <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="scene-label" aria-hidden="true">
            <span className="scene-label-dot" />
            <span>AVATAR ANIMADO</span>
            <span className="scene-label-divider">/</span>
            <span>FBX · MIXAMO</span>
          </div>
          <p className="interaction-hint" aria-hidden="true">
            Arrastra para explorar <span>·</span> Toca la forma para cambiarla
          </p>
          <a className="scroll-cue" href="#proyectos" aria-label="Desplazarse a proyectos">
            <span />
          </a>
        </div>
      </section>

      <section className="experience" id="proyectos" aria-labelledby="projects-title">
        <div className="experience-inner" id="experiencia">
          <div className="experience-heading">
            <p className="section-eyebrow">UN EXPERIMENTO INTERACTIVO</p>
            <h2 id="projects-title">
              Una escena viva,
              <br />
              <span>hecha para explorar.</span>
            </h2>
            <p className="experience-intro">
              Una muestra de cómo el 3D puede convivir con una interfaz web
              clara, ligera y pensada para personas.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-number">01</span>
              <span className="feature-icon feature-icon--motion" aria-hidden="true">↗</span>
              <h3>Movimiento real</h3>
              <p>Un modelo FBX reproduce su animación y respira con el ciclo de renderizado.</p>
              <span className="feature-tag">R3F · useFrame</span>
            </article>
            <article className="feature-card">
              <span className="feature-number">02</span>
              <span className="feature-icon feature-icon--depth" aria-hidden="true">◈</span>
              <h3>Interacción sutil</h3>
              <p>Explora la cámara con el ratón y activa la geometría que flota en la escena.</p>
              <span className="feature-tag">DREI · ORBIT CONTROLS</span>
            </article>
            <article className="feature-card">
              <span className="feature-number">03</span>
              <span className="feature-icon feature-icon--light" aria-hidden="true">✳</span>
              <h3>Luz y contraste</h3>
              <p>Iluminación ambiental y dirigida para darle profundidad al personaje 3D.</p>
              <span className="feature-tag">THREE.JS · LIGHTING</span>
            </article>
          </div>
        </div>
        <footer className="site-footer">
          <a className="brand" href="#inicio">
            <span className="brand-mark">JC</span>
            <span>JUAN CAMILO CABEZAS MONTOYA</span>
          </a>
          <span>Hecho para la web, con curiosidad.</span>
          <a href="#inicio">Volver arriba ↑</a>
        </footer>
      </section>
    </main>
  )
}

useFBX.preload(MODEL_PATH)

export default App
