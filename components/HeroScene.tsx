'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const mobile = window.innerWidth < 768

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 200)
    camera.position.set(0, 0, mobile ? 16 : 11)

    /* ── LIGHTS ── */
    scene.add(new THREE.AmbientLight('#ffffff', 0.2))
    const gLight = new THREE.PointLight('#C9A84C', 4, 30); gLight.position.set(4, 3, 6); scene.add(gLight)
    const eLight = new THREE.PointLight('#4CAF50', 3, 30); eLight.position.set(-4,-2, 5); scene.add(eLight)

    /* ── NEURAL NODES ── */
    const N = mobile ? 140 : 300
    const SPREAD = mobile ? 10 : 13
    const nPos   = new Float32Array(N * 3)
    const nCol   = new Float32Array(N * 3)
    const nSize  = new Float32Array(N)
    const nVel:  THREE.Vector3[] = []
    const gold   = new THREE.Color('#C9A84C')
    const green  = new THREE.Color('#4CAF50')
    const cream  = new THREE.Color('#f5e6c8')

    for (let i = 0; i < N; i++) {
      const phi   = Math.acos(2 * Math.random() - 1)
      const theta = Math.PI * 2 * Math.random()
      const r     = SPREAD * (0.45 + Math.random() * 0.55)
      nPos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      nPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      nPos[i*3+2] = r * Math.cos(phi)
      const c = Math.random() < 0.45 ? gold : Math.random() < 0.65 ? green : cream
      nCol[i*3] = c.r; nCol[i*3+1] = c.g; nCol[i*3+2] = c.b
      nSize[i] = Math.random() * 5 + 2.5
      nVel.push(new THREE.Vector3(
        (Math.random() - .5) * .0025,
        (Math.random() - .5) * .0025,
        (Math.random() - .5) * .0025
      ))
    }

    const nGeo = new THREE.BufferGeometry()
    nGeo.setAttribute('position', new THREE.BufferAttribute(nPos,  3))
    nGeo.setAttribute('color',    new THREE.BufferAttribute(nCol,  3))
    nGeo.setAttribute('size',     new THREE.BufferAttribute(nSize, 1))

    const nMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexColors: true, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float size; varying vec3 vColor; uniform float time;
        void main(){
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float pulse = 1.0 + 0.35 * sin(time * 1.8 + position.x * 0.9 + position.z * 0.7);
          gl_PointSize = size * pulse * (320.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vColor;
        void main(){
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if(d > 0.5) discard;
          float core = exp(-d * 3.5);
          float rim  = 1.0 - smoothstep(0.3, 0.5, d);
          gl_FragColor = vec4(vColor, (core + rim * 0.4) * 0.95);
        }`,
    })
    const nodes = new THREE.Points(nGeo, nMat)
    scene.add(nodes)

    /* ── NEURAL CONNECTIONS ── */
    const CONN_DIST  = mobile ? 4.8 : 6.0
    const lPos: number[] = []
    const lCol: number[] = []
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = nPos[i*3]   - nPos[j*3]
        const dy = nPos[i*3+1] - nPos[j*3+1]
        const dz = nPos[i*3+2] - nPos[j*3+2]
        const d = Math.sqrt(dx*dx + dy*dy + dz*dz)
        if (d < CONN_DIST) {
          lPos.push(nPos[i*3],nPos[i*3+1],nPos[i*3+2], nPos[j*3],nPos[j*3+1],nPos[j*3+2])
          const ci = gold.clone().lerp(green, Math.random())
          lCol.push(ci.r,ci.g,ci.b, ci.r,ci.g,ci.b)
        }
      }
    }
    const lGeo = new THREE.BufferGeometry()
    lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lPos), 3))
    lGeo.setAttribute('color',    new THREE.BufferAttribute(new Float32Array(lCol), 3))
    const lines = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending
    }))
    scene.add(lines)

    /* ── CENTRAL ANIMATED SPHERE ── */
    const sGeo = new THREE.SphereGeometry(2.0, 80, 80)
    const sMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vNormal; varying vec3 vPos; uniform float time;
        void main(){
          vNormal = normalize(normalMatrix * normal); vPos = position;
          float d = 0.1 * sin(6.0*position.x + time) * sin(6.0*position.y + time*0.9) * sin(6.0*position.z + time*1.1);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal*d, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vNormal; varying vec3 vPos; uniform float time;
        void main(){
          float rim = pow(1.0 - abs(dot(vNormal, vec3(0,0,1))), 2.8);
          float t = 0.5 + 0.5*sin(time*0.6 + vPos.y*2.0);
          vec3 col = mix(vec3(0.788,0.659,0.298), vec3(0.298,0.686,0.314), t);
          float pulse = 0.7 + 0.3*sin(time*1.5);
          gl_FragColor = vec4(col * pulse, rim * 0.8);
        }`,
    })
    const sphere = new THREE.Mesh(sGeo, sMat)
    scene.add(sphere)

    /* ── WIREFRAME ICOSAHEDRA ── */
    const ico1 = new THREE.Mesh(new THREE.IcosahedronGeometry(3.2, 2), new THREE.MeshBasicMaterial({ color:'#C9A84C', wireframe:true, transparent:true, opacity:0.055 }))
    const ico2 = new THREE.Mesh(new THREE.OctahedronGeometry(4.8, 2),   new THREE.MeshBasicMaterial({ color:'#4CAF50', wireframe:true, transparent:true, opacity:0.035 }))
    scene.add(ico1, ico2)

    /* ── DNA DOUBLE HELIX ── */
    function helix(offset: number, col: string, offX = 0) {
      const pts: THREE.Vector3[] = []
      const n = mobile ? 130 : 220
      for (let i = 0; i < n; i++) {
        const t = (i/n) * Math.PI * 10 - Math.PI * 5
        pts.push(new THREE.Vector3(Math.cos(t+offset)*2.8 + offX, (i/n)*20-10, Math.sin(t+offset)*2.8 - 5))
      }
      const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending }))
      scene.add(ln); return ln
    }
    const h1 = helix(0,         '#E8C96A', 0)
    const h2 = helix(Math.PI,   '#6DD671', 0)

    /* ── TORUS RINGS ── */
    function ring(r: number, col: string, rx: number, rz: number) {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.05, 8, 100),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })
      )
      mesh.rotation.x = rx; mesh.rotation.z = rz
      scene.add(mesh); return mesh
    }
    const r1 = ring(4.8, '#C9A84C', 0.6, 0.2)
    const r2 = ring(6.2, '#4CAF50', 1.2, 0.8)
    const r3 = ring(3.5, '#E8C96A',-0.9, 0.4)

    /* ── MOUSE PARALLAX ── */
    let mx = 0, my = 0, smx = 0, smy = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - .5) * .7
      my = -(e.clientY / window.innerHeight - .5) * .7
    }
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return
      mx = (e.touches[0].clientX / window.innerWidth  - .5) * .35
      my = -(e.touches[0].clientY / window.innerHeight - .5) * .35
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })

    const clock = new THREE.Clock(); let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()

      nMat.uniforms.time.value = t
      sMat.uniforms.time.value = t

      // Rotate scene groups
      nodes.rotation.y    = t * 0.04
      lines.rotation.y    = t * 0.04
      sphere.rotation.y   = t * 0.12
      ico1.rotation.x     = t * 0.03; ico1.rotation.y = t * 0.05
      ico2.rotation.x    = -t * 0.04; ico2.rotation.z = t * 0.03
      h1.rotation.y = h2.rotation.y = t * 0.07
      r1.rotation.z = t * 0.14
      r2.rotation.x = t * 0.09
      r3.rotation.y = t * 0.11

      // Drift nodes
      for (let i = 0; i < N; i++) {
        nPos[i*3]   += nVel[i].x
        nPos[i*3+1] += nVel[i].y
        nPos[i*3+2] += nVel[i].z
        const len = Math.sqrt(nPos[i*3]**2 + nPos[i*3+1]**2 + nPos[i*3+2]**2)
        if (len > SPREAD) nVel[i].multiplyScalar(-1)
      }
      nGeo.attributes.position.needsUpdate = true

      // Pulse lights
      gLight.intensity = 3.5 + 2.0 * Math.sin(t * 1.1)
      eLight.intensity = 2.5 + 1.5 * Math.sin(t * 0.9 + 1.5)

      // Smooth camera parallax
      smx += (mx - smx) * 0.04
      smy += (my - smy) * 0.04
      camera.position.x = smx * 2.5
      camera.position.y = smy * 1.8
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
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />
}
