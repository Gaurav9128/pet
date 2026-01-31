import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const navigate = useNavigate()

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ---------- Toggle Availability ----------
  const toggleAvailability = async (id, currentStatus) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/toggleAvailability',
        { id, isAvailable: !currentStatus },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(
          `Product marked ${!currentStatus ? 'Available' : 'Unavailable'}`
        )
        fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className="mb-3 font-medium">All Products List</p>

      {/* ---------- DESKTOP TABLE HEADER ---------- */}
      <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_2fr_2fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-medium">
        <span>Image</span>
        <span>Name</span>
        <span>Category</span>
        <span>Price Details</span>
        <span className="text-center">Action</span>
        <span>Availability</span>
      </div>

      {/* ---------- PRODUCT LIST ---------- */}
      <div className="flex flex-col gap-3 mt-2">
        {list.map((item) => {
          const priceInfo = item.sizes?.[0] || {}
          const sellingPrice = priceInfo.price || item.price || 0
          const mrp = priceInfo.mrp || 0
          const discount = priceInfo.discount || 0

          return (
            <div
              key={item._id}
              className="
                border rounded-lg p-3
                flex flex-col gap-3
                md:grid md:grid-cols-[1fr_3fr_1fr_2fr_2fr_1fr]
                md:items-center md:gap-2
              "
            >
              {/* IMAGE */}
              <img
                className="w-16 h-16 object-cover rounded md:w-12 md:h-12"
                src={item.image[0]}
                alt=""
              />

              {/* NAME */}
              <p className="font-medium text-sm md:text-base">{item.name}</p>

              {/* CATEGORY */}
              <p className="text-xs md:text-sm text-gray-500">{item.category}</p>

              {/* PRICE DETAILS */}
              <div className="text-sm md:text-base flex flex-col gap-1">
                <span>
                  <strong>MRP:</strong> {currency}{mrp}
                </span>
                <span>
                  <strong>Price:</strong> {currency}{sellingPrice}
                </span>
                {discount > 0 && (
                  <span className="text-green-600">
                    <strong>Discount:</strong> {discount}%
                  </span>
                )}
              </div>

              {/* ---------- ACTION BUTTONS ---------- */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => removeProduct(item._id)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>

                <button
                  onClick={() => navigate(`/update-product/${item._id}`)}
                  className="text-blue-600 font-medium"
                >
                  Update
                </button>
              </div>

              {/* ---------- AVAILABILITY ---------- */}
              <button
                onClick={() => toggleAvailability(item._id, item.isAvailable)}
                className={`px-3 py-1 rounded ${
                  item.isAvailable
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}
              >
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default List
