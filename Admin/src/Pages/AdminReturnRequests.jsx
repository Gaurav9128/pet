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

  // UPDATE STATUS
  const updateStatus = async(orderId,productId,status,reason="") => {

    const actionKey = `${orderId}-${productId}`

    try{

      setLoadingAction(actionKey)

      const {data} = await axios.post(
        backendUrl + "/api/admin/update-return-status",
        {orderId,productId,status,reason},
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

  // FILTER RETURNS
  const filteredReturns = returns.filter(
    r => r.item.returnStatus === activeTab
  )

  // STATS
  const pendingCount = returns.filter(r=>r.item.returnStatus==="Pending").length
  const approvedCount = returns.filter(r=>r.item.returnStatus==="Approved").length
  const rejectedCount = returns.filter(r=>r.item.returnStatus==="Rejected").length

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Return Management
      </h2>

      {/* DASHBOARD STATS */}

      <div className="grid grid-cols-3 gap-4 mb-8">

        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-sm">Pending</p>
          <h3 className="text-xl font-bold">{pendingCount}</h3>
        </div>

        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm">Approved</p>
          <h3 className="text-xl font-bold">{approvedCount}</h3>
        </div>

        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm">Rejected</p>
          <h3 className="text-xl font-bold">{rejectedCount}</h3>
        </div>

      </div>

      {/* FILTER TABS */}

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

      {/* RETURN LIST */}

      {filteredReturns.map((req)=>{

        const actionKey = `${req.orderId}-${req.item.productId}`
        const isProcessing = loadingAction === actionKey

        const quantity = req.item.returnQuantity || req.item.quantity

        /* ⭐ CORRECT REFUND LOGIC */

        // ITEM LEVEL PRICE (this is important)
        const itemPaidPrice =
          req.item.paidPrice ||
          req.item.price ||
          req.item.finalPrice ||
          0

        const refundAmount = itemPaidPrice * quantity

        return(

          <div
            key={actionKey}
            className="border rounded-lg p-5 mb-6 shadow bg-white"
          >

            <div className="flex gap-6">

              <img
                src={req.item.image?.[0]}
                alt=""
                className="w-28 h-28 object-cover rounded"
              />

              <div className="flex-1">

                <h3 className="font-bold text-lg mb-2">
                  {req.item.name}
                </h3>

                <div className="text-sm space-y-1">

                  <p>
                    <b>Order ID:</b> {req.orderUniqueId}
                  </p>

                  <p>
                    <b>Quantity:</b> {quantity}
                  </p>

                  <p>
                    <b>Size:</b> {req.item.size}
                  </p>

                  <p>
                    <b>Paid Price (per item):</b> ₹{itemPaidPrice}
                  </p>

                  <p className="text-red-600 font-semibold">
                    Refund Amount: ₹{refundAmount}
                  </p>

                  <p>
                    <b>Status:</b>{" "}
                    <span className={`font-bold
                      ${req.item.returnStatus==="Pending" && "text-yellow-600"}
                      ${req.item.returnStatus==="Approved" && "text-green-600"}
                      ${req.item.returnStatus==="Rejected" && "text-red-600"}
                    `}>
                      {req.item.returnStatus}
                    </span>
                  </p>

                  {req.item.returnRejectReason && (
                    <p className="text-red-500">
                      Reject Reason: {req.item.returnRejectReason}
                    </p>
                  )}

                </div>

                {/* ACTION BUTTONS */}

                {req.item.returnStatus==="Pending" && (

                  <div className="flex gap-3 mt-4">

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

            </div>

          </div>

        )

      })}

    </div>

  )

}

export default AdminReturnRequests