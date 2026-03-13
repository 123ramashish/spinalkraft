'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function SpineScene({ height = '420px' }: { height?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 11)

    /* ── LIGHTING ── */
    scene.add(new THREE.AmbientLight('#ffffff', 0.25))
    const gL = new THREE.PointLight('#C9A84C', 5, 25); gL.position.set(4, 5, 6); scene.add(gL)
    const eL = new THREE.PointLight('#4CAF50', 4, 25); eL.position.set(-4,-3, 5); scene.add(eL)
    const bL = new THREE.PointLight('#ffffff',  1, 20); bL.position.set(0, 0,-8); scene.add(bL)

    /* ── SPINE VERTEBRAE ── */
    const VERTS = 14
    const spineGroup = new THREE.Group()
    const vMeshes: THREE.Mesh[] = []

    for (let i = 0; i < VERTS; i++) {
      const t     = i / (VERTS - 1)
      const wide  = i < 5 ? 1.0 : i < 9 ? 0.80 : 0.62
      const y     = (t - 0.5) * -10

      // Vertebral body (rounded box)
      const vGeo = new THREE.BoxGeometry(wide * 1.3, 0.55, 1.1)
      const isGold = i % 2 === 0
      const vMat = new THREE.MeshStandardMaterial({
        color:    isGold ? '#C9A84C' : '#4CAF50',
        emissive: isGold ? '#5c3d00' : '#004d00',
        emissiveIntensity: 0.5,
        metalness: 0.75, roughness: 0.25,
      })
      const vM = new THREE.Mesh(vGeo, vMat)
      vM.position.y = y
      spineGroup.add(vM)
      vMeshes.push(vM)

      // Transverse processes (side wings)
      for (const side of [-1, 1]) {
        const tGeo = new THREE.CylinderGeometry(0.07, 0.07, wide * 0.9, 8)
        const tMat = new THREE.MeshStandardMaterial({ color: isGold ? '#A8872F' : '#388E3C', metalness: 0.7, roughness: 0.3 })
        const tM   = new THREE.Mesh(tGeo, tMat)
        tM.position.set(side * wide * 0.8, y, 0)
        tM.rotation.z = Math.PI / 2
        spineGroup.add(tM)
      }

      // Spinous process (posterior spike)
      const spGeo = new THREE.ConeGeometry(0.12, 0.55, 8)
      const spMat = new THREE.MeshStandardMaterial({ color: isGold ? '#E8C96A' : '#6DD671', metalness: 0.6, roughness: 0.35 })
      const sp    = new THREE.Mesh(spGeo, spMat)
      sp.position.set(0, y, -0.8)
      sp.rotation.x = -Math.PI / 2.2
      spineGroup.add(sp)

      // Intervertebral disc
      if (i < VERTS - 1) {
        const dGeo = new THREE.CylinderGeometry(wide * 0.55, wide * 0.55, 0.22, 24)
        const dMat = new THREE.MeshStandardMaterial({ color:'#1a3a50', transparent:true, opacity:0.9, roughness:0.9 })
        const d    = new THREE.Mesh(dGeo, dMat)
        d.position.y = y - 0.42
        spineGroup.add(d)
      }
    }
    scene.add(spineGroup)
    spineGroup.position.set(1.5, 0, 0)

    /* ── GLOWING SPINAL CORD ── */
    const cordPts: THREE.Vector3[] = []
    for (let i = 0; i <= 60; i++) {
      const t = i / 60
      cordPts.push(new THREE.Vector3(
        0.05 * Math.sin(t * Math.PI * 5),
        (t - 0.5) * -10.5,
        0.1 * Math.cos(t * Math.PI * 4)
      ))
    }
    const cordTube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cordPts), 100, 0.1, 10, false)
    const cordMat  = new THREE.MeshStandardMaterial({
      color: '#E8C96A', emissive: '#C9A84C', emissiveIntensity: 1.5,
      metalness: 0.3, roughness: 0.2, transparent: true, opacity: 0.9,
    })
    const cord = new THREE.Mesh(cordTube, cordMat)
    cord.position.set(1.5, 0, 0)
    scene.add(cord)

    /* ── FLOATING PARTICLES ── */
    const P = 180
    const pPos  = new Float32Array(P * 3)
    const pCol  = new Float32Array(P * 3)
    const pSize = new Float32Array(P)
    for (let i = 0; i < P; i++) {
      pPos[i*3]   = 1.5 + (Math.random() - .5) * 6
      pPos[i*3+1] = (Math.random() - .5) * 12
      pPos[i*3+2] = (Math.random() - .5) * 4
      const c = Math.random() < .5 ? new THREE.Color('#C9A84C') : new THREE.Color('#4CAF50')
      pCol[i*3] = c.r; pCol[i*3+1] = c.g; pCol[i*3+2] = c.b
      pSize[i] = Math.random() * 4 + 1.5
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,  3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol,  3))
    pGeo.setAttribute('size',     new THREE.BufferAttribute(pSize, 1))
    const pMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float size; varying vec3 vColor; uniform float time;
        void main(){ vColor=color; vec3 p=position;
          p.x += sin(time*0.9+position.y*1.5)*0.18;
          p.z += cos(time*0.7+position.x*1.2)*0.12;
          vec4 mv=modelViewMatrix*vec4(p,1.);
          gl_PointSize=size*(260./-mv.z); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying vec3 vColor; void main(){
        float d=length(gl_PointCoord-vec2(.5)); if(d>.5)discard;
        gl_FragColor=vec4(vColor, exp(-d*4.5)*0.85); }`,
    })
    scene.add(new THREE.Points(pGeo, pMat))

    /* ── ENERGY ORBS ORBITING ── */
    const orbGroup = new THREE.Group()
    const ORB_N = 7
    const orbMeshes: THREE.Mesh[] = []
    for (let i = 0; i < ORB_N; i++) {
      const a   = (i / ORB_N) * Math.PI * 2
      const isG = i % 2 === 0
      const oGeo = new THREE.SphereGeometry(0.13 + Math.random()*0.08, 16, 16)
      const oMat = new THREE.MeshStandardMaterial({
        color:   isG ? '#C9A84C' : '#4CAF50',
        emissive: isG ? '#C9A84C' : '#4CAF50',
        emissiveIntensity: 2.0, metalness: 0.9, roughness: 0.05,
      })
      const orb = new THREE.Mesh(oGeo, oMat)
      orb.position.set(Math.cos(a)*3.2 - 1.5, Math.sin(a)*3.2, 0)
      orbGroup.add(orb)
      orbMeshes.push(orb)
    }
    scene.add(orbGroup)

    /* ── ENERGY LINES connecting spine to orbs ── */
    const energyPts = new Float32Array(ORB_N * 2 * 3)
    const eGeo = new THREE.BufferGeometry()
    eGeo.setAttribute('position', new THREE.BufferAttribute(energyPts, 3))
    const eLines = new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({
      color: '#C9A84C', transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending,
    }))
    scene.add(eLines)

    /* ── TORUS around spine ── */
    const torusGeo = new THREE.TorusGeometry(2.2, 0.04, 8, 80)
    const torusMat = new THREE.MeshBasicMaterial({ color: '#C9A84C', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending })
    const torus1 = new THREE.Mesh(torusGeo, torusMat)
    torus1.rotation.y = Math.PI/2
    torus1.position.set(1.5, 0, 0)
    scene.add(torus1)

    /* ── MOUSE PARALLAX ── */
    let mx = 0, my = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - .5) * .45
      my = -(e.clientY / window.innerHeight - .5) * .45
    }
    window.addEventListener('mousemove', onMouse)

    const clock = new THREE.Clock(); let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      pMat.uniforms.time.value = t

      // Spine sway
      spineGroup.rotation.y = Math.sin(t * 0.35) * 0.25
      cord.rotation.y       = Math.sin(t * 0.35) * 0.25

      // Pulse vertebrae
      vMeshes.forEach((m, i) => {
        const s = 1 + 0.05 * Math.sin(t * 1.6 + i * 0.55)
        m.scale.set(s, 1, s)
        ;(m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + 0.4 * Math.sin(t * 1.3 + i * 0.7)
      })

      // Cord pulse
      cordMat.emissiveIntensity = 1.2 + 0.8 * Math.sin(t * 2.0)

      // Orbit orbs
      orbGroup.rotation.z = t * 0.28
      orbGroup.rotation.x = Math.sin(t * 0.15) * 0.3

      // Update energy lines
      const ep = eGeo.attributes.position.array as Float32Array
      orbMeshes.forEach((o, i) => {
        const wp = new THREE.Vector3(); o.getWorldPosition(wp)
        ep[i*6]   = 1.5; ep[i*6+1] = wp.y * 0.3; ep[i*6+2] = 0
        ep[i*6+3] = wp.x; ep[i*6+4] = wp.y; ep[i*6+5] = wp.z
      })
      eGeo.attributes.position.needsUpdate = true

      // Torus spin
      torus1.rotation.z = t * 0.4

      // Lights pulse
      gL.intensity = 4 + 2.5 * Math.sin(t * 1.2)
      eL.intensity = 3 + 2.0 * Math.sin(t * 0.85 + 1.5)

      // Camera
      camera.position.x += (mx * 1.5 - camera.position.x) * 0.03
      camera.position.y += (my * 1.0 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)

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
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height, display: 'block' }} aria-hidden />
}
