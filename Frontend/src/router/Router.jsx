import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Browse from "../pages/browse/Browse";
import Signup from "../components/Signup";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import UpdateProfile from "../pages/dashboard/UpdateProfile";
import OwnerLayout from "../layout/OwnerLayout";
import OwnerDashboard from "../pages/dashboard/Owner/Dashboard";
import AdminDashboard from "../pages/dashboard/Admin/Dashboard";
import Users from "../pages/dashboard/Admin/Users";
import Login from "../components/Login";
import Payment from "../pages/browse/Payment";
import Payments from "../pages/dashboard/Payments";
import Chat from "../pages/chat/Chat";
import SingleListing from "../pages/browse/SingleListing";
import AddListing from "../pages/dashboard/Owner/AddListing";
import UpdateListing from "../pages/dashboard/Owner/UpdateListing";
import RecentPayments from "../pages/dashboard/Owner/RecentPayments";
import ManageListing from "../pages/dashboard/Owner/ManageListing";
import AdminLayout from "../layout/AdminLayout";
import ViewBoarding from "../pages/dashboard/Owner/ViewBoarding";
import UpdateBoarding from "../pages/dashboard/Owner/UpdateBoarding";
import Loading from "../components/LoadingSpinner";
import ManageBoardings from "../pages/dashboard/Admin/ManageBoardings";
import SingleUser from "../components/SingleUser";
import ViewListing from "../pages/dashboard/Owner/ViewListing";
import ManageBooking from "../pages/dashboard/Owner/ManageBooking";
import ListingFee from "../pages/dashboard/Owner/ListingFee";
import ManageTransactions from "../pages/dashboard/Admin/ManageTransactions";
import ViewBookings from "../pages/dashboard/Admin/ViewBookings";
import Bookings from "../pages/dashboard/Bookings";

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
            path: "/browse",
            element: <Browse/>
        },
        {
          path: "/payments",
          element:<PrivateRouter><Payments/></PrivateRouter>
        },
        {
          path: "/bookings",
          element:<PrivateRouter><Bookings/></PrivateRouter>
        },
        {
          path: "/update-profile",
          element: <PrivateRouter><UpdateProfile/></PrivateRouter>
        },
        {
          path: "/pay-boarding",
          element: <PrivateRouter><Payment/></PrivateRouter>
        },
        {
          path: "/listing/:id",
          element: <SingleListing/>
        },
        {
          path: "/loading",
          element: <Loading/>
        },
        {
          path: "/listing-fee",
          element: <PrivateRouter><ListingFee/></PrivateRouter>
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
          path: 'transactions',
          element: <ManageTransactions/>
        },
        {
          path: 'bookings',
          element: <ViewBookings/>
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
          path: 'view-listing/:id',
          element: <ViewListing/>
        },
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
        // {
        //   path: 'add-boarding',
        //   element: <AddBoarding/>
        // },
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
        },
        {
          path: 'recent-payments',
          element: <RecentPayments/>
        },
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