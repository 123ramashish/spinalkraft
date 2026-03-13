'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════
   AI AGENT CALLING SCENE
   • Three.js: dual agent orbs, sound-wave rings,
     data-stream particles, neural net mesh,
     holographic pulse grid
   • Framer Motion: call UI overlay, status labels
═══════════════════════════════════════════════════ */

type CallState = 'ringing' | 'connecting' | 'connected'

export default function ContactScene() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [callState,  setCallState]  = useState<CallState>('ringing')
  const [callTimer,  setCallTimer]  = useState(0)
  const [waveLevel,  setWaveLevel]  = useState(0)          // 0-1 audio intensity

  /* ── Call state machine ── */
  useEffect(() => {
    const t1 = setTimeout(() => setCallState('connecting'), 3200)
    const t2 = setTimeout(() => setCallState('connected'),  5800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  /* ── Call timer once connected ── */
  useEffect(() => {
    if (callState !== 'connected') return
    const id = setInterval(() => setCallTimer(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [callState])

  /* ── Fake audio waveform ── */
  useEffect(() => {
    if (callState !== 'connected') return
    const id = setInterval(() => setWaveLevel(Math.random()), 120)
    return () => clearInterval(id)
  }, [callState])

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

  /* ══════════════════════════════════════
     THREE.JS SCENE
  ══════════════════════════════════════ */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const mobile = window.innerWidth < 768

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.toneMapping    = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(52, canvas.clientWidth / canvas.clientHeight, 0.1, 200)
    camera.position.set(0, 0, mobile ? 20 : 15)
    camera.lookAt(0, 0, 0)

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.3))

    const goldL = new THREE.PointLight(0xc9a84c, 14, 40)
    goldL.position.set(-6, 5, 8)
    scene.add(goldL)

    const greenL = new THREE.PointLight(0x4caf50, 12, 40)
    greenL.position.set(6, -4, 8)
    scene.add(greenL)

    const blueL = new THREE.PointLight(0x40b4ff, 8, 35)
    blueL.position.set(0, 0, 12)
    scene.add(blueL)

    const rimL = new THREE.DirectionalLight(0xffffff, 1.5)
    rimL.position.set(0, 10, -5)
    scene.add(rimL)

    /* ═══════════════════════════════════════
       ① CALLER ORB  (left) — USER
    ═══════════════════════════════════════ */
    const userOrb = new THREE.Group()
    userOrb.position.set(-4.2, 0, 0)

    // Core sphere
    const userCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 48, 48),
      new THREE.MeshStandardMaterial({
        color: 0xc9a84c, metalness: 0.7, roughness: 0.15,
        emissive: new THREE.Color(0xc9a84c), emissiveIntensity: 0.9,
      })
    )
    userOrb.add(userCore)

    // Outer shell (wireframe)
    const userShell = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 18, 18),
      new THREE.MeshBasicMaterial({ color: 0xffd060, wireframe: true, transparent: true, opacity: 0.18 })
    )
    userOrb.add(userShell)

    // Equatorial ring
    const userRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.04, 8, 60),
      new THREE.MeshStandardMaterial({
        color: 0xffd060, emissive: new THREE.Color(0xc9a84c), emissiveIntensity: 1.2,
        metalness: 0.8, roughness: 0.1,
      })
    )
    userOrb.add(userRing)

    scene.add(userOrb)

    /* ═══════════════════════════════════════
       ② AGENT ORB  (right) — AI
    ═══════════════════════════════════════ */
    const agentOrb = new THREE.Group()
    agentOrb.position.set(4.2, 0, 0)

    const agentCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 48, 48),
      new THREE.MeshStandardMaterial({
        color: 0x4caf50, metalness: 0.6, roughness: 0.15,
        emissive: new THREE.Color(0x3aab3e), emissiveIntensity: 0.9,
      })
    )
    agentOrb.add(agentCore)

    const agentShell = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 18, 18),
      new THREE.MeshBasicMaterial({ color: 0x6edd72, wireframe: true, transparent: true, opacity: 0.18 })
    )
    agentOrb.add(agentShell)

    const agentRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.04, 8, 60),
      new THREE.MeshStandardMaterial({
        color: 0x6edd72, emissive: new THREE.Color(0x4caf50), emissiveIntensity: 1.2,
        metalness: 0.8, roughness: 0.1,
      })
    )
    agentOrb.add(agentRing)

    // Neural "brain" ring stack around agent
    for (let a = 0; a < 3; a++) {
      const nr = new THREE.Mesh(
        new THREE.TorusGeometry(1.6 + a * 0.22, 0.025, 6, 48),
        new THREE.MeshBasicMaterial({ color: 0x4caf50, transparent: true, opacity: 0.22 - a * 0.05 })
      )
      nr.rotation.x = (a * Math.PI) / 3.5
      nr.rotation.y = (a * Math.PI) / 2.8
      agentOrb.add(nr)
    }

    scene.add(agentOrb)

    /* ═══════════════════════════════════════
       ③ SOUND WAVE RINGS (pulse outward from each orb)
    ═══════════════════════════════════════ */
    const RING_COUNT = 7
    interface WaveRing { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number; side: 'user'|'agent' }
    const waveRings: WaveRing[] = []

    for (let i = 0; i < RING_COUNT; i++) {
      const isUser = i < Math.ceil(RING_COUNT / 2)
      const mat = new THREE.MeshBasicMaterial({
        color: isUser ? 0xffd060 : 0x6edd72,
        transparent: true, opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      })
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 60), mat)
      ring.rotation.x = Math.PI / 2
      ring.position.set(isUser ? -4.2 : 4.2, 0, 0)
      scene.add(ring)
      waveRings.push({ mesh: ring, mat, phase: i / RING_COUNT, side: isUser ? 'user' : 'agent' })
    }

    /* ═══════════════════════════════════════
       ④ CONNECTION BEAM between the two orbs
    ═══════════════════════════════════════ */
    // Data packets travelling along the beam
    const PACKET_N = 16
    const beamPositions = new Float32Array(PACKET_N * 3)
    const beamColors    = new Float32Array(PACKET_N * 3)
    for (let i = 0; i < PACKET_N; i++) {
      const t = i / PACKET_N
      beamPositions[i*3]   = -4.2 + t * 8.4
      beamPositions[i*3+1] = (Math.random() - 0.5) * 0.4
      beamPositions[i*3+2] = (Math.random() - 0.5) * 0.4
      const c = new THREE.Color(t < 0.5 ? 0xffd060 : 0x6edd72)
      beamColors[i*3]=c.r; beamColors[i*3+1]=c.g; beamColors[i*3+2]=c.b
    }
    const beamGeo = new THREE.BufferGeometry()
    beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3))
    beamGeo.setAttribute('color',    new THREE.BufferAttribute(beamColors, 3))
    const beamPackets = new THREE.Points(beamGeo, new THREE.PointsMaterial({
      size: 0.14, vertexColors: true, transparent: true, opacity: 0.0,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    }))
    scene.add(beamPackets)

    // Thin centre line
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-4.2, 0, 0),
      new THREE.Vector3( 4.2, 0, 0),
    ])
    const connLine = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.0,
      blending: THREE.AdditiveBlending,
    }))
    scene.add(connLine)

    /* ═══════════════════════════════════════
       ⑤ HOLOGRAPHIC HEXAGON GRID (background)
    ═══════════════════════════════════════ */
    const hexGrid = new THREE.Group()
    const HEX_R = 0.55
    const hexPositions: [number,number][] = []
    for (let row = -4; row <= 4; row++) {
      for (let col = -8; col <= 8; col++) {
        const x = col * HEX_R * 1.75 + (row % 2) * HEX_R * 0.87
        const y = row * HEX_R * 1.52
        hexPositions.push([x, y])
      }
    }
    hexPositions.forEach(([x, y]) => {
      const geo = new THREE.CylinderGeometry(HEX_R * 0.82, HEX_R * 0.82, 0.04, 6)
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() < 0.5 ? 0xc9a84c : 0x4caf50,
        transparent: true,
        opacity: 0.04 + Math.random() * 0.05,
        wireframe: true,
      })
      const h = new THREE.Mesh(geo, mat)
      h.position.set(x, y, -6)
      h.rotation.x = Math.PI / 2
      hexGrid.add(h)
    })
    scene.add(hexGrid)

    /* ═══════════════════════════════════════
       ⑥ ORBITING DATA NODES around agent
    ═══════════════════════════════════════ */
    interface DataNode { mesh: THREE.Mesh; angle: number; radius: number; speed: number; yOff: number }
    const dataNodes: DataNode[] = []
    const nodeColors = [0xffd060, 0x6edd72, 0x40b4ff, 0xff6b6b, 0xc488ff]
    for (let i = 0; i < 8; i++) {
      const node = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.12, 0),
        new THREE.MeshStandardMaterial({
          color: nodeColors[i % nodeColors.length],
          emissive: new THREE.Color(nodeColors[i % nodeColors.length]),
          emissiveIntensity: 1.2, metalness: 0.5, roughness: 0.2,
        })
      )
      scene.add(node)
      dataNodes.push({
        mesh: node,
        angle: (i / 8) * Math.PI * 2,
        radius: 2.2 + (i % 3) * 0.4,
        speed:  0.6 + Math.random() * 0.5,
        yOff:   (Math.random() - 0.5) * 1.5,
      })
    }

    /* ═══════════════════════════════════════
       ⑦ AMBIENT PARTICLES
    ═══════════════════════════════════════ */
    const P = 300
    const pPos = new Float32Array(P * 3)
    const pCol = new Float32Array(P * 3)
    const pal  = [new THREE.Color(0xffd060), new THREE.Color(0x6edd72), new THREE.Color(0x40b4ff), new THREE.Color(0xff8877)]
    for (let i = 0; i < P; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 36
      pPos[i*3+1] = (Math.random() - 0.5) * 22
      pPos[i*3+2] = (Math.random() - 0.5) * 18 - 4
      const c = pal[Math.floor(Math.random() * pal.length)]
      pCol[i*3]=c.r; pCol[i*3+1]=c.g; pCol[i*3+2]=c.b
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3))
    const ambientParticles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.08, vertexColors: true, transparent: true, opacity: 0.7,
      sizeAttenuation: true, blending: THREE.AdditiveBlending,
    }))
    scene.add(ambientParticles)

    /* ── Mouse parallax ── */
    let mx = 0, my = 0, smx = 0, smy = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    /* ═══════════════════════════════════════
       ANIMATION LOOP
    ═══════════════════════════════════════ */
    const clock = new THREE.Clock()
    let raf: number
    // Track call state in ref for animation access
    let _callState: CallState = 'ringing'
    const stateRef = { current: _callState }

    // expose state changes to loop
    const stateInterval = setInterval(() => {
      // sync from React state
    }, 100)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()

      // Determine connected state by time
      const isConnecting = t > 3.2
      const isConnected  = t > 5.8

      /* ── Parallax camera ── */
      smx += (mx * 0.8 - smx) * 0.04
      smy += (my * 0.5 - smy) * 0.04
      camera.position.x = smx * 2
      camera.position.y = smy * 1.5
      camera.lookAt(0, 0, 0)

      /* ── User orb: bob + ring spin ── */
      userOrb.position.y = Math.sin(t * 1.4) * 0.18
      userShell.rotation.y = t * 0.4
      userShell.rotation.x = t * 0.25
      userRing.rotation.z  = t * 0.6

      /* ── Ringing shake on user orb ── */
      if (!isConnecting) {
        const shake = Math.sin(t * 18) * Math.exp(-((t % 1.0) * 3)) * 0.12
        userOrb.rotation.z = shake
        userOrb.position.x = -4.2 + Math.sin(t * 20) * 0.05 * (1 - Math.min(1, (t % 1.0) * 3))
      } else {
        userOrb.rotation.z *= 0.92
      }

      /* ── Agent orb: float + shell spin ── */
      agentOrb.position.y = Math.sin(t * 1.1 + 1) * 0.18
      agentShell.rotation.y = -t * 0.5
      agentShell.rotation.z =  t * 0.3
      agentRing.rotation.z  = -t * 0.7

      /* ── Agent "thinking" pulse when ringing ── */
      const agentPulse = isConnected ? 1.0 : 0.85 + Math.sin(t * 3) * 0.15
      agentCore.scale.setScalar(agentPulse)

      /* ── Sound wave rings ── */
      const ringActivity = isConnected
        ? 1.0 + Math.sin(t * 8) * 0.4        // strong waves when connected
        : isConnecting ? 0.5 : 0.25           // subtle while ringing
      waveRings.forEach(({ mesh, mat, phase, side }) => {
        const cycle = ((t * (isConnected ? 0.9 : 0.45) + phase) % 1)
        const maxR   = isConnected ? 4.5 : 2.8
        mesh.scale.setScalar(1 + cycle * maxR)
        mat.opacity  = (1 - cycle) * 0.45 * ringActivity
        if (side === 'user') {
          mesh.position.x = -4.2
        } else {
          mesh.position.x = 4.2
        }
      })

      /* ── Beam packets: appear on connecting ── */
      const beamOpacity = isConnecting ? Math.min(1, (t - 3.2) * 0.8) : 0
      ;(beamPackets.material as THREE.PointsMaterial).opacity = beamOpacity * 0.85
      ;(connLine.material as THREE.LineBasicMaterial).opacity  = beamOpacity * (0.08 + Math.sin(t * 4) * 0.04)

      // Animate packets travelling left-to-right and right-to-left
      const bp = beamGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PACKET_N; i++) {
        const speed = 0.8 + (i % 3) * 0.4
        const dir   = i % 2 === 0 ? 1 : -1
        bp[i*3] += dir * speed * 0.016
        if (bp[i*3] > 4.2) bp[i*3] = -4.2
        if (bp[i*3] < -4.2) bp[i*3] =  4.2
        bp[i*3+1] = Math.sin(t * 2 + i * 0.8) * 0.25
      }
      beamGeo.attributes.position.needsUpdate = true

      /* ── Data nodes orbit agent ── */
      dataNodes.forEach((dn, i) => {
        dn.angle += dn.speed * 0.012 * (isConnected ? 1.6 : 0.5)
        const r = dn.radius
        dn.mesh.position.set(
          agentOrb.position.x + Math.cos(dn.angle) * r,
          dn.yOff + Math.sin(dn.angle * 0.7) * 0.6,
          Math.sin(dn.angle) * r
        )
        dn.mesh.rotation.x = t * 1.2 + i
        dn.mesh.rotation.y = t * 0.8
        // Grow bright when connected
        const m = dn.mesh.material as THREE.MeshStandardMaterial
        m.emissiveIntensity = isConnected ? 1.5 + Math.sin(t * 3 + i) * 0.5 : 0.5
      })

      /* ── Hex grid slow pulse ── */
      hexGrid.children.forEach((h, i) => {
        const m = (h as THREE.Mesh).material as THREE.MeshBasicMaterial
        m.opacity = (0.04 + Math.abs(Math.sin(t * 0.3 + i * 0.1)) * 0.08) * (isConnected ? 1.8 : 1)
      })

      /* ── Particles drift ── */
      ambientParticles.rotation.y = t * 0.01
      ambientParticles.rotation.x = Math.sin(t * 0.07) * 0.04

      /* ── Pulsing lights ── */
      goldL.intensity  = 12 + Math.sin(t * 1.5) * 3
      greenL.intensity = 10 + Math.sin(t * 1.8 + 1) * 3
      blueL.intensity  = isConnected ? 10 + Math.sin(t * 2.5) * 3 : 4

      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(stateInterval)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  /* ═══════════════════════════════════════
     FRAMER MOTION UI OVERLAY
  ═══════════════════════════════════════ */
  const stateLabel = {
    ringing:    'Incoming call…',
    connecting: 'Connecting…',
    connected:  'Connected',
  }

  const stateColor = {
    ringing:    '#C9A84C',
    connecting: '#40b4ff',
    connected:  '#4CAF50',
  }

  return (
    <div className="relative w-full h-full" style={{ minHeight: 420 }}>

      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 40%, rgba(4,8,12,0.55) 80%, rgba(4,8,12,0.88) 100%)',
      }} />

      {/* ═══════════════════════════════
          CALL UI OVERLAY
      ═══════════════════════════════ */}

      {/* Agent label — right */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ right: '8%' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(76,175,80,0.7)' }}>AI Agent</div>
        <div className="w-2 h-2 rounded-full" style={{ background: stateColor[callState], boxShadow: `0 0 10px ${stateColor[callState]}` }} />
      </motion.div>

      {/* User label — left */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ left: '8%' }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(201,168,76,0.7)' }}>You</div>
        <div className="w-2 h-2 rounded-full" style={{ background: '#C9A84C', boxShadow: '0 0 10px #C9A84C' }} />
      </motion.div>

      {/* Centre status panel */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 pointer-events-none">

        {/* Status badge */}
        <motion.div
          key={callState}
          className="mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${stateColor[callState]}40`,
            backdropFilter: 'blur(8px)',
          }}
          initial={{ opacity: 0, y: 8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated status dot */}
          <motion.span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: stateColor[callState] }}
            animate={callState === 'ringing' ? { scale: [1, 1.6, 1], opacity: [1, 0.4, 1] } : { scale: 1, opacity: 1 }}
            transition={callState === 'ringing' ? { duration: 0.9, repeat: Infinity } : {}}
          />
          <span className="text-xs font-mono tracking-widest uppercase" style={{ color: stateColor[callState] }}>
            {stateLabel[callState]}
          </span>
          {callState === 'connected' && (
            <span className="text-xs font-mono" style={{ color: 'rgba(76,175,80,0.65)' }}>
              {fmt(callTimer)}
            </span>
          )}
        </motion.div>

        {/* Audio waveform bars — only when connected */}
        <AnimatePresence>
          {callState === 'connected' && (
            <motion.div
              className="flex items-end gap-[3px] h-7"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.5 }}
            >
              {Array.from({ length: 22 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{ background: i % 2 === 0 ? '#C9A84C' : '#4CAF50' }}
                  animate={{ height: [4, 4 + Math.random() * 22, 4] }}
                  transition={{ duration: 0.18 + Math.random() * 0.22, repeat: Infinity, repeatType: 'mirror', delay: i * 0.04 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ringing dots */}
        <AnimatePresence>
          {callState === 'ringing' && (
            <motion.div
              className="flex gap-2 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#C9A84C' }}
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connecting spinner */}
        <AnimatePresence>
          {callState === 'connecting' && (
            <motion.div
              className="mt-2 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-4 h-4 rounded-full border-2"
                style={{ borderColor: '#40b4ff', borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
              />
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(64,180,255,0.65)' }}>
                Establishing secure channel
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Corner brackets ── */}
      {[
        { cls: 'top-3 left-3',  bt: 'border-t-2 border-l-2' },
        { cls: 'top-3 right-3', bt: 'border-t-2 border-r-2' },
        { cls: 'bottom-3 left-3',  bt: 'border-b-2 border-l-2' },
        { cls: 'bottom-3 right-3', bt: 'border-b-2 border-r-2' },
      ].map(({ cls, bt }, i) => (
        <motion.div
          key={i}
          className={`absolute w-5 h-5 pointer-events-none ${cls} ${bt}`}
          style={{ borderColor: 'rgba(201,168,76,0.4)' }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
        />
      ))}

      {/* ── Scanline texture ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)',
      }} />
    </div>
  )
}