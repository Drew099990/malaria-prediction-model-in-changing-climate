import Image from "next/image";
import {FaSearch,} from "react-icons/fa"
export default function Home() {
  
  return (
   <div>
    <div className="bg-[linear-gradient(0deg,#ffffff,rgba(236,246,255,0.6))] w-screen max-md:h-screen  text-3xl h-[38rem] text-black/80 text-balance items-center flex justify-center flex-col"> 


<div className="fixed bg-purple-100 top-40 right-19 size-40 min-md:opacity-25 max-md:hidden flex justify-center items-center font-serif rounded-xl animate-r1 delay-100 border-green-400/60 border">illness</div>
<div className="fixed bg-green-100 top-42 left-19 size-40 min-md:opacity-27 max-md:hidden flex justify-center items-center font-serif rounded-xl animate-l1 delay-200 border-red-200/60 border">health</div>
    <div className="fixed bg-yellow-100 bottom-8 left-[42rem] size-40 min-md:opacity-17 max-md:hidden flex justify-center items-center font-serif rounded-xl animate-l1 border-red-200/60 border">wealth</div>
    
<div className="fixed min-md:bottom-32 bg-purple-100 left-19 size-40 min-md:opacity-55 max-md:opacity-40 flex justify-center items-center font-serif rounded-xl animate-r1 border-green-400/60 border">mitigation</div>
<div className="fixed min-md:bottom-28 bg-green-100 right-19 size-40 min-md:opacity-50 max-md:opacity-40 flex justify-center items-center font-serif rounded-xl animate-l1 border-red-200/60 border">prevention</div>
   <div className="flex justify-center items-center ">
     <div className="bg-blue-300/70 shadow-2xl shadow-blue-200/70 font-serif max-md:scale-60 flex-row mt-20 z-5 border-blue-950/60 border-4 animate- items-center  w-150 text-2xl fixed top-20 rounded-3xl text-blue-700 pl-10  opacity-65 flex justify-between"> 
    
    <div className="flex">
       <h1 className="after:animate-type ">what is Malaria Sphere?</h1>
    <h1 className="after:animate-blink font-extrabold "></h1>
     
    </div>
        <div className="bg-blue-900/60   rounded-[50%] p-1 text-blue-100 border-blue-200 border-2">
        <div className="opacity-60"><FaSearch/></div>
        </div>
        </div>

   </div>
   
    <div className="flex justify-center items-center z-3  scale-91">
      <div className="m-100  shadow-xl shadow-blue-200/60  border-2 border-blue-500/60 rounded-2xl border-dashed  max-md:mb-100 mb-50 max-md:scale-50 p-10 px-17 block bg-gray-100/60 animate-l">
      <h1 className="text-xl opacity-70 ">noun:</h1>
      <div className=" flex ">
        <h1 className="text-4xl tracking-wide font-sans font-extrabold">MalariaSphere</h1> 
        <p className="font-light m-2 animate-pulse"></p>is a</div> 
        <h1 className="text-blue-400/80 font-sans font-extrabold tracking-[5rem] text-3xl ">PLATFORM</h1> 
        <h1 className="tracking-wider font-serif  ">dedicated at providing an Ai powered approch at malaria prediction and mitigation that also provides access to all things <p className="font-semibold italic opacity-70">Malaria</p></h1>
        <h3 className="tracking-wider"></h3></div>
      </div></div>
   </div>
  );
}
