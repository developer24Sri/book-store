import { Route, Routes } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import AddBook from "./components/AddBook"

const App = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<AddBook />} />
                </Routes>
            </main>
        </div>
    )
}

export default App