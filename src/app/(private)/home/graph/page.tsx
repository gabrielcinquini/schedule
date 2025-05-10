import { Metadata } from 'next'
import React from 'react'

import { BASE_TITLE } from '@/constants/title'

import { Content } from './_components/content'

export default async function GraphPage() {
  return <Content />
}

export const metadata: Metadata = {
  title: `${BASE_TITLE} - Gráficos`,
}
