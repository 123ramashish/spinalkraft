'use client'

import dynamic from 'next/dynamic'
import PageHero from '@/components/PageHero'
import { ReactNode } from 'react'

const SpineScene      = dynamic(() => import('@/components/SpineScene'),      { ssr: false })
const ServicesScene   = dynamic(() => import('@/components/ServicesScene'),   { ssr: false })
const ConditionsScene = dynamic(() => import('@/components/ConditionsScene'), { ssr: false })
const ContactScene    = dynamic(() => import('@/components/ContactScene'),    { ssr: false })

type SceneName = 'spine' | 'services' | 'conditions' | 'contact' | 'none'

interface Props {
  badge: string
  title: ReactNode
  subtitle: string
  breadcrumbs: { label: string; href?: string }[]
  accentColor?: 'gold' | 'green'
  sceneName?: SceneName
}

const SCENE_HEIGHT = '100%'

function getScene(name?: SceneName): ReactNode {
  switch (name) {
    case 'spine':      return <div style={{ position:'absolute', inset:0 }}><SpineScene height={SCENE_HEIGHT} /></div>
    case 'services':   return <ServicesScene />
    case 'conditions': return <ConditionsScene />
    case 'contact':    return <ContactScene />
    default:           return undefined
  }
}

export default function PageHeroWrapper(props: Props) {
  return (
    <PageHero
      badge={props.badge}
      title={props.title}
      subtitle={props.subtitle}
      breadcrumbs={props.breadcrumbs}
      accentColor={props.accentColor}
      scene={getScene(props.sceneName)}
    />
  )
}
