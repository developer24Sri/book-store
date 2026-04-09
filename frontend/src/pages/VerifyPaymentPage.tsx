import axios from "axios";
import {API_BASE} from "../apiConfig";
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyPaymentPage = () => {

    const token = localStorage.getItem("authToken");
    

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const session_id = searchParams.get("session_id");

    const [statusMsg, setStatusMsg] = useState(
        session_id ? "Verifying Payment..." : "Session id is missing!"
    );


    useEffect(() => {
        if (!session_id) return;

        axios.get(`${API_BASE}/api/order/confirm`, {
            params: { session_id },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then(() => {
                setStatusMsg("Payment Confirmed! Redirecting to your orders...")
                setTimeout(() => navigate("/orders", { replace: true }), 2000);
            })
            .catch((err) => {
                console.error("Confirmation error:", err);
                setStatusMsg(err.response.data.message || "Error confirming payment. Please contact support")
            })
    }, [session_id, API_BASE, navigate, token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <p className="text-lg">{statusMsg}</p>
        </div>
    )
}

export default VerifyPaymentPage