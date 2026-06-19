import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const validateImageResolution = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      if (img.width < 800 || img.height < 800) {
        reject(`Image too small (${img.width}×${img.height}). Minimum 800×800 required`)
      } else {
        resolve(true)
      }
    }
  })
}

const Add = ({ token }) => {

  /* ---------- LOADING STATE ---------- */
  const [loading, setLoading] = useState(false)

  /* ---------- RATING ---------- */
  const [rating, setRating] = useState(4)

  /* ---------- IMAGES ---------- */
  const [images, setImages] = useState([null, null, null, null])

  /* ---------- PRODUCT ---------- */
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('cats')
  const [subCategory, setSubCategory] = useState('dry-food')
  const [bestseller, setBestseller] = useState(false)

  /* ---------- SIZE PRICE ---------- */
  const [sizes, setSizes] = useState([])
  const [sizeLabel, setSizeLabel] = useState('')
  const [mrp, setMrp] = useState('')
  const [price, setPrice] = useState('')

  /* ---------- PRODUCT DETAILS ---------- */
  const [details, setDetails] = useState([])
  const [detailLabel, setDetailLabel] = useState('')
  const [detailValue, setDetailValue] = useState('')

  /* ---------- ADD SIZE ---------- */
  const addSize = () => {
    if (!sizeLabel || !mrp || !price) {
      toast.error('Size, MRP & Price required')
      return
    }

    const MRP = Number(mrp)
    const PRICE = Number(price)

    if (PRICE >= MRP) {
      toast.error('Selling price must be less than MRP')
      return
    }

    if (sizes.find(s => s.label === sizeLabel)) {
      toast.error('Size already added')
      return
    }

    const discount = Math.round(((MRP - PRICE) / MRP) * 100)

    setSizes(prev => [
      ...prev,
      { label: sizeLabel, mrp: MRP, price: PRICE, discount }
    ])

    setSizeLabel('')
    setMrp('')
    setPrice('')
  }

  /* ---------- REMOVE SIZE ---------- */
  // 1. Function to remove a size from the state array
  const removeSize = (labelToRemove) => {
    setSizes(prev => prev.filter(item => item.label !== labelToRemove))
  }

  /* ---------- ADD DETAIL ---------- */
  const addDetail = () => {
    if (!detailLabel || !detailValue) {
      toast.error('Both label and value are required')
      return
    }

    if (details.find(d => d.label === detailLabel)) {
      toast.error('This detail label is already added')
      return
    }

    setDetails(prev => [...prev, { label: detailLabel, value: detailValue }])
    setDetailLabel('')
    setDetailValue('')
  }

  /* ---------- REMOVE DETAIL ---------- */
  // 2. Function to remove a detail from the state array
  const removeDetail = (labelToRemove) => {
    setDetails(prev => prev.filter(item => item.label !== labelToRemove))
  }

  /* ---------- SUBMIT ---------- */
  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (sizes.length === 0) {
      toast.error('Please add at least one size')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()

      formData.append('name', name)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('rating', rating)
      formData.append('sizes', JSON.stringify(sizes))
      formData.append('details', JSON.stringify(details))

      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img)
      })

      const res = await axios.post(
        backendUrl + '/api/product/add',
        formData,
        { headers: { token } }
      )

      if (res.data.success) {
        toast.success(res.data.message)

        setName('')
        setDescription('')
        setSizes([])
        setImages([null, null, null, null])
        setBestseller(false)
        setDetails([])
      } else {
        toast.error(res.data.message)
      }

    } catch (err) {
      console.log(err)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col gap-6 px-2 sm:px-0">

      {/* ---------- IMAGES ---------- */}
      <div>
        <p className="mb-2 font-medium">Upload Images</p>
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <label key={i}>
              <img
                className="w-20 sm:w-24 border rounded cursor-pointer"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt=""
              />
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0]
                  if (!file) return

                  try {
                    await validateImageResolution(file)

                    const copy = [...images]
                    copy[i] = file
                    setImages(copy)

                  } catch (err) {
                    toast.error(err)
                    e.target.value = null 
                  }
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* ---------- NAME ---------- */}
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Product Name"
        className="border px-3 py-2 rounded w-full sm:max-w-[500px]"
        required
      />

      {/* ---------- DESCRIPTION ---------- */}
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Product Description"
        className="border px-3 py-2 rounded w-full sm:max-w-[500px]"
        rows={4}
        required
      />

      {/* ---------- RATING ---------- */}
      <div className="flex flex-col gap-1 sm:max-w-[200px]">
        <label className="font-medium">Rating (1 to 5)</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          <option value={5}>★★★★★ (5)</option>
          <option value={4}>★★★★☆ (4)</option>
          <option value={3}>★★★☆☆ (3)</option>
          <option value={2}>★★☆☆☆ (2)</option>
          <option value={1}>★☆☆☆☆ (1)</option>
        </select>
      </div>

      {/* ---------- CATEGORY ---------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select value={category} onChange={e => setCategory(e.target.value)} className="border px-3 py-2 rounded">
          <option value="cats">Cats</option>
          <option value="dogs">Dogs</option>
          <option value="small-pets">Small Pets</option>
          <option value="pet-parent">Pet Parent</option>
          <option value="henlo">Henlo</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="consult-vet">Consult a Vet</option>
          <option value="brand">Brand</option>
        </select>

        <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="border px-3 py-2 rounded">
          <option value="dry-food">Dry Food</option>
          <option value="wet-food">Wet Food</option>
          <option value="kitten-food">Kitten Food</option>
          <option value="premium-food">Premium Food</option>
          <option value="creamy-treats">Creamy Treats</option>
          <option value="jerky-treats">Jerky Treats</option>
          <option value="crunchy-treats">Crunchy Treats</option>
          <option value="puppy-food">Puppy Food</option>
          <option value="grain-free-food">Grain Free Food</option>
          <option value="baked-dry-food">Baked Dry Food</option>
          <option value="premium-dog-food">Premium Dog Food</option>
          <option value="biscuits-cookies">Biscuits & Cookies</option>
          <option value="bones-chews">Bones & Chews</option>
          <option value="skin-care">Skin Care</option>
          <option value="joint-care">Joint Care</option>
          <option value="kidney-care">Kidney Care</option>
          <option value="liver-care">Liver Care</option>
          <option value="cardiac-care">Cardiac Care</option>
          <option value="eye-ear-care">Eye & Ear Care</option>
        </select>
      </div>

      {/* ---------- SIZE PRICE ---------- */}
      <div>
        <p className="mb-2 font-medium">Sizes & Pricing</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            placeholder="Size (10kg)"
            value={sizeLabel}
            onChange={e => setSizeLabel(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            placeholder="MRP"
            type="number"
            value={mrp}
            onChange={e => setMrp(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            placeholder="Selling Price"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={addSize}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {sizes.map((s, i) => (
            // 3. Made container relative and added right padding (pr-8) to make space for the close button
            <div key={i} className="bg-pink-100 px-3 py-2 rounded text-sm relative pr-8 min-w-[120px]">
              <p className="font-semibold">{s.label}</p>
              <p>
                ₹{s.price}{' '}
                <span className="line-through text-gray-500">₹{s.mrp}</span>{' '}
                <span className="text-green-600">({s.discount}% off)</span>
              </p>
              <button
                type="button"
                onClick={() => removeSize(s.label)}
                className="absolute top-1 right-2 text-red-500 hover:text-red-700 font-bold text-base cursor-pointer"
                title="Remove size"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- PRODUCT DETAILS ---------- */}
      <div>
        <p className="mb-2 font-medium">Product Details</p>
        <div className="flex gap-2 mb-2 flex-wrap">
          <input
            placeholder="Label (e.g. Suitable for)"
            value={detailLabel}
            onChange={e => setDetailLabel(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            placeholder="Value (e.g. Adult Dogs & puppies)"
            value={detailValue}
            onChange={e => setDetailValue(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={addDetail}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {details.map((d, i) => (
            // 4. Added absolute close button to the Product Details cards too
            <div key={i} className="bg-blue-100 px-3 py-2 rounded text-sm relative pr-8 min-w-[120px]">
              <p className="font-semibold">{d.label}</p>
              <p>{d.value}</p>
              <button
                type="button"
                onClick={() => removeDetail(d.label)}
                className="absolute top-1 right-2 text-red-500 hover:text-red-700 font-bold text-base cursor-pointer"
                title="Remove detail"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- BESTSELLER ---------- */}
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)} />
        Add to bestseller
      </label>

      {/* ---------- SUBMIT BUTTON ---------- */}
      <button 
        disabled={loading} 
        className={`text-white py-3 rounded w-full sm:w-32 transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'}`}
      >
        {loading ? 'Adding...' : 'ADD PRODUCT'}
      </button>

    </form>
  )
}

export default Add