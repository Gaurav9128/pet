const generateOrderId = async (Order) => {
  const today = new Date()

  const date =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0')

  const count = await Order.countDocuments({
    orderUniqueId: { $regex: `^BT-PL-${date}` }
  })

  return `BT-PL-${date}-${String(count + 1).padStart(4, '0')}`
}

export default generateOrderId
