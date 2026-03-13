'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════
   360° ANATOMY VIEWER
   • Camera orbits 360° around a central anatomy figure
   • Auto-rotate + drag-to-orbit + touch support
   • Holographic shader: scan sweep, heartbeat pulse, RGB glitch
   • Floating muscle-group hotspot rings
   • Orbital particle rings around the figure
   • Energy spine line + body contour glow
   • Floating equipment at outer radius
═══════════════════════════════════════════════════════════ */

const MUSCLE_LABELS = [
  { id: 'trap',  label: 'Trapezius',   angle: 200, yPos:  4.8, color: '#FFD060', detail: 'Upper back & neck stabilizer' },
  { id: 'delt',  label: 'Deltoid',     angle: 290, yPos:  3.5, color: '#6edd72', detail: 'Shoulder mobility & rotation'  },
  { id: 'pec',   label: 'Pectoralis',  angle:  30, yPos:  2.8, color: '#4dd9d9', detail: 'Chest pressing & adduction'    },
  { id: 'lats',  label: 'Latissimus',  angle: 160, yPos:  1.2, color: '#FFD060', detail: 'Broadest back muscle'           },
  { id: 'core',  label: 'Core / Abs',  angle:  10, yPos: -0.5, color: '#c488ff', detail: 'Spine stabilisation & posture' },
  { id: 'glute', label: 'Gluteus',     angle: 190, yPos: -2.2, color: '#ff8877', detail: 'Hip extension & pelvic control' },
  { id: 'quad',  label: 'Quadriceps',  angle:  20, yPos: -4.2, color: '#6edd72', detail: 'Knee extension & leg power'     },
  { id: 'ham',   label: 'Hamstrings',  angle: 175, yPos: -4.5, color: '#4dd9d9', detail: 'Knee flexion & hip extension'  },
]

export default function HeroScene() {
  const mountRef   = useRef<HTMLDivElement>(null)
  const stateRef   = useRef({ autoRotate: true, phi: Math.PI / 2, theta: 0, isDragging: false, lastX: 0, lastY: 0 })
  const [activeId,    setActiveId]    = useState<string | null>(null)
  const [isAutoRotate, setIsAutoRotate] = useState(true)
  const [viewAngle,   setViewAngle]   = useState(0)     // degrees 0–360

  useEffect(() => {
    if (!mountRef.current) return
    const el = mountRef.current
    const W  = el.clientWidth
    const H  = el.clientHeight
    const s  = stateRef.current

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping         = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    el.appendChild(renderer.domElement)

    /* ── Scene ── */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 300)
    // Camera orbits at radius 18, starting at front
    const CAM_RADIUS = 18
    const CAM_Y      = 1.5
    camera.position.set(0, CAM_Y, CAM_RADIUS)
    camera.lookAt(0, 0, 0)

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 2.0))

    const goldL = new THREE.PointLight(0xffd87a, 14, 70)
    goldL.position.set(-12, 8, 12)
    scene.add(goldL)

    const greenL = new THREE.PointLight(0x6edd72, 12, 70)
    greenL.position.set(12, -4, 10)
    scene.add(greenL)

    const blueL = new THREE.PointLight(0x4ab8ff, 8, 50)
    blueL.position.set(0, 10, -12)
    scene.add(blueL)

    const fillL = new THREE.DirectionalLight(0xffffff, 1.6)
    fillL.position.set(0, 6, 20)
    scene.add(fillL)

    /* ═══════════════════════════════════════════════════
       ① ANATOMY BODY — double-sided holographic plane
    ═══════════════════════════════════════════════════ */
    const bodyShader = new THREE.ShaderMaterial({
      uniforms: {
        map:        { value: null },
        time:       { value: 0   },
        scanPos:    { value: 0.5 },
        pulse:      { value: 0   },
        glitchAmt:  { value: 0   },
        hasTexture: { value: 0   },
        faceDir:    { value: 1   }, // 1 = front, -1 = back
      },
      side:        THREE.DoubleSide,
      transparent: true,
      depthWrite:  false,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main(){
          vUv    = uv;
          vNormal = normalMatrix * normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float time;
        uniform float scanPos;
        uniform float pulse;
        uniform float glitchAmt;
        uniform float hasTexture;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main(){
          vec2 uv = vUv;

          /* Flip UV for back face */
          bool isFront = vNormal.z > 0.0;

          vec4 col = vec4(0.0);

          if(hasTexture > 0.5){
            vec2 sampleUv = uv;
            /* Front face → right half of image (front body)
               Back face  → left half of image  (rear body)  */
            if(isFront){
              sampleUv.x = 0.5 + uv.x * 0.5;   // right half
            } else {
              sampleUv.x = (1.0 - uv.x) * 0.5; // left half, mirrored
            }

            float g = glitchAmt * 0.009;
            float r = texture2D(map, sampleUv + vec2(g,  0.0)).r;
            float gr= texture2D(map, sampleUv).g;
            float b = texture2D(map, sampleUv - vec2(g,  0.0)).b;
            float a = texture2D(map, sampleUv).a;
            col = vec4(r, gr, b, a);
          } else {
            /* Fallback body silhouette */
            float torso  = smoothstep(0.30, 0.27, abs(uv.x - 0.5)) * smoothstep(0.08,0.12,uv.y) * smoothstep(0.1,0.14,1.0-uv.y);
            float legs   = smoothstep(0.22, 0.19, abs(uv.x - 0.5)) * smoothstep(0.06,0.1,uv.y)   * step(uv.y, 0.42);
            col = vec4(0.85, 0.65, 0.55, (torso + legs * 0.7) * 0.45);
          }

          /* Holographic tint */
          vec3 tint = mix(vec3(0.9,0.87,1.05), vec3(1.05,0.93,0.62), pulse*0.4);
          col.rgb *= tint;

          /* Scan sweep */
          float sd = abs(uv.y - scanPos);
          col.rgb += smoothstep(0.055, 0.0, sd) * vec3(0.2, 1.0, 0.5) * 0.85;

          /* Scan texture */
          col.rgb *= 0.86 + (sin(uv.y * 220.0)*0.5+0.5) * 0.14;

          /* Edge vignette */
          vec2 c2 = uv - 0.5;
          float v = clamp(1.0 - dot(c2*1.75, c2*1.75), 0.0, 1.0);
          col.a  *= v * v;

          /* Pulse brightness */
          col.rgb *= 1.0 + pulse * 0.22;

          gl_FragColor = col;
        }
      `,
    })

    const bodyMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 17, 1, 1),
      bodyShader
    )
    bodyMesh.position.set(0, 0.5, 0)
    scene.add(bodyMesh)

    const texLoader = new THREE.TextureLoader()
    texLoader.load('/anatomy-body.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      bodyShader.uniforms.map.value        = tex
      bodyShader.uniforms.hasTexture.value = 1
    }, undefined, () => {
      console.warn('anatomy-body.png not found — fallback silhouette active')
    })

    /* ═══════════════════════════════════════════════════
       ② ORBITAL RINGS around the body (3 axis planes)
    ═══════════════════════════════════════════════════ */
    const orbitRings: { mesh: THREE.Mesh; speed: number; axis: THREE.Vector3 }[] = []

    const ringDefs = [
      { radius: 6.5,  tube: 0.03, color: 0xffd060, tilt: 0,            axis: new THREE.Vector3(0,1,0), speed:  0.4  },
      { radius: 7.2,  tube: 0.02, color: 0x4caf50,  tilt: Math.PI/5,   axis: new THREE.Vector3(1,0,0), speed: -0.28 },
      { radius: 6.8,  tube: 0.02, color: 0x4ab8ff,  tilt: -Math.PI/6,  axis: new THREE.Vector3(0,0,1), speed:  0.22 },
      { radius: 8.0,  tube: 0.015,color: 0xc488ff,  tilt: Math.PI/3,   axis: new THREE.Vector3(1,1,0).normalize(), speed: -0.15 },
    ]

    ringDefs.forEach(d => {
      const mat = new THREE.MeshBasicMaterial({
        color: d.color, transparent: true, opacity: 0.35,
        blending: THREE.AdditiveBlending,
      })
      const ring = new THREE.Mesh(new THREE.TorusGeometry(d.radius, d.tube, 6, 120), mat)
      ring.rotation.x = d.tilt
      scene.add(ring)
      orbitRings.push({ mesh: ring, speed: d.speed, axis: d.axis })
    })

    /* ═══════════════════════════════════════════════════
       ③ HOTSPOT NODES orbiting at body surface radius
    ═══════════════════════════════════════════════════ */
    interface HotNode {
      dot:   THREE.Mesh
      ring:  THREE.Mesh
      pulse: THREE.Mesh
      angle: number
      yPos:  number
      id:    string
      phase: number
    }
    const hotNodes: HotNode[] = []

    MUSCLE_LABELS.forEach((ml, i) => {
      const col = new THREE.Color(ml.color)
      const angle = (ml.angle * Math.PI) / 180
      const r = 5.2  // radius from centre

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 14, 14),
        new THREE.MeshBasicMaterial({ color: col })
      )

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.18, 0.28, 32),
        new THREE.MeshBasicMaterial({
          color: col, transparent: true, opacity: 0.7,
          side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        })
      )

      // Outer pulse ring
      const pulse = new THREE.Mesh(
        new THREE.RingGeometry(0.2, 0.26, 32),
        new THREE.MeshBasicMaterial({
          color: col, transparent: true, opacity: 0,
          side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        })
      )

      const x = Math.sin(angle) * r
      const z = Math.cos(angle) * r
      dot.position.set(x, ml.yPos, z)
      ring.position.set(x, ml.yPos, z)
      pulse.position.set(x, ml.yPos, z)

      // Always face camera — handled in animate loop
      scene.add(dot); scene.add(ring); scene.add(pulse)
      hotNodes.push({ dot, ring, pulse, angle, yPos: ml.yPos, id: ml.id, phase: i / MUSCLE_LABELS.length })
    })

    /* ═══════════════════════════════════════════════════
       ④ SPINE ENERGY LINE (vertical, through body centre)
    ═══════════════════════════════════════════════════ */
    const spinePoints: THREE.Vector3[] = []
    for (let i = 0; i <= 28; i++) {
      spinePoints.push(new THREE.Vector3(
        Math.sin(i * 0.22) * 0.12,
        7.5 - i * 0.55,
        0.1
      ))
    }
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(spinePoints),
      new THREE.LineBasicMaterial({ color: 0x4caf50, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending })
    ))

    /* ═══════════════════════════════════════════════════
       ⑤ TRAVELLING DATA PACKETS along orbital rings
    ═══════════════════════════════════════════════════ */
    const PACKET_N = 60
    const pktPos = new Float32Array(PACKET_N * 3)
    const pktCol = new Float32Array(PACKET_N * 3)
    const pktAngles = new Float32Array(PACKET_N)
    const pktRadii  = new Float32Array(PACKET_N)
    const pktSpeeds = new Float32Array(PACKET_N)
    const pktYOff   = new Float32Array(PACKET_N)
    const pktColors = [new THREE.Color(0xffd060), new THREE.Color(0x6edd72), new THREE.Color(0x4dd9d9), new THREE.Color(0xc488ff)]

    for (let i = 0; i < PACKET_N; i++) {
      pktAngles[i] = Math.random() * Math.PI * 2
      pktRadii[i]  = 5.5 + Math.random() * 2.5
      pktSpeeds[i] = (0.4 + Math.random() * 0.6) * (Math.random() < 0.5 ? 1 : -1)
      pktYOff[i]   = (Math.random() - 0.5) * 14
      const c = pktColors[Math.floor(Math.random() * pktColors.length)]
      pktCol[i*3]=c.r; pktCol[i*3+1]=c.g; pktCol[i*3+2]=c.b
    }

    const pktGeo = new THREE.BufferGeometry()
    pktGeo.setAttribute('position', new THREE.BufferAttribute(pktPos, 3))
    pktGeo.setAttribute('color',    new THREE.BufferAttribute(pktCol, 3))
    scene.add(new THREE.Points(pktGeo, new THREE.PointsMaterial({
      size: 0.12, vertexColors: true, transparent: true, opacity: 0.85,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
    })))

    /* ═══════════════════════════════════════════════════
       ⑥ AMBIENT STAR PARTICLES
    ═══════════════════════════════════════════════════ */
    const STAR_N = 500
    const sPos = new Float32Array(STAR_N * 3)
    const sCol = new Float32Array(STAR_N * 3)
    const sPal = [new THREE.Color(0xffd87a), new THREE.Color(0x6edd72), new THREE.Color(0x55ccff), new THREE.Color(0xff8877), new THREE.Color(0xc488ff)]
    for (let i = 0; i < STAR_N; i++) {
      sPos[i*3]   = (Math.random() - 0.5) * 60
      sPos[i*3+1] = (Math.random() - 0.5) * 40
      sPos[i*3+2] = (Math.random() - 0.5) * 60
      const c = sPal[Math.floor(Math.random() * sPal.length)]
      sCol[i*3]=c.r; sCol[i*3+1]=c.g; sCol[i*3+2]=c.b
    }
    const sGeo = new THREE.BufferGeometry()
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
    sGeo.setAttribute('color',    new THREE.BufferAttribute(sCol, 3))
    const stars = new THREE.Points(sGeo, new THREE.PointsMaterial({
      size: 0.08, vertexColors: true, transparent: true, opacity: 0.6,
      sizeAttenuation: true, blending: THREE.AdditiveBlending,
    }))
    scene.add(stars)

    /* ═══════════════════════════════════════════════════
       ⑦ FLOATING EQUIPMENT (orbiting at large radius)
    ═══════════════════════════════════════════════════ */
    const matGold   = new THREE.MeshStandardMaterial({ color:0xffd060, metalness:0.75, roughness:0.18, emissive:new THREE.Color(0xc9a84c), emissiveIntensity:0.5 })
    const matDark   = new THREE.MeshStandardMaterial({ color:0x3a4f60, metalness:0.65, roughness:0.3,  emissive:new THREE.Color(0x1a2f3a), emissiveIntensity:0.25 })
    const matCyan   = new THREE.MeshStandardMaterial({ color:0x4dd9d9, metalness:0.2,  roughness:0.35, emissive:new THREE.Color(0x0a8a8a), emissiveIntensity:0.5 })
    const matGreen  = new THREE.MeshStandardMaterial({ color:0x5dde64, metalness:0.15, roughness:0.35, emissive:new THREE.Color(0x3aab3e), emissiveIntensity:0.45 })
    const matRed    = new THREE.MeshStandardMaterial({ color:0xff5f4e, metalness:0.1,  roughness:0.5,  emissive:new THREE.Color(0xc0291a), emissiveIntensity:0.5 })

    interface EquipObj { mesh:THREE.Object3D; orbitAngle:number; orbitRadius:number; orbitSpeed:number; orbitY:number; rotSpeed:THREE.Vector3; floatPhase:number }
    const equips: EquipObj[] = []

    function spawnEquip(mesh: THREE.Object3D, orbitAngle: number, orbitRadius: number, orbitY: number, orbitSpeed: number, scale = 1) {
      mesh.scale.setScalar(scale)
      mesh.rotation.set(Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI*2)
      scene.add(mesh)
      equips.push({
        mesh, orbitAngle, orbitRadius, orbitSpeed, orbitY,
        rotSpeed: new THREE.Vector3((Math.random()-0.5)*0.008,(Math.random()-0.5)*0.01,(Math.random()-0.5)*0.006),
        floatPhase: Math.random()*Math.PI*2,
      })
    }

    function makeDumbbell() {
      const g = new THREE.Group()
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,2.2,12), matDark); bar.rotation.z=Math.PI/2; g.add(bar)
      ;[-1.0,1.0].forEach(x=>{
        const p=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.26,16),matGold); p.rotation.z=Math.PI/2; p.position.x=x; g.add(p)
        const r=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.04,8,16),matDark); r.position.x=x; r.rotation.y=Math.PI/2; g.add(r)
      }); return g
    }
    function makeRoller() {
      const g=new THREE.Group(); g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.44,0.44,2.3,20),matCyan))
      for(let i=-4;i<=4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(0.46,0.03,6,20),matDark); r.position.y=i*0.24; r.rotation.x=Math.PI/2; g.add(r)}; return g
    }
    function makeBand(m:THREE.Material){const g=new THREE.Group(); g.add(new THREE.Mesh(new THREE.TorusGeometry(0.9,0.13,9,40),m)); return g}
    function makeBall(m:THREE.Material){return new THREE.Mesh(new THREE.SphereGeometry(0.9,24,24),m)}
    function makeTapeRoll(){
      const g=new THREE.Group(); g.add(new THREE.Mesh(new THREE.TorusGeometry(0.5,0.22,10,28),matRed))
      const c=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,0.46,10),matDark); c.rotation.x=Math.PI/2; g.add(c); return g
    }

    // Orbit equipment at radius 11–14, spread around 360°
    spawnEquip(makeDumbbell(),    0,    12, 2.5,  0.18, 1.0)
    spawnEquip(makeDumbbell(),    2.4,  13, -3.0, 0.14, 0.85)
    spawnEquip(makeRoller(),      1.1,  11, 1.5, -0.16, 0.9)
    spawnEquip(makeRoller(),      3.8,  12, -2.0, 0.12, 0.8)
    spawnEquip(makeBand(matGreen),0.6,  13, 3.0, -0.2,  1.0)
    spawnEquip(makeBand(matRed),  2.0,  12, -4.0, 0.17, 0.9)
    spawnEquip(makeBall(matGreen),4.5,  11, 4.0,  0.13, 1.0)
    spawnEquip(makeBall(matCyan), 1.8,  14, -1.5,-0.11, 0.9)
    spawnEquip(makeTapeRoll(),    3.2,  12, 2.0,  0.19, 0.95)
    spawnEquip(makeTapeRoll(),    5.5,  13, -3.5,-0.15, 0.85)

    /* ═══════════════════════════════════════════════════
       POINTER / TOUCH — drag to orbit camera
    ═══════════════════════════════════════════════════ */
    const onPointerDown = (e: PointerEvent) => {
      s.isDragging  = true
      s.autoRotate  = false
      s.lastX = e.clientX
      s.lastY = e.clientY
      renderer.domElement.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!s.isDragging) return
      const dx = e.clientX - s.lastX
      const dy = e.clientY - s.lastY
      s.theta -= dx * 0.008
      s.phi    = Math.max(0.3, Math.min(Math.PI - 0.3, s.phi + dy * 0.006))
      s.lastX  = e.clientX
      s.lastY  = e.clientY
    }
    const onPointerUp = () => { s.isDragging = false }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup',   onPointerUp)
    renderer.domElement.style.cursor = 'grab'

    // Resume auto-rotate after 3s idle
    let idleTimer: ReturnType<typeof setTimeout>
    const onActivity = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => { s.autoRotate = true; setIsAutoRotate(true) }, 3000)
    }
    renderer.domElement.addEventListener('pointerdown', onActivity)

    /* ═══════════════════════════════════════════════════
       ANIMATION LOOP
    ═══════════════════════════════════════════════════ */
    let raf = 0
    const clock = new THREE.Clock()

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      // const dt = clock.getDelta ? 0.016 : 0.016

      /* Auto-rotate */
      if (s.autoRotate) {
        s.theta += 0.004
      }

      /* Camera spherical position */
      const sinPhi = Math.sin(s.phi)
      camera.position.x = CAM_RADIUS * sinPhi * Math.sin(s.theta)
      camera.position.y = CAM_RADIUS * Math.cos(s.phi) + CAM_Y
      camera.position.z = CAM_RADIUS * sinPhi * Math.cos(s.theta)
      camera.lookAt(0, 1, 0)

      // Expose angle to React UI
      const deg = (((-s.theta * 180) / Math.PI) % 360 + 360) % 360
      setViewAngle(Math.round(deg))

      /* Body shader */
      bodyShader.uniforms.time.value     = t
      bodyShader.uniforms.scanPos.value  = Math.sin(t * 0.42) * 0.5 + 0.5
      bodyShader.uniforms.pulse.value    = Math.max(0, Math.sin(t * 1.85)) ** 5
      bodyShader.uniforms.glitchAmt.value = Math.random() < 0.012 ? Math.random() * 2 : 0

      /* Body float */
      bodyMesh.position.y = 0.5 + Math.sin(t * 0.55) * 0.12

      /* Orbital rings spin on their axes */
      orbitRings.forEach(or => {
        or.mesh.rotateOnAxis(or.axis, or.speed * 0.012)
      })

      /* Hotspot nodes: always face camera, pulse rings expand */
      hotNodes.forEach((hn, i) => {
        // Keep at fixed radius — nodes don't orbit, they sit at fixed world positions
        const a  = hn.angle
        const r  = 5.2
        const x  = Math.sin(a) * r
        const z  = Math.cos(a) * r
        hn.dot.position.set(x, hn.yPos + Math.sin(t * 1.5 + hn.phase * 6) * 0.08, z)
        hn.ring.position.copy(hn.dot.position)
        hn.pulse.position.copy(hn.dot.position)

        // Face camera
        hn.dot.lookAt(camera.position)
        hn.ring.lookAt(camera.position)
        hn.pulse.lookAt(camera.position)

        // Expand pulse ring
        const cycle = ((t * 0.8 + hn.phase) % 1)
        hn.pulse.scale.setScalar(1 + cycle * 5)
        ;(hn.pulse.material as THREE.MeshBasicMaterial).opacity = (1 - cycle) * 0.65

        // Breathe dot
        hn.dot.scale.setScalar(0.88 + Math.sin(t * 2.5 + i) * 0.18)
      })

      /* Data packets orbit */
      const pp = pktGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PACKET_N; i++) {
        pktAngles[i] += pktSpeeds[i] * 0.014
        pp[i*3]   = Math.sin(pktAngles[i]) * pktRadii[i]
        pp[i*3+1] = pktYOff[i] + Math.sin(t * 0.6 + i * 0.3) * 0.3
        pp[i*3+2] = Math.cos(pktAngles[i]) * pktRadii[i]
      }
      pktGeo.attributes.position.needsUpdate = true

      /* Equipment orbit */
      equips.forEach(eq => {
        eq.orbitAngle += eq.orbitSpeed * 0.012
        const ox = Math.sin(eq.orbitAngle) * eq.orbitRadius
        const oz = Math.cos(eq.orbitAngle) * eq.orbitRadius
        const oy = eq.orbitY + Math.sin(t * 0.5 + eq.floatPhase) * 0.3
        eq.mesh.position.set(ox, oy, oz)
        eq.mesh.rotation.x += eq.rotSpeed.x
        eq.mesh.rotation.y += eq.rotSpeed.y
        eq.mesh.rotation.z += eq.rotSpeed.z
      })

      /* Stars slow drift */
      stars.rotation.y = t * 0.008

      /* Pulsing lights */
      goldL.intensity  = 12 + Math.sin(t * 1.4) * 3
      greenL.intensity = 10 + Math.sin(t * 1.9 + 1) * 2.5
      blueL.intensity  =  7 + Math.sin(t * 1.1 + 2) * 2

      renderer.render(scene, camera)
    }
    animate()

    /* Resize */
    const onResize = () => {
      const w = el.clientWidth; const h = el.clientHeight
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(idleTimer)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup',   onPointerUp)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  const active = MUSCLE_LABELS.find(m => m.id === activeId)

  return (
    <div className="relative " style={{ minHeight: 500, background: '#030a10' }}>

      {/* Three.js mount */}
      <div ref={mountRef} className="absolute inset-0 "
        style={{ cursor: 'grab' }} />

      {/* Edge vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 42%, rgba(3,10,16,0.4) 72%, rgba(3,10,16,0.9) 100%)',
      }} />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)',
      }} />

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 pt-4 pointer-events-none">
        <motion.div className="flex items-center gap-2"
          initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7 }}>
          <span className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#4caf50]">
            360° Anatomy Viewer
          </span>
        </motion.div>

        <motion.div className="flex items-center gap-3"
          initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7 }}>
          <span className="text-[10px] font-mono text-[rgba(201,168,76,0.7)] tracking-wider">
            {String(viewAngle).padStart(3,'0')}°
          </span>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
            {isAutoRotate ? 'AUTO' : 'MANUAL'}
          </span>
        </motion.div>
      </div>

      {/* ── COMPASS RING (bottom centre) ── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none">
        <motion.div
          initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.8, delay:0.5 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1"
              strokeDasharray={`${(viewAngle / 360) * 226} 226`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dasharray 0.1s linear' }}
            />
            {/* Cardinal marks */}
            {['N','E','S','W'].map((d,i) => {
              const a = (i*90 - 90) * Math.PI / 180
              return (
                <text key={d} x={40 + Math.cos(a)*28} y={40 + Math.sin(a)*28 + 3.5}
                  textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="monospace">{d}</text>
              )
            })}
            {/* Pointer needle */}
            <line
              x1="40" y1="40"
              x2={40 + Math.cos((viewAngle - 90) * Math.PI / 180) * 22}
              y2={40 + Math.sin((viewAngle - 90) * Math.PI / 180) * 22}
              stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"
            />
            <circle cx="40" cy="40" r="2.5" fill="#C9A84C"/>
          </svg>
        </motion.div>
      </div>

      {/* ── MUSCLE HOTSPOT BUTTONS (floating labels) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {MUSCLE_LABELS.map((ml, i) => {
          // Calculate screen-space rough position based on angle relative to camera
          const isRight = ml.angle < 180
          return (
            <motion.button
              key={ml.id}
              className="absolute pointer-events-auto flex items-center gap-1.5 group"
              style={{
                right:  isRight ? `${8 + (i % 3) * 2}%` : 'auto',
                left:   isRight ? 'auto' : `${8 + (i % 3) * 2}%`,
                top:    `${18 + i * 8.5}%`,
              }}
              initial={{ opacity:0, x: isRight ? 12 : -12 }}
              animate={{ opacity:1, x:0 }}
              transition={{ duration:0.6, delay:0.8 + i * 0.08 }}
              onClick={() => setActiveId(prev => prev === ml.id ? null : ml.id)}
            >
              {!isRight && (
                <>
                  <span className="w-5 h-[1px] opacity-40" style={{ background: ml.color }} />
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: ml.color, boxShadow:`0 0 8px ${ml.color}` }} />
                  <span className="text-[9px] font-mono uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ color: ml.color, textShadow:`0 0 12px ${ml.color}90` }}>
                    {ml.label}
                  </span>
                </>
              )}
              {isRight && (
                <>
                  <span className="text-[9px] font-mono uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ color: ml.color, textShadow:`0 0 12px ${ml.color}90` }}>
                    {ml.label}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: ml.color, boxShadow:`0 0 8px ${ml.color}` }} />
                  <span className="w-5 h-[1px] opacity-40" style={{ background: ml.color }} />
                </>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* ── MUSCLE DETAIL CARD ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto"
            initial={{ opacity:0, y:12, scale:0.94 }}
            animate={{ opacity:1, y:0,  scale:1    }}
            exit={{    opacity:0, y:8,  scale:0.96 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 py-3 rounded-xl text-center"
              style={{ background:'rgba(5,12,20,0.85)', border:`1px solid ${active.color}30`, backdropFilter:'blur(12px)', minWidth:200 }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background:active.color, boxShadow:`0 0 8px ${active.color}` }} />
                <span className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color:active.color }}>
                  {active.label}
                </span>
              </div>
              <p className="text-[11px] text-white/55 font-sans">{active.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DRAG HINT ── */}
      <motion.div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1, delay:2 }}>
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/25">
          Drag to rotate · Click markers for details
        </span>
      </motion.div>

      {/* Corner brackets */}
      {['top-3 left-3 border-t border-l','top-3 right-3 border-t border-r',
        'bottom-3 left-3 border-b border-l','bottom-3 right-3 border-b border-r'].map((cls,i)=>(
        <motion.div key={i} className={`absolute w-6 h-6 pointer-events-none ${cls}`}
          style={{ borderColor:'rgba(201,168,76,0.35)' }}
          initial={{ opacity:0, scale:0.4 }} animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.5, delay:0.6+i*0.08 }} />
      ))}
    </div>
  )
}