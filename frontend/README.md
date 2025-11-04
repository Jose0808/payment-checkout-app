# Payment Checkout - Frontend

> Single Page Application (SPA) para checkout de pagos con tarjetas de crédito

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-purple.svg)](https://redux-toolkit.js.org/)
[![Tests](https://img.shields.io/badge/coverage->80%25-brightgreen.svg)](/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)

## 🎯 Características

- ✅ **Mobile-First Design** - Responsive desde 375px (iPhone SE)
- ✅ **Redux Toolkit** - State management con Flux Architecture
- ✅ **Redux Persist** - Resiliencia ante recargas de página
- ✅ **TypeScript** - Type safety completo
- ✅ **Tailwind CSS** - Estilos modernos con utilidades
- ✅ **React Hook Form** - Manejo de formularios optimizado
- ✅ **Detección de Tarjetas** - Visa/Mastercard automático
- ✅ **Validación en Tiempo Real** - Feedback inmediato
- ✅ **Tests >80%** - Vitest + React Testing Library

## 🏗️ Arquitectura

```
frontend/
├── src/
│   ├── app/              # Redux store configuration
│   ├── features/         # Feature-based modules
│   │   ├── product/      # Product catalog
│   │   ├── checkout/     # Checkout flow
│   │   ├── payment/      # Payment processing
│   │   └── transaction/  # Transaction results
│   ├── shared/           # Shared resources
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   └── types/        # TypeScript types
│   ├── services/         # API services
│   ├── pages/            # Page components
│   └── styles/           # Global styles
```

### 🎨 Flujo de Usuario (5 Pasos)

```
1. Página de Producto
   ↓
2. Modal de Información de Pago
   ├─ Datos del cliente (email, nombre, teléfono)
   ├─ Información de tarjeta (número, titular, exp, CVV)
   └─ Detección automática Visa/Mastercard
   ↓
3. Modal de Información de Entrega
   ├─ Dirección completa
   └─ Ciudad, departamento, código postal
   ↓
4. Backdrop de Resumen
   ├─ Desglose de costos (producto + tarifa base + envío)
   ├─ Confirmación de datos
   └─ Botón "Confirmar Pago"
   ↓
5. Resultado de Transacción
   ├─ Estado (Aprobado/Rechazado/Error)
   ├─ Número de transacción
   └─ Botón "Volver a Productos" (con stock actualizado)
```

## 🚀 Quick Start

### Prerrequisitos

- Node.js 20+
- Backend API corriendo en `https://payment-checkout-app.onrender.com` o localmente en `http://localhost:3000`

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/Jose0808/payment-checkout-app
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# Iniciar desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 📦 Tecnologías

### Core
- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool

### State Management
- **Redux Toolkit 2.0** - State management
- **Redux Persist** - State persistence
- **React Redux** - React bindings

### Routing & Forms
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form management

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **Lucide React** - Icon library
- **PostCSS** - CSS processing

### API & Utils
- **Axios** - HTTP client

### Testing
- **Vitest** - Unit test framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction testing
- **jsdom** - DOM environment

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con UI
npm run test:ui

# Tests con coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

## 🎨 Componentes Principales

### Product Card
Muestra información del producto con botón de compra.
```tsx
<ProductCard product={product} onBuyClick={handleBuy} />
```

### Payment Modal
Modal de 2 pasos para información de pago y entrega.
```tsx
<PaymentModal 
  isOpen={isOpen} 
  onClose={handleClose}
  onSubmit={handleSubmit}
/>
```

### Backdrop Summary
Resumen de compra con diseño Material.
```tsx
<BackdropSummary
  product={product}
  customer={customer}
  delivery={delivery}
  onConfirm={handleConfirm}
/>
```

### Transaction Result
Muestra el resultado del pago con estados visuales.
```tsx
<TransactionResult 
  transaction={transaction}
  onBackToProducts={handleBack}
/>
```

## 🔧 Utilidades

### Validadores

```typescript
import { validateCardNumber, validateEmail } from '@shared/utils/validators'

validateCardNumber('4111111111111111') // true
validateEmail('user@example.com') // true
```

### Formateadores

```typescript
import { formatCurrency, maskCardNumber } from '@shared/utils/formatters'

formatCurrency(100000) // "$100.000"
maskCardNumber('4111111111111111') // "**** **** **** 1111"
```

### Detector de Tarjetas

```typescript
import { detectCardType } from '@shared/utils/cardDetector'

detectCardType('4111111111111111') // CardType.VISA
detectCardType('5555555555554444') // CardType.MASTERCARD
```

## 🎨 Diseño Responsive

### Breakpoints

```css
/* Mobile (default) */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Mobile-First Approach

Diseñado para:
- **Mínimo**: iPhone SE (375x667px)
- **Optimizado**: iPhone 12/13/14 (390x844px)
- **Tablets**: iPad (768px+)
- **Desktop**: 1024px+

## 🔐 Seguridad

- ✅ **NO almacena datos sensibles** de tarjetas en localStorage
- ✅ **Validación en frontend y backend**
- ✅ **HTTPS en producción**
- ✅ **Sanitización de inputs**
- ✅ **Tokens temporales** para transacciones

## 📊 Redux Store Structure

```typescript
{
  product: {
    products: Product[]
    selectedProduct: Product | null
    loading: boolean
    error: string | null
  },
  checkout: {
    currentStep: CheckoutStep
    customer: Customer | null
    cardInfo: CardInfo | null  // NO persistido
    deliveryInfo: DeliveryInfo | null
    isModalOpen: boolean
    isSummaryOpen: boolean
  },
  payment: {
    currentTransaction: Transaction | null
    processing: boolean
    error: string | null
    fees: { baseFee: number, deliveryFee: number }
  },
  transaction: {
    lastTransaction: Transaction | null
    history: Transaction[]  // Últimas 10
  }
}
```

## 🚢 Build & Deploy

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
# Build
npm run build

# Preview build
npm run preview
```

### Deploy en AWS S3 + CloudFront

```bash
# Build optimizado
npm run build

# Los archivos en dist/ se suben a S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidar cache de CloudFront
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

## 📝 Variables de Entorno

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api/v1

# App Name
VITE_APP_NAME=Payment Checkout
```

## 🐛 Troubleshooting

### El backend no responde
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000/api/v1/products

# Verificar proxy en vite.config.ts
```

### Tests fallan
```bash
# Limpiar cache
npm run test -- --clearCache

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Build falla
```bash
# Verificar TypeScript
npx tsc --noEmit

# Ver errores de ESLint
npm run lint
```

## 📚 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm test` | Ejecuta tests |
| `npm run test:ui` | Tests con interfaz |
| `npm run test:coverage` | Tests con coverage |
| `npm run lint` | Linter ESLint |
| `npm run format` | Formatear con Prettier |

## 📄 License

MIT

## 👥 Autor

Jose Colmenares

---
