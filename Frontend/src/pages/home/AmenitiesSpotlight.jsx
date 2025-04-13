const AmenitiesSpotlight = () => {
    const amenities = [
      { 
        title: "Study Lounges", 
        desc: "Quiet spaces with high-speed WiFi", 
        icon: "📚",
        imgPrompt: "Modern university study lounge with students working, floor-to-ceiling windows, Scandinavian furniture, natural light"
      },
      { 
        title: "Secure Storage", 
        desc: "24/7 monitored personal lockers", 
        icon: "🔒",
        imgPrompt: "Neat row of student lockers with digital locks, well-lit corridor, security camera visible"
      },
      { 
        title: "Laundry Facilities", 
        desc: "Free washers & dryers on-site", 
        icon: "👕",
        imgPrompt: "Modern laundry room with energy-efficient washing machines, folding tables, clean aesthetic"
      }
    ];
  
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Student-Centric Amenities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for comfortable academic living
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {amenities.map((item, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="h-48 bg-gradient-to-r from-green-100 to-green-50 flex items-center justify-center text-6xl">
                  {item.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.desc}</p>
                  <button className="text-green-600 font-medium flex items-center group-hover:underline">
                    View listings
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  export default AmenitiesSpotlight;