'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const el = mountRef.current
    const W = el.clientWidth
    const H = el.clientHeight

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    el.appendChild(renderer.domElement)

    /* ── Scene & Camera ── */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200)
    camera.position.set(0, 0, 22)

    /* ── Lights — much brighter ── */
    // Strong ambient so nothing goes pitch-black
    scene.add(new THREE.AmbientLight(0xffffff, 1.8))

    // Key light: warm gold from upper-left
    const goldLight = new THREE.PointLight(0xffd87a, 12, 60)
    goldLight.position.set(-10, 8, 12)
    scene.add(goldLight)

    // Fill light: green from right
    const greenLight = new THREE.PointLight(0x6edd72, 10, 60)
    greenLight.position.set(10, -4, 10)
    scene.add(greenLight)

    // Front fill: soft blue-white to illuminate faces toward camera
    const frontLight = new THREE.DirectionalLight(0xd0eaff, 2.2)
    frontLight.position.set(0, 4, 20)
    scene.add(frontLight)

    // Rim / top edge
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4)
    rimLight.position.set(0, 14, -4)
    scene.add(rimLight)

    // Extra bottom-fill so lower objects stay lit
    const bottomFill = new THREE.PointLight(0xc9a84c, 6, 50)
    bottomFill.position.set(0, -10, 8)
    scene.add(bottomFill)

    /* ── Materials — emissive glow so objects shine ── */
    const matGold = new THREE.MeshStandardMaterial({
      color: 0xffd060, metalness: 0.75, roughness: 0.18,
      emissive: new THREE.Color(0xc9a84c), emissiveIntensity: 0.45,
    })
    const matGreen = new THREE.MeshStandardMaterial({
      color: 0x5dde64, metalness: 0.15, roughness: 0.35,
      emissive: new THREE.Color(0x3aab3e), emissiveIntensity: 0.4,
    })
    const matDark = new THREE.MeshStandardMaterial({
      color: 0x3a4f60, metalness: 0.65, roughness: 0.3,
      emissive: new THREE.Color(0x1a2f3a), emissiveIntensity: 0.2,
    })
    const matRubber = new THREE.MeshStandardMaterial({
      color: 0x3d9bdd, metalness: 0.05, roughness: 0.75,
      emissive: new THREE.Color(0x1a5a8a), emissiveIntensity: 0.3,
    })
    const matBone = new THREE.MeshStandardMaterial({
      color: 0xf0e8d8, metalness: 0.0, roughness: 0.45,
      emissive: new THREE.Color(0xb8a880), emissiveIntensity: 0.25,
    })
    const matRed = new THREE.MeshStandardMaterial({
      color: 0xff5f4e, metalness: 0.1, roughness: 0.5,
      emissive: new THREE.Color(0xc0291a), emissiveIntensity: 0.45,
    })
    const matPurple = new THREE.MeshStandardMaterial({
      color: 0xa07de0, metalness: 0.1, roughness: 0.4,
      emissive: new THREE.Color(0x5c3aaa), emissiveIntensity: 0.4,
    })
    const matCyan = new THREE.MeshStandardMaterial({
      color: 0x4dd9d9, metalness: 0.2, roughness: 0.35,
      emissive: new THREE.Color(0x0a8a8a), emissiveIntensity: 0.45,
    })

    /* ═══════════════════════════════════
       EQUIPMENT HELPERS
    ═══════════════════════════════════ */
    function makeDumbbell(): THREE.Group {
      const g = new THREE.Group()
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.4, 14), matDark)
      bar.rotation.z = Math.PI / 2
      g.add(bar)
      const plateGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.28, 18)
      ;[-1.1, 1.1].forEach(x => {
        const p = new THREE.Mesh(plateGeo, matGold)
        p.rotation.z = Math.PI / 2
        p.position.x = x
        g.add(p)
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.045, 8, 18), matDark)
        ring.position.x = x
        ring.rotation.y = Math.PI / 2
        g.add(ring)
      })
      return g
    }

    function makeBand(mat: THREE.Material): THREE.Group {
      const g = new THREE.Group()
      g.add(new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.14, 10, 44), mat))
      return g
    }

    function makeBall(mat: THREE.Material): THREE.Mesh {
      return new THREE.Mesh(new THREE.SphereGeometry(0.98, 32, 32), mat)
    }

    function makeRoller(): THREE.Group {
      const g = new THREE.Group()
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 2.5, 22), matCyan))
      for (let i = -5; i <= 5; i++) {
        const r = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.035, 6, 22), matDark)
        r.position.y = i * 0.22
        r.rotation.x = Math.PI / 2
        g.add(r)
      }
      ;[-1.25, 1.25].forEach(y => {
        const cap = new THREE.Mesh(new THREE.CircleGeometry(0.46, 20), matDark)
        cap.position.y = y
        cap.rotation.x = y > 0 ? 0 : Math.PI
        g.add(cap)
      })
      return g
    }

    function makeSpine(): THREE.Group {
      const g = new THREE.Group()
      const count = 9
      for (let i = 0; i < count; i++) {
        const vb = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.25, 0.2, 14), matBone)
        vb.position.y = i * 0.34 - (count * 0.34) / 2
        g.add(vb)
        const sp = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.15, 0.32), matBone)
        sp.position.set(0, i * 0.34 - (count * 0.34) / 2, -0.3)
        g.add(sp)
        if (i < count - 1) {
          const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.07, 14), matRubber)
          disc.position.y = i * 0.34 - (count * 0.34) / 2 + 0.135
          g.add(disc)
        }
      }
      return g
    }

    function makeTapeRoll(): THREE.Group {
      const g = new THREE.Group()
      g.add(new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.24, 12, 32), matRed))
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.5, 10), matDark)
      core.rotation.x = Math.PI / 2
      g.add(core)
      return g
    }

    function makeKneeJoint(): THREE.Group {
      const g = new THREE.Group()
      const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.23, 1.15, 14), matBone)
      femur.position.y = 0.78
      g.add(femur)
      ;[-0.19, 0.19].forEach(x => {
        const c = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), matBone)
        c.position.set(x, 0.22, 0)
        g.add(c)
      })
      const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 1.05, 14), matBone)
      tibia.position.y = -0.7
      g.add(tibia)
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.07, 14), matRubber))
      return g
    }

    function makeTENSpad(): THREE.Group {
      const g = new THREE.Group()
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 0.07), matRubber))
      const snap = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.11, 9), matGold)
      snap.position.set(0, 0.1, 0.09)
      snap.rotation.x = Math.PI / 2
      g.add(snap)
      return g
    }

    function makeGoniometer(): THREE.Group {
      const g = new THREE.Group()
      g.add(new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 9, 32, Math.PI), matGold))
      ;[0, Math.PI * 0.6].forEach((angle, i) => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.045, 0.045), i === 0 ? matGold : matCyan)
        arm.rotation.z = angle
        arm.position.x = Math.cos(angle) * 0.62
        arm.position.y = Math.sin(angle) * 0.62
        g.add(arm)
      })
      return g
    }

    /* pulse ring helper — glowing halo around big objects */
    function makeHalo(radius: number, color: THREE.Color): THREE.Mesh {
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      })
      return new THREE.Mesh(new THREE.RingGeometry(radius, radius + 0.06, 40), mat)
    }

    /* ═══════════════════════════════════
       PLACE OBJECTS
    ═══════════════════════════════════ */
    interface FloatingObj {
      mesh: THREE.Object3D
      basePos: THREE.Vector3
      rotSpeed: THREE.Vector3
      floatAmp: number
      floatSpeed: number
      floatOffset: number
    }
    const objects: FloatingObj[] = []

    function addObj(mesh: THREE.Object3D, pos: [number, number, number], scale = 1) {
      mesh.position.set(...pos)
      mesh.scale.setScalar(scale)
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )
      scene.add(mesh)
      objects.push({
        mesh,
        basePos: new THREE.Vector3(...pos),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.007,
          (Math.random() - 0.5) * 0.004
        ),
        floatAmp:   0.2 + Math.random() * 0.25,
        floatSpeed: 0.4 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2,
      })
    }

    // Dumbbells
    addObj(makeDumbbell(), [-7.5,  2.0, 0],   1.1)
    addObj(makeDumbbell(), [ 7.0, -2.5, -1],  0.95)
    addObj(makeDumbbell(), [ 0.5,  4.8, -2],  0.8)

    // Resistance bands
    addObj(makeBand(matGreen),  [-4.5, -3.5,  1], 1.1)
    addObj(makeBand(matRed),    [ 5.5,  3.8,  0], 0.95)
    addObj(makeBand(matPurple), [-9.0,  0.5, -1], 1.0)

    // Balls
    addObj(makeBall(matGreen),  [ 4.5, -4.5,  1], 1.05)
    addObj(makeBall(matRubber), [-2.5,  5.5, -2], 0.85)

    // Foam rollers
    addObj(makeRoller(), [-6.2,  1.5,  0], 1.0)
    addObj(makeRoller(), [ 6.8,  1.0, -2], 0.85)

    // Spine & knee
    addObj(makeSpine(),    [ 3.5,  0.5,  1], 1.15)
    addObj(makeKneeJoint(),[-3.8, -0.5,  1], 1.1)

    // TENS pads
    addObj(makeTENSpad(), [ 9.5,  3.5, -1], 1.2)
    addObj(makeTENSpad(), [-9.0, -4.0,  0], 1.1)

    // Tape rolls
    addObj(makeTapeRoll(), [ 2.0, -5.2, 0],  1.0)
    addObj(makeTapeRoll(), [-1.5,  3.2, -2], 0.85)

    // Goniometers
    addObj(makeGoniometer(), [-5.5,  4.5, -1], 1.1)
    addObj(makeGoniometer(), [ 8.0, -4.0,  0], 1.0)

    // Halos behind spine & knee
    const spineHalo = makeHalo(1.6, new THREE.Color(0xc9a84c))
    spineHalo.position.set(3.5, 0.5, 0.5)
    scene.add(spineHalo)
    const kneeHalo = makeHalo(1.5, new THREE.Color(0x4caf50))
    kneeHalo.position.set(-3.8, -0.5, 0.5)
    scene.add(kneeHalo)

    /* ═══════════════════════════════════
       PARTICLE FIELD — larger, brighter
    ═══════════════════════════════════ */
    const PARTICLE_COUNT = 500
    const pPos = new Float32Array(PARTICLE_COUNT * 3)
    const pCol = new Float32Array(PARTICLE_COUNT * 3)
    const palette = [
      new THREE.Color(0xffd87a),
      new THREE.Color(0x6edd72),
      new THREE.Color(0x55ccff),
      new THREE.Color(0xff8877),
      new THREE.Color(0xc488ff),
    ]
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 40
      pPos[i*3+1] = (Math.random() - 0.5) * 24
      pPos[i*3+2] = (Math.random() - 0.5) * 16 - 4
      const c = palette[Math.floor(Math.random() * palette.length)]
      pCol[i*3] = c.r; pCol[i*3+1] = c.g; pCol[i*3+2] = c.b
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3))
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    }))
    scene.add(particles)

    /* ═══════════════════════════════════
       MEDICAL CROSS ICONS
    ═══════════════════════════════════ */
    function makeMedCross(size = 0.55): THREE.Group {
      const g = new THREE.Group()
      const mat = new THREE.MeshBasicMaterial({ color: 0x6edd72, transparent: true, opacity: 0.55 })
      g.add(new THREE.Mesh(new THREE.BoxGeometry(size,        size * 0.33, 0.04), mat))
      g.add(new THREE.Mesh(new THREE.BoxGeometry(size * 0.33, size,        0.04), mat))
      return g
    }
    ;([ [-11, 3, -4], [10, 5, -5], [-10, -5, -3], [0, -6, -6], [9, -1, -5] ] as [number,number,number][])
      .forEach(pos => {
        const c = makeMedCross()
        c.position.set(...pos)
        scene.add(c)
        objects.push({ mesh: c, basePos: new THREE.Vector3(...pos),
          rotSpeed: new THREE.Vector3(0, 0, 0.004), floatAmp: 0.12,
          floatSpeed: 0.38, floatOffset: Math.random() * Math.PI * 2 })
      })

    /* ═══════════════════════════════════
       GLOWING WIREFRAME GRID (floor)
    ═══════════════════════════════════ */
    const gridHelper = new THREE.GridHelper(30, 20, 0x1a3a2a, 0x0f2218)
    gridHelper.position.y = -7
    gridHelper.material = new THREE.LineBasicMaterial({ color: 0x1d4a28, transparent: true, opacity: 0.35 })
    scene.add(gridHelper)

    /* ═══════════════════════════════════
       MOUSE PARALLAX
    ═══════════════════════════════════ */
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    /* ═══════════════════════════════════
       ANIMATION LOOP
    ═══════════════════════════════════ */
    let raf = 0
    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      camera.position.x += (mouse.x * 1.8 - camera.position.x) * 0.025
      camera.position.y += (-mouse.y * 1.0 - camera.position.y) * 0.025
      camera.lookAt(0, 0, 0)

      objects.forEach(o => {
        o.mesh.rotation.x += o.rotSpeed.x
        o.mesh.rotation.y += o.rotSpeed.y
        o.mesh.rotation.z += o.rotSpeed.z
        o.mesh.position.y = o.basePos.y + Math.sin(t * o.floatSpeed + o.floatOffset) * o.floatAmp
        o.mesh.position.x = o.basePos.x + Math.cos(t * o.floatSpeed * 0.6 + o.floatOffset) * (o.floatAmp * 0.4)
      })

      // Spin halos slowly
      spineHalo.rotation.z = t * 0.3
      kneeHalo.rotation.z  = -t * 0.25

      particles.rotation.y = t * 0.015
      particles.rotation.x = Math.sin(t * 0.08) * 0.05

      // Pulsing lights
      goldLight.intensity  = 10 + Math.sin(t * 1.4) * 2.5
      greenLight.intensity =  9 + Math.sin(t * 1.8 + 1) * 2.0
      bottomFill.intensity =  5 + Math.sin(t * 0.9 + 2) * 1.5

      renderer.render(scene, camera)
    }
    animate()

    /* ── Resize ── */
    const onResize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <>
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Lighter vignette — only edges, centre stays clear */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 45%, rgba(5,10,14,0.4) 75%, rgba(5,10,14,0.82) 100%)',
        }}
      />

      {/* Very subtle scanline — keeps depth without darkening */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.07) 2px, rgba(255,255,255,0.07) 4px)',
        }}
      />

      {/* Corner brackets */}
      {[
        'top-4 left-4 border-t-2 border-l-2',
        'top-4 right-4 border-t-2 border-r-2',
        'bottom-4 left-4 border-b-2 border-l-2',
        'bottom-4 right-4 border-b-2 border-r-2',
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute w-7 h-7 pointer-events-none ${cls}`}
          style={{ borderColor: 'rgba(201,168,76,0.5)' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
        />
      ))}

      {/* Floating stat pills */}
      {[
        { label: 'Range of Motion', value: '180°', delay: 1.0, pos: 'left-8 top-[28%]' },
        { label: 'Recovery Rate',   value: '94%',  delay: 1.2, pos: 'right-8 top-[35%]' },
        { label: 'Pain Relief',     value: '3×',   delay: 1.4, pos: 'left-12 bottom-[22%]' },
      ].map((pill, i) => (
        <motion.div
          key={i}
          className={`absolute hidden md:flex flex-col items-center gap-0.5 pointer-events-none ${pill.pos}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: pill.delay }}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest"
            style={{ color: 'rgba(201,168,76,0.75)' }}>
            {pill.label}
          </span>
          <span className="text-2xl font-bold"
            style={{ color: '#FFD060', textShadow: '0 0 22px rgba(255,200,60,0.7), 0 0 8px rgba(255,200,60,0.5)' }}>
            {pill.value}
          </span>
        </motion.div>
      ))}

      {/* Equipment legend badges */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex gap-3 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        {[
          { dot: '#FFD060', label: 'Strength' },
          { dot: '#6edd72', label: 'Mobility' },
          { dot: '#3d9bdd', label: 'Recovery' },
          { dot: '#ff5f4e', label: 'Therapy' },
        ].map((b, i) => (
          <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: b.dot, boxShadow: `0 0 6px ${b.dot}` }} />
            {b.label}
          </span>
        ))}
      </motion.div>
    </>
  )
}