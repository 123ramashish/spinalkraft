'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ContactScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const mobile = window.innerWidth < 768

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 4, mobile ? 16 : 12)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.AmbientLight('#ffffff', 0.15))
    const gL = new THREE.PointLight('#C9A84C', 6, 30); gL.position.set(0, 5, 5);  scene.add(gL)
    const eL = new THREE.PointLight('#4CAF50', 4, 25); eL.position.set(-4,-2, 4); scene.add(eL)

    /* ── GRID FLOOR ── */
    const GRID_SIZE = 28
    const GRID_DIV  = 28
    const gGeo = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, GRID_DIV, GRID_DIV)
    const gMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
      wireframe: true,
      vertexShader: `
        varying vec2 vUv; varying float vDist; uniform float time;
        void main(){
          vUv = uv;
          float dist = length(position.xz);
          float wave = 0.35 * sin(dist * 0.7 - time * 1.5);
          vDist = dist;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, wave, position.z, 1.0);
        }`,
      fragmentShader: `
        varying vec2 vUv; varying float vDist; uniform float time;
        void main(){
          float fade = 1.0 - smoothstep(4.0, 14.0, vDist);
          float t = 0.5 + 0.5*sin(time*0.8 + vDist*0.4);
          vec3 col = mix(vec3(0.788,0.659,0.298), vec3(0.298,0.686,0.314), t);
          gl_FragColor = vec4(col, fade * 0.25);
        }`,
    })
    const grid = new THREE.Mesh(gGeo, gMat)
    grid.rotation.x = -Math.PI / 2
    scene.add(grid)

    /* ── LOCATION PIN (central) ── */
    const pinGroup = new THREE.Group()

    // Pin sphere
    const pinSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 32, 32),
      new THREE.MeshStandardMaterial({ color:'#C9A84C', emissive:'#C9A84C', emissiveIntensity:2, metalness:0.8, roughness:0.1 })
    )
    pinGroup.add(pinSphere)

    // Pin stem
    const stemGeo = new THREE.CylinderGeometry(0.06, 0.0, 1.0, 12)
    const stemMat = new THREE.MeshStandardMaterial({ color:'#E8C96A', emissive:'#C9A84C', emissiveIntensity:1.5, metalness:0.8, roughness:0.2 })
    const stem    = new THREE.Mesh(stemGeo, stemMat)
    stem.position.y = -0.65
    pinGroup.add(stem)
    scene.add(pinGroup)

    /* ── CONCENTRIC PULSE RINGS from pin ── */
    const PULSE_COUNT = 5
    const pulseRings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number }[] = []
    for (let i = 0; i < PULSE_COUNT; i++) {
      const geo = new THREE.TorusGeometry(1, 0.04, 8, 60)
      const mat = new THREE.MeshBasicMaterial({ color:'#C9A84C', transparent:true, opacity:0, blending:THREE.AdditiveBlending })
      const ring = new THREE.Mesh(geo, mat)
      ring.rotation.x = Math.PI / 2
      ring.position.y = 0.05
      scene.add(ring)
      pulseRings.push({ mesh: ring, mat, phase: i / PULSE_COUNT })
    }

    /* ── CITY DOTS (surrounding "buildings") ── */
    const cityGroup = new THREE.Group()
    const DOT_N = mobile ? 40 : 80
    for (let i = 0; i < DOT_N; i++) {
      const a  = Math.random() * Math.PI * 2
      const r  = 1.5 + Math.random() * 7
      const h  = Math.random() * 1.2 + 0.1
      const isG= Math.random() < .5
      const geo = new THREE.BoxGeometry(0.12, h, 0.12)
      const mat = new THREE.MeshStandardMaterial({
        color: isG ? '#C9A84C' : '#4CAF50', emissive: isG ? '#C9A84C' : '#4CAF50',
        emissiveIntensity: 0.4 + Math.random() * 0.6, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.7,
      })
      const b = new THREE.Mesh(geo, mat)
      b.position.set(Math.cos(a)*r, h/2, Math.sin(a)*r)
      cityGroup.add(b)
    }
    scene.add(cityGroup)

    /* ── CONNECTION LINES from pin to random dots ── */
    const connN = Math.min(12, cityGroup.children.length)
    const connLinePos = new Float32Array(connN * 2 * 3)
    const connGeo = new THREE.BufferGeometry()
    connGeo.setAttribute('position', new THREE.BufferAttribute(connLinePos, 3))
    const connLines = new THREE.LineSegments(connGeo, new THREE.LineBasicMaterial({
      color:'#C9A84C', transparent:true, opacity:0.12, blending:THREE.AdditiveBlending,
    }))
    scene.add(connLines)

    // Pick random dots to connect to
    const connDots = Array.from({ length: connN }, (_, i) => cityGroup.children[Math.floor(Math.random() * cityGroup.children.length)] as THREE.Mesh)

    /* ── FLOATING PARTICLES above city ── */
    const P = mobile ? 80 : 160
    const fPos = new Float32Array(P * 3)
    const fCol = new Float32Array(P * 3)
    const fSz  = new Float32Array(P)
    for (let i = 0; i < P; i++) {
      fPos[i*3]   = (Math.random() - .5) * 24
      fPos[i*3+1] = Math.random() * 6
      fPos[i*3+2] = (Math.random() - .5) * 24
      const c = Math.random()<.5 ? new THREE.Color('#C9A84C') : new THREE.Color('#4CAF50')
      fCol[i*3]=c.r; fCol[i*3+1]=c.g; fCol[i*3+2]=c.b
      fSz[i] = Math.random() * 3 + 1
    }
    const fGeo = new THREE.BufferGeometry()
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3))
    fGeo.setAttribute('color',    new THREE.BufferAttribute(fCol, 3))
    fGeo.setAttribute('size',     new THREE.BufferAttribute(fSz,  1))
    const fMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float size; varying vec3 vColor; uniform float time;
        void main(){ vColor=color; vec3 p=position;
          p.y+=sin(time*0.6+position.x*0.8)*0.15;
          vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=size*(220./-mv.z); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying vec3 vColor; void main(){
        float d=length(gl_PointCoord-vec2(.5)); if(d>.5)discard;
        gl_FragColor=vec4(vColor, exp(-d*4.0)*0.8); }`,
    })
    scene.add(new THREE.Points(fGeo, fMat))

    /* ── MOUSE PARALLAX ── */
    let mx = 0, my = 0, smx = 0, smy = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - .5) * .4
      my = -(e.clientY / window.innerHeight - .5) * .4
    }
    window.addEventListener('mousemove', onMouse)

    const clock = new THREE.Clock(); let raf: number

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      gMat.uniforms.time.value = t
      fMat.uniforms.time.value = t

      // Pin bob
      pinGroup.position.y = 0.8 + Math.sin(t * 1.8) * 0.15

      // Pulse rings expand outward
      pulseRings.forEach(({ mesh, mat, phase }) => {
        const cycle = ((t * 0.5 + phase) % 1)
        const r     = 1 + cycle * 8
        mesh.scale.setScalar(r)
        mat.opacity = (1 - cycle) * 0.5
      })

      // City dot flicker
      cityGroup.children.forEach((b, i) => {
        const m = (b as THREE.Mesh).material as THREE.MeshStandardMaterial
        m.emissiveIntensity = 0.4 + 0.5 * Math.abs(Math.sin(t * 0.8 + i * 0.45))
      })

      // Update connection lines
      const cp = connGeo.attributes.position.array as Float32Array
      connDots.forEach((dot, i) => {
        cp[i*6]=0; cp[i*6+1]=pinGroup.position.y; cp[i*6+2]=0
      })
      connGeo.attributes.position.needsUpdate = true

      // Lights
      gL.intensity = 5+3*Math.sin(t*1.0); eL.intensity = 3.5+2*Math.sin(t*0.85+1.3)

      // Camera orbit + parallax
      smx += (mx - smx)*0.035; smy += (my - smy)*0.035
      const cAngle = t * 0.06
      camera.position.x = Math.sin(cAngle) * (mobile ? 8 : 6) + smx * 2
      camera.position.z = Math.cos(cAngle) * (mobile ? 12 : 9)
      camera.position.y = 4 + smy * 1.5
      camera.lookAt(0, 0.5, 0)

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

  return <canvas ref={canvasRef} aria-hidden style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />
}
