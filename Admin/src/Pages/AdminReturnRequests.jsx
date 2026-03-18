import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminReturnRequests = ({ backendUrl, adminToken }) => {

  const [returns,setReturns] = useState([])
  const [loadingAction,setLoadingAction] = useState(null)
  const [activeTab,setActiveTab] = useState("Pending")

  // LOAD RETURNS
  const loadReturns = async () => {
    try {
      const {data} = await axios.get(
        backendUrl + "/api/admin/return-requests",
        {headers:{token:adminToken}}
      )

      if(data.success){
        setReturns(data.returnRequests)
      }

    } catch {
      toast.error("Failed to load return requests")
    }
  }

  // ✅ UPDATED STATUS FUNCTION (FIXED)
  const updateStatus = async(orderId,productId,status,reason="") => {

    const actionKey = `${orderId}-${productId}`

    try{
      setLoadingAction(actionKey)

      const {data} = await axios.post(
        backendUrl + "/api/admin/update-return-status",
        {
          orderId,
          productId,
          status,
          rejectReason: reason   // 🔥 FINAL FIX
        },
        {headers:{token:adminToken}}
      )

      if(data.success){
        toast.success(data.message)
        loadReturns()
      }

    }catch{
      toast.error("Action Failed")
    }
    finally{
      setLoadingAction(null)
    }

  }

  // REJECT WITH REASON
  const rejectReturn = (orderId,productId)=>{
    const reason = prompt("Enter rejection reason")

    if(!reason){
      toast.error("Reason required")
      return
    }

    updateStatus(orderId,productId,"Rejected",reason)
  }

  useEffect(()=>{
    loadReturns()
  },[])

  const filteredReturns = returns.filter(
    r => r.item.returnStatus === activeTab
  )

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Return Management
      </h2>

      <div className="flex gap-4 mb-6">
        {["Pending","Approved","Rejected"].map(tab=>(
          <button
            key={tab}
            onClick={()=>setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab===tab
              ? "bg-black text-white"
              : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredReturns.map((req)=>{

        const actionKey = `${req.orderId}-${req.item.productId}`
        const isProcessing = loadingAction === actionKey

        return(
          <div key={actionKey} className="border p-4 mb-4">

            <h3 className="font-bold">{req.item.name}</h3>

            <p><b>Order ID:</b> {req.orderUniqueId}</p>
            <p><b>Price:</b> ₹{req.item.price}</p>

            {req.item.returnRejectReason && (
              <p className="text-red-500">
                Reason: {req.item.returnRejectReason}
              </p>
            )}

            {req.item.returnStatus==="Pending" && (
              <div className="flex gap-3 mt-3">

                <button
                  disabled={isProcessing}
                  onClick={()=>updateStatus(
                    req.orderId,
                    req.item.productId,
                    "Approved"
                  )}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>

                <button
                  disabled={isProcessing}
                  onClick={()=>rejectReturn(
                    req.orderId,
                    req.item.productId
                  )}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>

              </div>
            )}

          </div>
        )
      })}

    </div>
  )
}

export default AdminReturnRequests;