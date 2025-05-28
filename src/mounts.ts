import express from "express";
import categoriesRotuer from "./modules/category/category.router";
import productRouter from "./modules/product/product.router";
import userRouter from "./modules/user/user.router";
import authRouter from "./modules/auth/auth.router";
import cartRouter from "./modules/cart/cart.router";
import wishlistRouter from "./modules/wishlist/wishlist.router";
import ordersRouter from "./modules/order/order.router";

const mountRoutes = express.Router();

mountRoutes.use("/categories", categoriesRotuer);
mountRoutes.use("/products", productRouter);
mountRoutes.use("/users", userRouter);
mountRoutes.use("/auth", authRouter);
mountRoutes.use("/cart", cartRouter);
mountRoutes.use("/wishlist", wishlistRouter);
mountRoutes.use("/orders", ordersRouter);

export default mountRoutes;
