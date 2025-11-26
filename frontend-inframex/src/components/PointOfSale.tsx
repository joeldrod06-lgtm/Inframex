import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  barcode: string;
}

const PointOfSale: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    // Cargar productos del backend
    fetch('http://localhost:3000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error loading products:', error));
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock,
      },
    });
  };

  const handleBarcodeSearch = () => {
    if (barcode) {
      fetch(`http://localhost:3000/products/barcode/${barcode}`)
        .then(response => response.json())
        .then(product => {
          if (product) {
            addToCart(product);
            setBarcode('');
          }
        })
        .catch(() => {
          console.log('Producto no encontrado');
          setBarcode('');
        });
    }
  };

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      
      {/* Columna izquierda - Productos */}
      <div style={{ flex: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Productos Inframex
          </Typography>
          
          {/* Búsqueda por código de barras */}
          <TextField
            fullWidth
            label="Código de barras"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
            sx={{ mb: 2 }}
          />

          {/* Búsqueda general */}
          <TextField
            fullWidth
            label="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Lista de productos */}
          <List>
            {filteredProducts.map((product) => (
              <ListItem
                key={product.id}
                secondaryAction={
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    Agregar
                  </Button>
                }
              >
                <ListItemText
                  primary={product.name}
                  secondary={`$${product.price} - Stock: ${product.stock}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>

      {/* Columna derecha - Carrito */}
      <div style={{ flex: 1 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Carrito de Venta
          </Typography>
          
          <List>
            {state.cart.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => dispatch({
                        type: 'UPDATE_QUANTITY',
                        payload: { id: item.id, quantity: item.quantity - 1 }
                      })}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                    <IconButton
                      size="small"
                      onClick={() => dispatch({
                        type: 'UPDATE_QUANTITY',
                        payload: { id: item.id, quantity: item.quantity + 1 }
                      })}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={item.name}
                  secondary={`$${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>

          {state.cart.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  Total: ${total.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => {
                    alert('Venta procesada - Total: $' + total.toFixed(2));
                    dispatch({ type: 'CLEAR_CART' });
                  }}
                >
                  Procesar Venta
                </Button>
              </CardContent>
            </Card>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default PointOfSale;