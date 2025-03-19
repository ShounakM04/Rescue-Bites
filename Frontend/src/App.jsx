import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import ProviderAuth from './pages/ProviderAuth';
import ConsumerAuth from './pages/ConsumerAuth';
import AdminAuth from './pages/AdminAuth';
import ProviderDashboard from './pages/ProviderDashboard';
import AddFoodItem from './pages/AddFoodItem';
import ConsumerDashboard from './pages/ConsumerDashboard';
import ErrorPage from './pages/ErrorPage';
import { Provider } from "react-redux";
import store from './store/store.js'
import { Toaster } from 'react-hot-toast';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement:<ErrorPage/>
  },
  {
    path: "/provider-auth",
    element: <ProviderAuth />,
    errorElement:<ErrorPage/>

  },
  {
    path: "/consumer-auth",
    element: <ConsumerAuth />,
    errorElement:<ErrorPage/>

  },
  {
    path: "/admin-auth",
    element: <AdminAuth />,
    errorElement:<ErrorPage/>

  },
  {
    path: "/provider-dashboard",
    element: <ProviderDashboard />,
    errorElement:<ErrorPage/>

  },
  {
    path: "/provider-dashboard/add-food",
    element: <AddFoodItem />,
    errorElement:<ErrorPage/>

  },
  {
    path: "/consumer-dashboard",
    element: <ConsumerDashboard />,
    errorElement:<ErrorPage/>
  },
  {
    path: "*",
    element: <ErrorPage />
  }
]);

function App() {
  return(
    <><Toaster position="top-center" />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    </>
  );
}

export default App;