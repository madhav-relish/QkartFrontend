import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia component = 'img' alt = {product.name} image ={product.image} />
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography>${product.cost}</Typography>
        <Rating
             name = "read-only"
             value = {product.rating}
             readOnly
             />

      </CardContent>
      <CardActions className="card-actions">
        <Button
        className="card-button"
        fullwidth
        variant = "contained"
        starIcon= {<AddShoppingCartOutlined />}
        onClick = {handleAddToCart}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
