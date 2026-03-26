

const About = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8fafc] to-[#f0fdfa] pt-24">
        <section className="relative py-10 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-2 space-y-8">
                    <div className="relative inline-block">
                        <h1 className="text-6xl md:text-7xl font-black bg-linear-to-r from-[#43C6AC] to-[#2B5876] bg-clip-text text-transparent mb-6 leading-tight">
                            Crafting Literary <br /> Futures
                        </h1>
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-linear-to-r from-[#43C6AC] to-[#F8FFAE] rounded-full" />

                    </div>
                    <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
                        Pioneering the next chapter in global storytelling. We bridge imagination with innovation through curated literary.
                    </p>
                </div>
            </div>
        </section>
    </div>    
  )
}

export default About