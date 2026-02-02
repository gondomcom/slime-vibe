import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { useState, useRef, Suspense } from 'react'

// Звук приветствия (заглушка)
const INTRO_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'

function Slime({ emotion }) {
  const outerRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Прыжки
    const jump = Math.abs(Math.sin(time * 3)) * 1.5
    if (outerRef.current) {
        outerRef.current.position.y = jump
        // Сплющивание
        const scaleY = 1 + (Math.sin(time * 6) * 0.1)
        const scaleXZ = 1 - (Math.sin(time * 6) * 0.05)
        outerRef.current.scale.set(scaleXZ, scaleY, scaleXZ)
    }
  })

  const colors = {
    happy: '#55ff55',
    angry: '#ff5555',
    sad: '#5555ff'
  }

  return (
    <group ref={outerRef}>
      {/* Ядро */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color={colors[emotion]} />
      </mesh>
      {/* Слизь */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhysicalMaterial 
          color={colors[emotion]} 
          transparent 
          opacity={0.4} 
          roughness={0}
          metalness={0.1}
          transmission={0.5} 
          thickness={1}
        />
      </mesh>
      {/* Лицо */}
      <group position={[0, 0, 1.01]}>
        <mesh position={[0.5, 0.3, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="black" />
        </mesh>
        <mesh position={[-0.5, 0.3, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="black" />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
           {emotion === 'happy' && <planeGeometry args={[0.6, 0.2]} />}
           {emotion === 'angry' && <planeGeometry args={[0.6, 0.1]} />}
           {emotion === 'sad' && <planeGeometry args={[0.4, 0.1]} />}
           <meshBasicMaterial color="black" />
        </mesh>
      </group>
    </group>
  )
}

function App() {
  const [started, setStarted] = useState(false)
  const [emotion, setEmotion] = useState('happy')
  const audioRef = useRef(new Audio(INTRO_SOUND))

  const handleStart = () => {
    setStarted(true)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(e => console.error('Audio error:', e))
  }

  const toggleEmotion = () => {
    const emotions = ['happy', 'angry', 'sad']
    const next = emotions[(emotions.indexOf(emotion) + 1) % emotions.length]
    setEmotion(next)
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      
      {!started && (
        <div 
          onClick={handleStart}
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            cursor: 'pointer',
            color: 'white',
            flexDirection: 'column'
          }}
        >
          <h1 style={{ fontSize: '3rem', fontFamily: 'monospace', margin: 0 }}>[ ВХОД В МАТРИЦУ ]</h1>
          <p style={{ marginTop: '20px', color: '#888' }}>(кликни)</p>
        </div>
      )}

      <Canvas camera={{ position: [0, 2, 6] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          {started && (
            <>
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Slime emotion={emotion} />
              </Float>
              <OrbitControls enableZoom={false} />
              
              <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#333" />
              </mesh>
            </>
          )}
        </Suspense>
      </Canvas>

      {started && (
        <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
          <button 
            onClick={toggleEmotion}
            style={{
              padding: '15px 30px',
              fontSize: '1.5rem',
              background: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              boxShadow: '0 0 10px rgba(255,255,255,0.5)'
            }}
          >
            СМЕНИТЬ ВАЙБ
          </button>
        </div>
      )}
    </div>
  )
}

export default App
