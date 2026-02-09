"use client"
import Link from 'next/link'
import React from 'react'

const NAV = () => {
  return (
    <div>          <nav className="p-5 max-md:gap-1 max-md:hidden flex min-md:gap-5 text-black/70 z-1 opacity-80">
            <Link href="tip" className="border-2 max-md:scale-70 hover:bg-blue-200/40  border-blue-200 ring-1 ring-black/40 p-1 rounded-2xl  duration-300 hover:scale-105">Malaria-Tips</Link>
            <Link  href="study" className="border-2 duration-300 max-md:scale-70 hover:bg-blue-200/40 z-5 border-blue-200 ring-1 ring-black/40 p-1 rounded-2xl hover:scale-105">Forcast</Link>
            <Link  href="saved-notes" className="border-2 duration-300 max-md:scale-70 hover:bg-blue-200/40 border-blue-200 ring-1 ring-black/40 p-1 rounded-2xl hover:scale-105">Symptom-Checker</Link>
            </nav></div>
  )
}

export default NAV