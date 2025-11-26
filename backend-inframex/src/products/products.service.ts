import { Injectable } from '@nestjs/common';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  unit: string;
  barcode: string;
  category: string;
  isActive: boolean;
}

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      sku: 'TUBO-50-PVC',
      name: 'Tubo PVC 50mm',
      description: 'Tubo de PVC para drenaje de 50mm',
      price: 45.50,
      cost: 32.00,
      stock: 150,
      minStock: 20,
      unit: 'pieza',
      barcode: '7501234567890',
      category: 'Tubería',
      isActive: true,
    },
    {
      id: 2,
      sku: 'CEMEX-50KG',
      name: 'Cemento Cemex 50kg',
      description: 'Cemento gris para construcción',
      price: 125.00,
      cost: 95.00,
      stock: 80,
      minStock: 10,
      unit: 'saco',
      barcode: '7501234567891',
      category: 'Cementos',
      isActive: true,
    },
    {
      id: 3,
      sku: 'VAR-3-8',
      name: 'Varilla corrugada 3/8"',
      description: 'Varilla de acero para construcción 3/8"',
      price: 89.00,
      cost: 65.00,
      stock: 200,
      minStock: 30,
      unit: 'pieza',
      barcode: '7501234567892',
      category: 'Acero',
      isActive: true,
    },
    {
      id: 4,
      sku: 'ARENA-M3',
      name: 'Arena para construcción',
      description: 'Arena lavada para concreto',
      price: 450.00,
      cost: 320.00,
      stock: 15,
      minStock: 5,
      unit: 'm3',
      barcode: '7501234567893',
      category: 'Materiales Básicos',
      isActive: true,
    },
    {
      id: 5,
      sku: 'GRAVA-M3',
      name: 'Grava triturada 3/4"',
      description: 'Grava para concreto y filtros',
      price: 520.00,
      cost: 380.00,
      stock: 12,
      minStock: 5,
      unit: 'm3',
      barcode: '7501234567894',
      category: 'Materiales Básicos',
      isActive: true,
    }
  ];

  findAll(search?: string, category?: string) {
    let filteredProducts = this.products.filter(p => p.isActive);
    
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.includes(search)
      );
    }
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category === category
      );
    }
    
    return filteredProducts;
  }

  findOne(id: number) {
    return this.products.find(p => p.id === id && p.isActive);
  }

  findByBarcode(barcode: string) {
    return this.products.find(p => p.barcode === barcode && p.isActive);
  }

  create(product: Omit<Product, 'id'>) {
    const newProduct: Product = {
      id: Math.max(...this.products.map(p => p.id)) + 1,
      ...product,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, updateData: Partial<Product>) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updateData };
      return this.products[index];
    }
    return null;
  }

  remove(id: number) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index].isActive = false;
      return true;
    }
    return false;
  }

  getLowStockProducts() {
    return this.products.filter(p => p.stock <= p.minStock && p.isActive);
  }
}