import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './register'



const Router = () => {
    return (<BrowserRouter>
        <Routes>
            {Register.map(val=>{
                const { path, comp, key, childs} = val
                return childs ? <Route key={key} path={path} element={comp} >
                    {
                        childs.map(child=>{
                            const { path, comp, key} = child
                            return <Route key={key} path={path} element={comp} />
                        })
                    }
                </Route> : <Route key={key} path={path} element={comp} /> 
            })}
        </Routes>
    </BrowserRouter>)
}


export default Router