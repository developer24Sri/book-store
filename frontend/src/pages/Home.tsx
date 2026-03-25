import Banner from "../components/Banner";
import HomeBooks from "../components/HomeBooks";
import Navbar from "../components/Navbar";
import OurBestSeller from "../components/OurBestSeller";

const Home = () => {
    return(
        <>
        <Navbar />
        <Banner />
        <OurBestSeller />
        <HomeBooks />
        </>
    )
}

export default Home;