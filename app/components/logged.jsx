"use client"
import React, { useState } from 'react'
import Link from 'next/link';
import Image from "next/image"
import img from "./logo.jpeg"

const Logged = () => {



  return (
  <div className='pr-2 justify-center items-center flex opacity-70 rounded-l-[50%] border-blue-700/50 border-dotted border overflow-hidden'>
   <Image src={img} alt="logo" className='size-12 rounded-[50%]  border border-blue-900/70 animate-bounce hover:animate-none'/>
  </div>
  )
}

export default Logged