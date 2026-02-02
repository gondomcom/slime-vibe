import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture, Text, Float } from '@react-three/drei'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

// Звук приветствия (заглушка, можно заменить на свой URL)
const INTRO_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3' // Какой-то магический звук

function Slime({ emotion }) {
  const meshRef = useRef()
  const outerRef = useRef()
  const eyesRef = useRef()
  
  // Анимация прыжков и желе
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Прыжки
    const jump = Math.abs(Math.sin(time * 3)) * 1.5
    if (outerRef.current) {
        outerRef.current.position.y = jump
        // Сплющивание при приземлении
        const scaleY = 1 + (Math.sin(time * 6) * 0.1)
        const scaleXZ = 1 - (Math.sin(time * 6) * 0.05)
        outerRef.current.scale.set(scaleXZ, scaleY, scaleXZ)
    }
  })

  // Цвета эмоций
  const colors = {
    happy: '#55ff55', // Зеленый
    angry: '#ff5555', // Красный
    sad: '#5555ff',   // Синий
    dead: '#555555'   // Серый
  }

  return (
    <group ref={outerRef}>
      {/* Внутреннее ядро (непрозрачное) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color={colors[emotion]} />
      </mesh>

      {/* Внешняя слизь (прозрачная) */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhysicalMaterial 
          color={colors[emotion]} 
          transparent 
          opacity={0.4} 
          roughness={0}
          metalness={0.1}
          transmission={0.5} // Стекловидность
          thickness={1}
        />
      </mesh>

      {/* Лицо */}
      <group position={[0, 0, 1.01]}>
        {/* Правый глаз */}
        <mesh position={[0.5, 0.3, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="black" />
        </mesh>
        {/* Левый глаз */}
        <mesh position={[-0.5, 0.3, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="black" />
        </mesh>
        {/* Рот */}
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
    audioRef.current.play().catch(e => console.log('Audio error:', e))
  }

  const toggleEmotion = () => {
    const emotions = ['happy', 'angry', 'sad']
    const next = emotions[(emotions.indexOf(emotion) + 1) % emotions.length]
    setEmotion(next)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a', overflow: 'hidden' }}>
      
      {!started && (
        <div 
          onClick={handleStart}
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            background: 'rgba(0,0,0,0.8)',
            zIndex: 10,
            cursor: 'pointer',
            color: 'white',
            fontSize: '2rem',
            fontFamily: 'monospace'
          }}
        >
          <h1>[ ЖМИ СЮДА ЧТОБЫ ВОЙТИ ]</h1>
        </div>
      )}

      <Canvas camera={{ position: [0, 2, 6] }}>
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
      </Canvas>

      {started && (
        <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)' }}>
          <button 
            onClick={toggleEmotion}
            style={{
              padding: '15px 30px',
              fontSize: '1.5rem',
              background: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold'
            }}
          >
            ПОМЕНЯТЬ ВАЙБ
          </button>
        </div>
      )}
    </div>
  )
}

export default App
