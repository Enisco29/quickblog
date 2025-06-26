import jwt from "jsonwebtoken";

// const authUser = async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Not Authorized",
//     });
//   }

//   try {
//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

//     if (tokenDecode.id) {
//       req.user = { id: tokenDecode.id };
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "Not Authorized",
//       });
//     }
//     next();
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

export const authUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid token",
      });

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  });
};

export const verifySuperAdmin = (req, res, next) => {
  if (req.user?.role !== "super-admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Super Admin privileges required",
    });
  }

  next();
};

export const verifyAdmin = (req, res, next) => {
  if (!["admin", "super-admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// export default authUser;
