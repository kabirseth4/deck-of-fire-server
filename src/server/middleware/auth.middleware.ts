import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const user = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const userId = Number(req.params.userId);

  if (!authHeader) {
    return res.status(401).json({
      message: "Please provide an authorization header.",
    });
  }

  const authToken = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(
      authToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (decodedToken.id !== userId) {
      return res.status(403).json({
        message: `Authorization not valid for user with ID ${userId}.`,
      });
    }

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    return res
      .status(500)
      .json({ message: "Unable to authorize user.", error });
  }
};

export default { user };
