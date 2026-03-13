'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/** Thin animated wave banner (e.g. 120px tall) used between sections */
export default function WaveBanner({ height = 120 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, res: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) } },
      transparent: true,
      depthWrite: false,
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`,
      fragmentShader: `
        varying vec2 vUv; uniform float time; uniform vec2 res;
        void main(){
          vec2 uv = vUv;
          float y = uv.y;
          float wave1 = 0.5 + 0.35*sin(uv.x*8.0 + time*1.2);
          float wave2 = 0.5 + 0.35*sin(uv.x*5.0 - time*0.9 + 1.5);
          float mask1 = smoothstep(wave1-0.05, wave1, y) * (1.0 - smoothstep(wave1, wave1+0.04, y));
          float mask2 = smoothstep(wave2-0.04, wave2, y) * (1.0 - smoothstep(wave2, wave2+0.03, y));
          vec3 col1 = vec3(0.788,0.659,0.298);
          vec3 col2 = vec3(0.298,0.686,0.314);
          float alpha = mask1*0.55 + mask2*0.4;
          vec3 col = mix(col1, col2, uv.x);
          gl_FragColor = vec4(col, alpha);
        }`,
    })
    scene.add(new THREE.Mesh(geo, mat))

    const clock = new THREE.Clock(); let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      mat.uniforms.time.value = clock.getElapsedTime()
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      mat.uniforms.res.value.set(canvas.clientWidth, canvas.clientHeight)
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); renderer.dispose() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ width: '100%', height, display: 'block', pointerEvents: 'none' }}
    />
  )
}
