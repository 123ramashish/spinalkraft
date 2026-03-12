'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ConditionsScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const mobile = window.innerWidth < 768

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0, mobile ? 15 : 11)

    scene.add(new THREE.AmbientLight('#ffffff', 0.2))
    const gL = new THREE.PointLight('#C9A84C', 5, 30); gL.position.set(4, 5, 6);  scene.add(gL)
    const eL = new THREE.PointLight('#4CAF50', 4, 30); eL.position.set(-5,-3, 5); scene.add(eL)

    /* ── HUMAN SILHOUETTE (ellipsoid body segments) ── */
    const bodyGroup = new THREE.Group()
    const segments = [
      // [y, rx, ry, rz]  — head, neck, shoulders, chest, waist, hips, legs
      { y:5.0, rx:0.55, ry:0.65, rz:0.55, col:'#C9A84C' },  // head
      { y:4.0, rx:0.30, ry:0.55, rz:0.28, col:'#4CAF50'  },  // neck
      { y:2.8, rx:1.20, ry:0.70, rz:0.55, col:'#C9A84C' },   // shoulders
      { y:1.5, rx:0.90, ry:1.00, rz:0.55, col:'#4CAF50'  },  // chest
      { y:0.1, rx:0.75, ry:0.80, rz:0.50, col:'#C9A84C' },   // abdomen
      { y:-1.3,rx:0.88, ry:0.80, rz:0.52, col:'#4CAF50'  },  // hips
      { y:-2.9,rx:0.42, ry:0.90, rz:0.40, col:'#C9A84C' },   // upper legs
      { y:-4.5,rx:0.35, ry:0.90, rz:0.35, col:'#4CAF50'  },  // lower legs
    ]
    const bodyMeshes: THREE.Mesh[] = []
    segments.forEach(({ y, rx, ry, rz, col }) => {
      const geo = new THREE.SphereGeometry(1, 32, 20)
      geo.scale(rx, ry, rz)
      const mat = new THREE.MeshStandardMaterial({
        color: col, emissive: col, emissiveIntensity: 0.25,
        metalness: 0.5, roughness: 0.5, transparent: true, opacity: 0.55,
        wireframe: false,
      })
      const m = new THREE.Mesh(geo, mat)
      m.position.y = y
      bodyGroup.add(m); bodyMeshes.push(m)
    })

    // Wireframe shell overlay
    segments.forEach(({ y, rx, ry, rz }) => {
      const geo = new THREE.SphereGeometry(1.05, 14, 9)
      geo.scale(rx, ry, rz)
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color:'#C9A84C', wireframe:true, transparent:true, opacity:0.07 }))
      m.position.y = y
      bodyGroup.add(m)
    })

    bodyGroup.position.x = -1.5
    scene.add(bodyGroup)

    /* ── SCAN LINE sweeping down the body ── */
    const scanGeo = new THREE.PlaneGeometry(4, 0.05)
    const scanMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `varying vec2 vUv; uniform float time;
        void main(){
          float fade = 1.0 - abs(vUv.x - 0.5)*2.0;
          vec3 col = mix(vec3(0.788,0.659,0.298), vec3(0.298,0.686,0.314), vUv.x);
          gl_FragColor = vec4(col, fade * 0.85);
        }`,
    })
    const scanLine = new THREE.Mesh(scanGeo, scanMat)
    scanLine.position.x = -1.5
    scene.add(scanLine)

    /* ── HOTSPOT RINGS at key body points ── */
    const HOTSPOTS = [
      { y: 5.0, col:'#C9A84C', label:'Head' },
      { y: 2.8, col:'#4CAF50', label:'Shoulder' },
      { y: 1.5, col:'#C9A84C', label:'Chest' },
      { y: 0.1, col:'#4CAF50', label:'Spine' },
      { y:-1.3, col:'#C9A84C', label:'Hip' },
      { y:-2.9, col:'#4CAF50', label:'Knee' },
    ]
    const hotspotRings: THREE.Mesh[] = []
    HOTSPOTS.forEach(({ y, col }) => {
      const geo = new THREE.TorusGeometry(0.5, 0.03, 8, 40)
      const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending })
      const ring = new THREE.Mesh(geo, mat)
      ring.position.set(-1.5, y, 0.6)
      scene.add(ring); hotspotRings.push(ring)
    })

    /* ── PARTICLE FIELD ── */
    const P = mobile ? 160 : 320
    const pPos = new Float32Array(P * 3)
    const pCol = new Float32Array(P * 3)
    const pSz  = new Float32Array(P)
    for (let i = 0; i < P; i++) {
      pPos[i*3]   = (Math.random() - .5) * 22
      pPos[i*3+1] = (Math.random() - .5) * 16
      pPos[i*3+2] = (Math.random() - .5) * 8
      const c = Math.random()<.5 ? new THREE.Color('#C9A84C') : new THREE.Color('#4CAF50')
      pCol[i*3]=c.r; pCol[i*3+1]=c.g; pCol[i*3+2]=c.b
      pSz[i] = Math.random() * 3 + 0.8
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3))
    pGeo.setAttribute('size',     new THREE.BufferAttribute(pSz,  1))
    const pMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float size; varying vec3 vColor; uniform float time;
        void main(){ vColor=color; vec3 p=position;
          p.y+=sin(time*0.5+position.x*0.9)*0.12; p.x+=cos(time*0.4+position.y*0.7)*0.09;
          vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=size*(240./-mv.z); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying vec3 vColor; void main(){
        float d=length(gl_PointCoord-vec2(.5)); if(d>.5)discard;
        gl_FragColor=vec4(vColor, exp(-d*4.5)*0.75); }`,
    })
    scene.add(new THREE.Points(pGeo, pMat))

    /* ── CONCENTRIC CIRCLES (right side, decorative) ── */
    for (let i = 0; i < 4; i++) {
      const r = 1.5 + i * 1.2
      const cGeo = new THREE.TorusGeometry(r, 0.025, 6, 80)
      const cMat = new THREE.MeshBasicMaterial({ color: i%2===0?'#C9A84C':'#4CAF50', transparent:true, opacity:0.08-i*0.015, blending:THREE.AdditiveBlending })
      const cM   = new THREE.Mesh(cGeo, cMat)
      cM.position.x = 3.5; cM.rotation.y = Math.PI/2
      scene.add(cM)
    }

    /* ── MOUSE PARALLAX ── */
    let mx = 0, my = 0, smx = 0, smy = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - .5) * .45
      my = -(e.clientY / window.innerHeight - .5) * .45
    }
    window.addEventListener('mousemove', onMouse)

    const clock = new THREE.Clock(); let raf: number
    let scanDir = -1

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      scanMat.uniforms.time.value = t
      pMat.uniforms.time.value    = t

      // Scan line sweeps body (y from ~6 to -5.5)
      scanLine.position.y = 5.5 + Math.sin(t * 0.5) * 5.5

      // Body glow pulse
      bodyMeshes.forEach((m, i) => {
        ;(m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + 0.2*Math.sin(t*1.5+i*0.7)
      })

      // Hotspot rings pulse at scan line y
      hotspotRings.forEach((ring, i) => {
        const dist = Math.abs(ring.position.y - scanLine.position.y)
        const opacity = Math.max(0, 0.7 - dist * 0.35)
        ;(ring.material as THREE.MeshBasicMaterial).opacity = opacity
        const s = 1 + 0.25 * Math.sin(t * 2.5 + i)
        ring.scale.setScalar(s)
        ring.rotation.z = t * 0.8
      })

      // Slow body rotation
      bodyGroup.rotation.y = Math.sin(t * 0.25) * 0.35

      // Lights pulse
      gL.intensity = 4 + 2.5*Math.sin(t * 1.1); eL.intensity = 3+2*Math.sin(t*0.9+1.4)

      // Camera parallax
      smx += (mx - smx)*0.035; smy += (my - smy)*0.035
      camera.position.x = smx*2; camera.position.y = smy*1.5
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
