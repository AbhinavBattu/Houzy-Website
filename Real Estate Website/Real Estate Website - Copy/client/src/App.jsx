import "./App.css";
import Website from "./pages/Website";
import { Suspense } from "react";
import { useState } from "react";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Property from "./pages/Property/Property";
import Properties from "./pages/Properties/Properties";
import {ReactQueryDevtools} from "react-query/devtools";
import {QueryClient, QueryClientProvider} from 'react-query';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDetailContext from "./components/context/UserDetails";
function App() {
  const queryClient= new QueryClient();
  const [userDetails,setUserDetails] = useState({
    favourites:[],
    bookings:[],
    token:null
  });
  return (
    <UserDetailContext.Provider value={{userDetails,setUserDetails}}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <Suspense fallback={<div>Loading....</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Website />}/>
              <Route path="/properties">
                <Route index element={<Properties/>}/>
                <Route path=":propertyId" element={<Property/>}></Route>
              </Route>
            </Route>
          </Routes>
        </Suspense>
        </BrowserRouter>
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
    </UserDetailContext.Provider>
  );
}

export default App;
