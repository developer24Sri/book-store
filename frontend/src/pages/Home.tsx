import Banner from "../components/Banner";
import Footer from "../components/Footer";
import HomeAbout from "../components/HomeAbout";
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
        <HomeAbout />
        <Footer />
        </>
    )
}

export default Home;