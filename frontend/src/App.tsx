import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@app/store'
import { ProductPage } from '@pages/ProductPage'
import { Loader2 } from 'lucide-react'

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
        persistor={persistor}
      >
        <ProductPage />
      </PersistGate>
    </Provider>
  )
}

export default App