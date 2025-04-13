import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Layout from "../pages/Layout";
import Dashboard from "@/pages/dashboard";
import History from "@/pages/history";
import GraphTemp from "@/pages/graphTemp";
import Analysis from "@/pages/analysis";

const router=createBrowserRouter([
    {
        path:'/',
        element:<Layout/>,
        children:[
            {
                path:'/',
                element:<Landing/>
            }
        ]
    },
    {
        path:"/signup",
        element:(
            <>
                <h1>Signup Page</h1>
            </>
        )
    },
    {
        path:"/login",
        element:(
            <>
                <h1>Login Page</h1>
            </>
        )
    },
    {
        path:"/dashboard",
        element:(
            <>
                <Dashboard />
            </>
        )
    },
    {
        path:"/history",
        element:(
            <>
                <History />
            </>
        )
    },
    {
        path: "/graph",
        element:(
            <>
                <GraphTemp />
            </>
        )
    },
    {
        path: "/analysis/:postId",
        element:( 
            <>
                <Analysis /> 
            </>
        )
    },
    {
        path:"*",
        element:(
            <>
                <h1>404 Page not found</h1>
            </>
        )
    }
])

export default router;