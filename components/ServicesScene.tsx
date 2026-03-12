'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ServicesScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const mobile = window.innerWidth < 768

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0, mobile ? 14 : 10)

    scene.add(new THREE.AmbientLight('#ffffff', 0.15))
    const gL = new THREE.PointLight('#C9A84C', 5, 30); gL.position.set(5, 4, 5); scene.add(gL)
    const eL = new THREE.PointLight('#4CAF50', 4, 30); eL.position.set(-5,-3, 4); scene.add(eL)

    /* ── CENTRAL MORPHING TORUS KNOT ── */
    const tkGeo = new THREE.TorusKnotGeometry(2.2, 0.55, 160, 20, 2, 3)
    const tkMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      transparent: true, side: THREE.DoubleSide, depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vNormal; varying vec3 vPos; uniform float time;
        void main(){
          vNormal = normalize(normalMatrix * normal); vPos = position;
          float d = 0.06 * sin(8.0*position.x + time*1.2) * sin(8.0*position.y + time*0.9);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal*d, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vNormal; varying vec3 vPos; uniform float time;
        void main(){
          float rim = pow(1.0 - abs(dot(vNormal, vec3(0,0,1))), 2.2);
          float t = 0.5 + 0.5*sin(time*0.7 + vPos.x*1.8 + vPos.y*1.4);
          vec3 col = mix(vec3(0.788,0.659,0.298), vec3(0.298,0.686,0.314), t);
          gl_FragColor = vec4(col, rim * 0.75 + 0.08);
        }`,
    })
    const torusKnot = new THREE.Mesh(tkGeo, tkMat)
    scene.add(torusKnot)

    /* ── WIREFRAME SHELL ── */
    const wfGeo = new THREE.TorusKnotGeometry(2.5, 0.6, 80, 10, 2, 3)
    const wfMat = new THREE.MeshBasicMaterial({ color: '#C9A84C', wireframe: true, transparent: true, opacity: 0.06 })
    scene.add(new THREE.Mesh(wfGeo, wfMat))

    /* ── ORBITING SPHERES (7 services) ── */
    const SERVICE_COLORS = ['#C9A84C','#4CAF50','#E8C96A','#6DD671','#A8872F','#388E3C','#FFD700']
    const orbGroup = new THREE.Group()
    const orbMeshes: THREE.Mesh[] = []
    const orbTrails: THREE.Points[] = []

    SERVICE_COLORS.forEach((col, i) => {
      const a  = (i / SERVICE_COLORS.length) * Math.PI * 2
      const r  = 4.8 + Math.sin(i) * 0.6
      const oG = new THREE.SphereGeometry(0.22 + (i % 3) * 0.05, 20, 20)
      const oM = new THREE.MeshStandardMaterial({
        color: col, emissive: col, emissiveIntensity: 1.8, metalness: 0.8, roughness: 0.1,
      })
      const orb = new THREE.Mesh(oG, oM)
      orb.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.5, Math.sin(a * 2) * 1.5)
      orbGroup.add(orb); orbMeshes.push(orb)

      // Trail behind each orb
      const TRAIL = 30
      const tPos = new Float32Array(TRAIL * 3)
      const tSiz = new Float32Array(TRAIL)
      for (let j = 0; j < TRAIL; j++) {
        tPos[j*3]   = orb.position.x
        tPos[j*3+1] = orb.position.y
        tPos[j*3+2] = orb.position.z
        tSiz[j] = (1 - j / TRAIL) * 3
      }
      const tGeo = new THREE.BufferGeometry()
      tGeo.setAttribute('position', new THREE.BufferAttribute(tPos,  3))
      tGeo.setAttribute('size',     new THREE.BufferAttribute(tSiz, 1))
      const tMat = new THREE.ShaderMaterial({
        uniforms: { color: { value: new THREE.Color(col) } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: `attribute float size; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=size*(200./-mv.z); gl_Position=projectionMatrix*mv; }`,
        fragmentShader: `uniform vec3 color; void main(){ float d=length(gl_PointCoord-vec2(.5)); if(d>.5)discard; gl_FragColor=vec4(color, (1.0-d*2.0)*0.6); }`,
      })
      const trail = new THREE.Points(tGeo, tMat)
      scene.add(trail); orbTrails.push(trail)
    })
    scene.add(orbGroup)

    /* ── PARTICLE FIELD ── */
    const P = mobile ? 200 : 400
    const pPos = new Float32Array(P * 3)
    const pCol = new Float32Array(P * 3)
    const pSiz = new Float32Array(P)
    for (let i = 0; i < P; i++) {
      pPos[i*3]   = (Math.random() - .5) * 24
      pPos[i*3+1] = (Math.random() - .5) * 18
      pPos[i*3+2] = (Math.random() - .5) * 10
      const c = Math.random() < .5 ? new THREE.Color('#C9A84C') : new THREE.Color('#4CAF50')
      pCol[i*3] = c.r; pCol[i*3+1] = c.g; pCol[i*3+2] = c.b
      pSiz[i] = Math.random() * 2.5 + 0.5
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3))
    pGeo.setAttribute('size',     new THREE.BufferAttribute(pSiz, 1))
    const pMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float size; varying vec3 vColor; uniform float time;
        void main(){ vColor=color; vec3 p=position;
          p.y += sin(time*0.5+position.x*0.8)*0.1; p.x += cos(time*0.4+position.z*0.6)*0.08;
          vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=size*(260./-mv.z); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying vec3 vColor; void main(){
        float d=length(gl_PointCoord-vec2(.5)); if(d>.5)discard;
        gl_FragColor=vec4(vColor, exp(-d*4.0)*0.7); }`,
    })
    scene.add(new THREE.Points(pGeo, pMat))

    /* ── CONNECTING LINES from center to orbs ── */
    const cLinePos = new Float32Array(SERVICE_COLORS.length * 2 * 3)
    const cLineGeo = new THREE.BufferGeometry()
    cLineGeo.setAttribute('position', new THREE.BufferAttribute(cLinePos, 3))
    const cLineMat = new THREE.LineBasicMaterial({ color: '#C9A84C', transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending })
    const cLines   = new THREE.LineSegments(cLineGeo, cLineMat)
    scene.add(cLines)

    /* ── MOUSE PARALLAX ── */
    let mx = 0, my = 0, smx = 0, smy = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - .5) * .5
      my = -(e.clientY / window.innerHeight - .5) * .5
    }
    window.addEventListener('mousemove', onMouse)

    const prevOrbPos: THREE.Vector3[] = orbMeshes.map(() => new THREE.Vector3())
    const clock = new THREE.Clock(); let raf: number

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      tkMat.uniforms.time.value = t
      pMat.uniforms.time.value  = t

      // Rotate torus knot
      torusKnot.rotation.x = t * 0.18
      torusKnot.rotation.y = t * 0.22
      torusKnot.rotation.z = t * 0.1

      // Orbit spheres (figure-8 path)
      orbMeshes.forEach((orb, i) => {
        prevOrbPos[i].copy(orb.position)
        const a  = (i / orbMeshes.length) * Math.PI * 2 + t * (0.22 + i * 0.02)
        const r  = 4.8 + Math.sin(t * 0.3 + i) * 0.4
        orb.position.set(
          Math.cos(a) * r,
          Math.sin(a) * r * 0.45,
          Math.sin(a * 2 + t * 0.2) * 1.8
        )
        // Update trail positions (shift)
        const tp = orbTrails[i].geometry.attributes.position.array as Float32Array
        for (let j = (tp.length / 3) - 1; j > 0; j--) {
          tp[j*3]   = tp[(j-1)*3]
          tp[j*3+1] = tp[(j-1)*3+1]
          tp[j*3+2] = tp[(j-1)*3+2]
        }
        tp[0] = orb.position.x; tp[1] = orb.position.y; tp[2] = orb.position.z
        orbTrails[i].geometry.attributes.position.needsUpdate = true
      })

      // Update center-to-orb lines
      const cp = cLineGeo.attributes.position.array as Float32Array
      orbMeshes.forEach((orb, i) => {
        cp[i*6]   = 0; cp[i*6+1] = 0; cp[i*6+2] = 0
        cp[i*6+3] = orb.position.x; cp[i*6+4] = orb.position.y; cp[i*6+5] = orb.position.z
      })
      cLineGeo.attributes.position.needsUpdate = true

      // Lights pulse
      gL.intensity = 4.5 + 2.0 * Math.sin(t * 1.0)
      eL.intensity = 3.5 + 1.8 * Math.sin(t * 0.85 + 1.3)

      // Camera parallax
      smx += (mx - smx) * 0.035; smy += (my - smy) * 0.035
      camera.position.x = smx * 2; camera.position.y = smy * 1.5
      camera.lookAt(scene.position)

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
