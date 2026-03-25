import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"


const OurBestSeller = () => {

    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => scrollRef.current?.scrollBy({left: -400, behavior: "smooth"})
    const scrollRight = () => scrollRef.current?.scrollBy({left: 400, behavior: "smooth"})

  return (
    <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
            {/* header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4 md:gap-6">
                <div className="space-y-1 md:space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        <span className="bg-linear-to-r from-[#1A237E] to-[#43C6AC] bg-clip-text text-transparent">
                            Curated Excellence
                        </span>
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg">Top Rated by Our Readers</p>
                </div>
                {/* Carousel buttons */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="hidden md:block flex-1 border-t border-gray-200" />
                    <div className="flex items-center gap-2 md:gap-3">
                        <button onClick={scrollLeft} className="p-2 md:p-3 rounded-full bg-white shadow-md md:shadow-lg hover:shadow-lg transition-shadow">
                            <ChevronLeft size={20} className="text-[#1A237E]" />
                        </button>
                        <button onClick={scrollRight} className="p-2 md:p-3 rounded-full bg-white shadow-md md:shadow-lg hover:shadow-lg transition-shadow">
                            <ChevronRight size={20} className="text-[#1A237E]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default OurBestSeller