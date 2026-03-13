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
    camera.position.set(0, 0, mobile ? 15 : 11)

    scene.add(new THREE.AmbientLight('#ffffff', 0.15))
    const gL = new THREE.PointLight('#C9A84C', 5, 35); gL.position.set(5, 5, 6); scene.add(gL)
    const eL = new THREE.PointLight('#4CAF50', 4, 35); eL.position.set(-5,-4, 5); scene.add(eL)
    const bL = new THREE.PointLight('#6dd6ff', 1.5,25); bL.position.set(0, 0,-8); scene.add(bL)

    const stdMat = (color: string, emissive: string, ei = 0.5, op = 1.0) =>
      new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: ei, metalness: 0.7, roughness: 0.28, transparent: op < 1, opacity: op })

    // ── CENTRAL SPINE CROSS-SECTION ───────────────────────────────────────────
    const coreGroup = new THREE.Group()

    // 10 vertebrae stacked (axial cross-section view)
    const VERTS = 10
    const vMeshes: THREE.Mesh[] = []
    for (let i = 0; i < VERTS; i++) {
      const isG  = i%2===0
      const wide = 0.75+Math.sin(i*0.5)*0.1
      const y    = (i-(VERTS-1)/2)*0.75
      const vMat = stdMat(isG?'#C9A84C':'#4CAF50', isG?'#5c3d00':'#004d00', 0.6, 0.88)
      const v = new THREE.Mesh(new THREE.BoxGeometry(wide*1.8,0.5,1.1), vMat)
      v.position.set(0,y,0); coreGroup.add(v); vMeshes.push(v)
      // Transverse processes
      for (const side of [-1,1]) {
        const tp = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,wide*1.2,8), stdMat(isG?'#A8872F':'#388E3C','#000',0.3,0.75))
        tp.position.set(side*wide*1.0,y,0); tp.rotation.z = Math.PI/2; coreGroup.add(tp)
      }
      // Spinous process
      const sp = new THREE.Mesh(new THREE.ConeGeometry(0.12,0.5,8), stdMat(isG?'#E8C96A':'#6DD671','#000',0.35,0.75))
      sp.position.set(0,y,-0.8); sp.rotation.x = -Math.PI/2.2; coreGroup.add(sp)
      // Disc
      if (i<VERTS-1) {
        const d = new THREE.Mesh(new THREE.CylinderGeometry(wide*0.5,wide*0.5,0.2,22), new THREE.MeshStandardMaterial({ color:'#1a3a50', transparent:true, opacity:0.88, roughness:0.9 }))
        d.position.set(0,y-0.36,0); coreGroup.add(d)
      }
    }

    // Spinal cord through centre
    const cordPts: THREE.Vector3[] = []
    for (let i = 0; i <= 60; i++) {
      const t = i/60
      cordPts.push(new THREE.Vector3(0.04*Math.sin(t*Math.PI*5), (t-0.5)*-7.5, 0.06*Math.cos(t*Math.PI*4)))
    }
    const cordMat = new THREE.MeshStandardMaterial({ color:'#E8C96A', emissive:'#C9A84C', emissiveIntensity:1.8, metalness:0.3, roughness:0.2, transparent:true, opacity:0.9 })
    coreGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cordPts),100,0.09,10,false), cordMat))

    // Glowing core ring
    const coreRing = new THREE.Mesh(new THREE.TorusGeometry(2.4,0.04,8,80),
      new THREE.MeshBasicMaterial({ color:'#C9A84C', transparent:true, opacity:0.12, blending:THREE.AdditiveBlending }))
    coreRing.rotation.y = Math.PI/2; coreGroup.add(coreRing)

    scene.add(coreGroup)

    // ── WIREFRAME ICOSAHEDRON shell ────────────────────────────────────────────
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(3.0,2),
      new THREE.MeshBasicMaterial({ color:'#C9A84C', wireframe:true, transparent:true, opacity:0.05 }))
    scene.add(ico)

    // ── 7 ORBITING SERVICE SPHERES ────────────────────────────────────────────
    const SERVICE_COLS = ['#C9A84C','#4CAF50','#E8C96A','#6DD671','#A8872F','#388E3C','#FFD700']
    const orbGroup = new THREE.Group()
    const orbMeshes: THREE.Mesh[] = []
    const orbTrails: THREE.Points[] = []

    // Floating bone fragment attached to each orb
    const orbBoneGroups: THREE.Group[] = []

    SERVICE_COLS.forEach((col, i) => {
      const a  = (i/SERVICE_COLS.length)*Math.PI*2
      const r  = 4.6+Math.sin(i)*0.5
      // Service orb
      const oM = new THREE.MeshStandardMaterial({ color:col, emissive:col, emissiveIntensity:1.8, metalness:0.85, roughness:0.08 })
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.22+(i%3)*0.05,22,22), oM)
      orb.position.set(Math.cos(a)*r, Math.sin(a)*r*0.45, Math.sin(a*2)*1.5)
      orbGroup.add(orb); orbMeshes.push(orb)

      // Trail
      const TRAIL = 28
      const tPos = new Float32Array(TRAIL*3), tSz = new Float32Array(TRAIL)
      for (let j = 0; j < TRAIL; j++) {
        tPos[j*3]=orb.position.x; tPos[j*3+1]=orb.position.y; tPos[j*3+2]=orb.position.z
        tSz[j] = (1-j/TRAIL)*3
      }
      const tGeo = new THREE.BufferGeometry()
      tGeo.setAttribute('position',new THREE.BufferAttribute(tPos,3))
      tGeo.setAttribute('size',new THREE.BufferAttribute(tSz,1))
      const tMat = new THREE.ShaderMaterial({
        uniforms:{ color:{value:new THREE.Color(col)} }, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
        vertexShader:`attribute float size; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=size*(200./-mv.z); gl_Position=projectionMatrix*mv; }`,
        fragmentShader:`uniform vec3 color; void main(){ float d=length(gl_PointCoord-vec2(.5)); if(d>.5)discard; gl_FragColor=vec4(color,(1.-d*2.)*.6); }`,
      })
      const trail = new THREE.Points(tGeo, tMat)
      scene.add(trail); orbTrails.push(trail)

      // Tiny bone fragment orbiting each service orb
      const boneG = new THREE.Group()
      const bLen = 0.28; const bR = 0.055
      const bMat = stdMat(col, col==='#C9A84C'?'#5c3d00':'#004d00', 0.5, 0.7)
      boneG.add(new THREE.Mesh(new THREE.CylinderGeometry(bR*0.45,bR*0.45,bLen,8), bMat))
      for (const sy of [-1,1]) {
        const k = new THREE.Mesh(new THREE.SphereGeometry(bR,10,8), bMat); k.position.y = sy*(bLen/2); boneG.add(k)
      }
      boneG.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI)
      boneG.position.copy(orb.position)
      scene.add(boneG); orbBoneGroups.push(boneG)
    })
    scene.add(orbGroup)

    // ── DNA DOUBLE HELIX RING (encircling the whole scene) ────────────────────
    const dnaRingGroup = new THREE.Group()
    const HELIX_N = mobile ? 80 : 140
    for (let s = 0; s < 2; s++) {
      const pts: THREE.Vector3[] = []
      for (let i = 0; i < HELIX_N; i++) {
        const theta = (i/HELIX_N)*Math.PI*2
        const phi   = (i/HELIX_N)*Math.PI*8+s*Math.PI
        const r     = 7.0+Math.cos(phi)*0.4
        pts.push(new THREE.Vector3(Math.cos(theta)*r, Math.sin(phi)*0.7, Math.sin(theta)*r))
      }
      pts.push(pts[0]) // close loop
      dnaRingGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color:s===0?'#E8C96A':'#6DD671', transparent:true, opacity:0.18, blending:THREE.AdditiveBlending })))
    }
    scene.add(dnaRingGroup)

    // ── CONNECTING LINES from core to orbs ───────────────────────────────────
    const cLinePos = new Float32Array(SERVICE_COLS.length*2*3)
    const cLineGeo = new THREE.BufferGeometry()
    cLineGeo.setAttribute('position', new THREE.BufferAttribute(cLinePos,3))
    const cLines = new THREE.LineSegments(cLineGeo, new THREE.LineBasicMaterial({ color:'#C9A84C', transparent:true, opacity:0.1, blending:THREE.AdditiveBlending }))
    scene.add(cLines)

    // ── FLOATING BONE FRAGMENTS (background) ──────────────────────────────────
    const bgBones: { g: THREE.Group; rotV: THREE.Vector3; baseY: number }[] = []
    for (let i = 0; i < (mobile?4:8); i++) {
      const col = i%2===0?'#C9A84C':'#4CAF50'
      const l   = 0.8+Math.random()*1.0; const r = 0.1+Math.random()*0.1
      const bMat= stdMat(col, col==='#C9A84C'?'#5c3d00':'#004d00', 0.45, 0.5)
      const g   = new THREE.Group()
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(r*0.45,r*0.45,l,9), bMat))
      for (const sy of [-1,1]) { const k=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),bMat); k.position.y=sy*(l/2); g.add(k) }
      const angle = (i/8)*Math.PI*2; const dist = 6+Math.random()*2
      const baseY = (Math.random()-.5)*6
      g.position.set(Math.cos(angle)*dist, baseY, Math.sin(angle)*dist-2)
      g.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI)
      scene.add(g)
      bgBones.push({ g, rotV:new THREE.Vector3((Math.random()-.5)*.01,(Math.random()-.5)*.013,(Math.random()-.5)*.009), baseY })
    }

    // ── PARTICLES ─────────────────────────────────────────────────────────────
    const P = mobile ? 200 : 380
    const pPos = new Float32Array(P*3), pCol = new Float32Array(P*3), pSz = new Float32Array(P)
    for (let i = 0; i < P; i++) {
      pPos[i*3]=(Math.random()-.5)*26; pPos[i*3+1]=(Math.random()-.5)*20; pPos[i*3+2]=(Math.random()-.5)*10
      const c = Math.random()<.5?new THREE.Color('#C9A84C'):new THREE.Color('#4CAF50')
      pCol[i*3]=c.r; pCol[i*3+1]=c.g; pCol[i*3+2]=c.b; pSz[i]=Math.random()*2.5+0.6
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3))
    pGeo.setAttribute('color',   new THREE.BufferAttribute(pCol,3))
    pGeo.setAttribute('size',    new THREE.BufferAttribute(pSz,1))
    const pMat = new THREE.ShaderMaterial({
      uniforms:{time:{value:0}}, vertexColors:true, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
      vertexShader:`attribute float size; varying vec3 vColor; uniform float time;
        void main(){ vColor=color; vec3 p=position;
          p.y+=sin(time*.5+position.x*.8)*.1; p.x+=cos(time*.4+position.z*.6)*.08;
          vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=size*(260./-mv.z); gl_Position=projectionMatrix*mv; }`,
      fragmentShader:`varying vec3 vColor; void main(){
        float d=length(gl_PointCoord-vec2(.5)); if(d>.5)discard;
        gl_FragColor=vec4(vColor,exp(-d*4.)*.7); }`,
    })
    scene.add(new THREE.Points(pGeo, pMat))

    // ── Mouse ─────────────────────────────────────────────────────────────────
    let mx=0,my=0,smx=0,smy=0
    const onMouse = (e:MouseEvent) => { mx=(e.clientX/window.innerWidth-.5)*.5; my=-(e.clientY/window.innerHeight-.5)*.5 }
    window.addEventListener('mousemove', onMouse)

    const clock = new THREE.Clock(); let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      pMat.uniforms.time.value = t

      // Spine core sway
      coreGroup.rotation.y = Math.sin(t*0.3)*0.28
      coreRing.rotation.z  = t*0.35
      ico.rotation.x = t*0.04; ico.rotation.y = t*0.06

      // Pulse vertebrae
      vMeshes.forEach((m,i) => {
        const s = 1+0.045*Math.sin(t*1.5+i*0.55)
        m.scale.set(s,1,s)
        ;(m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.55+0.45*Math.sin(t*1.2+i*0.65)
      })
      cordMat.emissiveIntensity = 1.4+0.8*Math.sin(t*2.0)

      // Orbit service spheres
      orbMeshes.forEach((orb,i) => {
        const a  = (i/orbMeshes.length)*Math.PI*2+t*(0.22+i*0.02)
        const r  = 4.6+Math.sin(t*0.3+i)*0.4
        orb.position.set(Math.cos(a)*r, Math.sin(a)*r*0.42, Math.sin(a*2+t*0.2)*1.8)
        // Update trail
        const tp = orbTrails[i].geometry.attributes.position.array as Float32Array
        for (let j = tp.length/3-1; j > 0; j--) { tp[j*3]=tp[(j-1)*3]; tp[j*3+1]=tp[(j-1)*3+1]; tp[j*3+2]=tp[(j-1)*3+2] }
        tp[0]=orb.position.x; tp[1]=orb.position.y; tp[2]=orb.position.z
        orbTrails[i].geometry.attributes.position.needsUpdate = true
        // Bone fragment follows orb + rotates
        orbBoneGroups[i].position.copy(orb.position)
        orbBoneGroups[i].position.x += 0.4; orbBoneGroups[i].position.y += 0.35
        orbBoneGroups[i].rotation.x += 0.015; orbBoneGroups[i].rotation.y += 0.02
      })

      // Update centre-to-orb lines
      const cp = cLineGeo.attributes.position.array as Float32Array
      orbMeshes.forEach((orb,i) => {
        cp[i*6]=0; cp[i*6+1]=0; cp[i*6+2]=0
        cp[i*6+3]=orb.position.x; cp[i*6+4]=orb.position.y; cp[i*6+5]=orb.position.z
      })
      cLineGeo.attributes.position.needsUpdate = true

      // DNA ring spin
      dnaRingGroup.rotation.y = t*0.08

      // Background bones float
      bgBones.forEach(({ g, rotV, baseY }, i) => {
        g.rotation.x+=rotV.x; g.rotation.y+=rotV.y; g.rotation.z+=rotV.z
        g.position.y = baseY+Math.sin(t*0.45+i*1.2)*0.4
      })

      gL.intensity = 4.5+2.*Math.sin(t*1.0); eL.intensity = 3.5+1.8*Math.sin(t*0.85+1.3)
      smx+=(mx-smx)*0.035; smy+=(my-smy)*0.035
      camera.position.x = smx*2; camera.position.y = smy*1.5
      camera.lookAt(scene.position)
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      camera.aspect = canvas.clientWidth/canvas.clientHeight
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

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />
}