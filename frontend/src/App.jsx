import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      {/* Toaster for notifications */}
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      
      {/* Sirf Routes rakho, Provider hata do kyunki wo main.jsx mein hai */}
      <AppRoutes />
    </>
  );
}

export default App;