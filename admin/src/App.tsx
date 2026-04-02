import { Route, Routes } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import AddBook from "./components/AddBook"
import ListBook from "./components/ListBook"
import Orders from "./components/Orders"

const App = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<AddBook />} />
                    <Route path="/list-books" element={<ListBook />} />
                    <Route path="/orders" element={<Orders />} />
                </Routes>
            </main>
        </div>
    )
}

export default App