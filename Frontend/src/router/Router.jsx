import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/shop/Menu";
import Signup from "../components/Signup";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import UpdateProfile from "../pages/dashboard/UpdateProfile";
import OwnerLayout from "../layout/OwnerLayout";
import OwnerDashboard from "../pages/dashboard/Owner/Dashboard";
import AdminDashboard from "../pages/dashboard/Admin/Dashboard";
import Users from "../pages/dashboard/Admin/Users";
import Login from "../components/Login";
import Payment from "../pages/shop/Payment";
import Payments from "../pages/dashboard/Order";
import Chat from "../pages/chat/Chat";
import SingleListing from "../pages/shop/SingleListing";
import AddBoarding from "../pages/dashboard/Owner/AddBoarding";
import AddListing from "../pages/dashboard/Owner/AddListing";
import UpdateListing from "../pages/dashboard/Owner/UpdateListing";
import ManageListing from "../pages/dashboard/Owner/ManageListing";
import AdminLayout from "../layout/AdminLayout";
import ViewBoarding from "../pages/dashboard/Owner/ViewBoarding";
import UpdateBoarding from "../pages/dashboard/Owner/UpdateBoarding";
import Loading from "../components/LoadingSpinner";
import ManageBoardings from "../pages/dashboard/Admin/ManageBoardings";
import SingleUser from "../components/SingleUser";
import ViewListing from "../pages/dashboard/Owner/ViewListing";
import ManageBooking from "../pages/dashboard/Owner/ManageBooking";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      children: [
        {
            path: "/",
            element: <Home/>
        },
        {
            path: "/menu",
            element: <Menu/>
        },
        // {
        //   path: "/cart-page",
        //   element: <CartPage/>
        // },
        {
          path: "/payments",
          element:<PrivateRouter><Payments/></PrivateRouter>
        },
        {
          path: "/update-profile",
          element: <PrivateRouter><UpdateProfile/></PrivateRouter>
        },
        {
          path: "/process-checkout",
          element: <Payment/>
        },
        {
          path: "/listing/:id",
          element: <SingleListing/>
        },
        {
          path: "/loading",
          element: <Loading/>
        },
      ],
    },
    {
      path: "/update-boarding/:id",
      element: <UpdateBoarding/>,
      loader: ({params}) => fetch(`http://localhost:3000/boarding/${params.id}`)
    },
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/chats",
      element: <PrivateRouter><Chat/></PrivateRouter>
    },
    {
      path: 'dashboard',
      element: <PrivateRouter><AdminLayout/></PrivateRouter>,
      children: [
        {
          path: '',
          element: <AdminDashboard/>
        },
        {
          path: 'users',
          element: <Users/>
        },
        {
          path: 'manage-boarding',
          element: <ManageBoardings/>
        },
        {
          path: 'view-boarding/:email',
          element: <ViewBoarding/>
        },
        {
          path: 'manage-items',
          element: <AdminDashboard/>
        },
        {
          path: "view-user/:email",
          element: <PrivateRouter><SingleUser/></PrivateRouter>
        },
        {
          path: "update-listing/:id",
          element: <AdminDashboard/>,
          loader: ({params}) => fetch(`http://localhost:3000/menu/${params.id}`)
        }
      ],
    },
    {
      path: 'owner',
      element: <PrivateRouter><OwnerLayout/></PrivateRouter>,
      children: [
        {
          path: '',
          element: <OwnerDashboard/>
        },
        {
          path: 'add-listing',
          element: <AddListing/>
        },
        {
          path: 'add-boarding',
          element: <AddBoarding/>
        },
        {
          path: 'view-boarding/:email',
          element: <ViewBoarding/>
        },
        {
          path: 'view-listing/:id',
          element: <ViewListing/>
        },
        {
          path: "update-boarding/:id",
          element: <UpdateBoarding/>,
          loader: ({params}) => fetch(`http://localhost:3000/boarding/${params.id}`)
        },
        {
          path: 'manage-items',
          element: <ManageListing/>
        },
        {
          path: 'manage-booking',
          element: <ManageBooking/>
        },
        {
          path: "update-listing/:id",
          element: <UpdateListing/>,
          loader: ({params}) => fetch(`http://localhost:3000/listing/${params.id}`)
        }
      ],
    }
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    },
  });

  export default router