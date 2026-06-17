import { LucideChevronRight, Minus } from 'lucide-react'
import React, { useState } from 'react'

const TablePage = () => {

    const sepratedColor =[
        {
            "text": "Available",
            "color": "bg-[#FFFFFF]",
        },
        {
            "text": "Occupied",
            "color":"bg-[#EBE9E5]",
        },
        {
            "text":"Selected",
            "color":"bg-[#FFE088]"
        }
    ]

    const table  = [
        {
            value:"general",
            tableNo: "01",
            guest: "2 guests",
            text:"01",
            status: "available",
        },
          {
            value:"general",
            tableNo: "02",
            text:"02",
            guest: "4 guests",
            status: "available",
        },
          {
            value:"general",
            tableNo: "03",
            "text":"03",
            guest: "6 guests",
            status: "occupied",
        },
          {
            value:"general",
            tableNo: "04",
            text:"04",
            guest: "2 guests",
            status: "available",
        },
          {
            value:"vip",
            tableNo: "05",
            text:"05",
            guest: "8 guests",
            status: "available",
        }
    ]

    const [selectedTable, setSelectedTable] = useState<string | null>(null);

  return (
    <div>
        <div className='header'>
        <div className='flex items-center space-x-2 font-[font2] font-[16px] uppercase tracking-widest'>
            <span className='font-bold text-[#735C00]'>1. Select Table</span>
            <LucideChevronRight className='size-3.5 mr-2 ml-2'/>
   <span className=' text-[#474741]'>2. Build Order</span>
        </div>

        <div className='font-[font4] text-3xl mt-4'>
            Floor Plan: Main Hall
        </div>

        </div>
 <div className='flex mt-10 gap-10'>
        {/* left part */}

        <div className='left-part w-262.5 '>
            {/* //top part */}
            <div className='bg-[#F6F3EF] pl-4 h-14 flex justify-between gap-6 border border-[#C8C7BF] rounded-xl'>
                <div className='flex gap-6'>
                {
                    sepratedColor.map((item,index)=>(
                         <div key={index} className='flex items-center h-full gap-3'>
                    <div className={`w-4 h-4 ${item.color} border border-[#777770]  rounded-[3px] `}></div>
                    <h1 className='font-[font2] font-medium text-[15px]'>{item.text}</h1>
                </div>
                    ))
                }
                </div>

                <div className='flex items-center gap-3 text-[17px] font-[font1] text-[#474741] italic mr-7'>
                    <h1>Showing Main Dining Zone</h1>
                </div>
                </div>

                {/* downpart */}

                <div className='bg-[#F6F3EF]  relative mt-6  rounded-xl border border-[#C8C7BF] h-120'>
                    {/* //entrance part */}
                    <div className=' flex items-center justify-center '>
                         <div className='bg-[#F0EDE9] pb-1.5 font-semibold pt-1 font-[font2] uppercase text-[13px] tracking-widest text-[#474741] rounded-b-2xl text-center w-35 border border-[#C8C7BF]'>Entrance</div>
                    </div>

                    <div className='pl-20 pt-10 flex flex-wrap gap-25'>
                        {table.map((item,index)=>(
                             <div key={index}><button disabled={item.status==='occupied'}  onClick={()=>setSelectedTable(item.tableNo)}  className={`w-21  ${item.status==='occupied'?'bg-[#EBE9E5]  cursor-not-allowed': selectedTable===item.tableNo?'bg-[#FFE088] cursor-pointer':'bg-[#FFFFFF] cursor-pointer'}  ${item.value==='vip'?'w-40':'w-21'} ${item.value==='vip'?'font-[font4] text-2xl':'font-[font2]'} h-21 rounded-xl  border-2 border-[#C8C7BF]  flex items-center justify-center   font-bold`}>{item.value==='vip'?item.text+'-'+'VIP':item.tableNo}</button> <h1 className='text-center mt-0.5 text-[#424241] font-[font1] text-[13.5px]'>{item.guest}</h1></div>
                        ))}

                              {/* <div><div className='w-40 h-21 rounded-xl border-2 border-[#C8C7BF]  flex items-center justify-center bg-[#EBE9E5] font-[font4] text-[25px] font-bold'>05-Vip</div> <h1 className='text-center text-[#424241] font-[font1] text-[13.5px]'>4 guests</h1></div>
                              <div><div className='w-21 h-21 rounded-xl border-2 border-[#C8C7BF]  flex items-center justify-center bg-[#EBE9E5]  font-bold'>02</div> <h1 className='text-center text-[#424241] font-[font1] text-[13.5px]'>4 guests</h1></div> */}
                    </div>

                </div>

            </div>

            {/* //right part */}
            <div className='right-part bg-[#F6F3EF] w-120 rounded-xl max-h-80 p-10 border border-[#C8C7BF]'>
<div>
<h1 className='font-[font4] text-[20px] '>Order Details</h1>
<h1 className='font-[font2]  text-[16px] text-[#474741]'>The Banquet Palace - Main Dining Room</h1>
<div className='mt-5 flex items-center justify-between  bg-[#F6F3EF] pl-5 w-full pt-2 pb-2 rounded-xl border border-[#C8C7BF]'>
   <div className='flex items-center justify-center gap-3'> <h1 className='font-[font3] text-[25px] text-[#735C00]'>chair</h1>
    <h1 className='font-[font2] text-[15px]'>Selected Table</h1>
    </div>
    <h1 className='mr-5 font-[font2]  font-bold text-[16px]'> {selectedTable?`Table ${selectedTable}`:<Minus/>}</h1>
</div>
<hr className='border-[#C8C7BF] mt-5'/>
<button className={`text-[14px] w-full ${selectedTable?'bg-black cursor-pointer':'bg-[#C9C6C2] cursor-not-allowed'}   text-white font-bold mt-5 rounded-xl  pt-3 pb-3 uppercase font-[font2] tracking-wide text-center border border-[#C8C7BF]`}>Proceed to menu</button>
<h1 className='text-[15px]  text-center text-[#474741] italic mb-5 mt-5'>Select a table to continue</h1>
</div>
            </div>
            </div>
        </div>

  )
}

export default TablePage
