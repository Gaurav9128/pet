import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ role check
    if (decoded.role !== 'admin') {
      return res.json({
        success: false,
        message: "Not Authorized Login Again"
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Not Authorized Login Again"
    });
  }
};

export default adminAuth;
