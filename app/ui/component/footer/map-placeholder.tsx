// app/ui/components/footer/MapPlaceholder.tsx
export default function MapPlaceholder() {
    return (
      <div className="h-80 bg-white rounded-2xl overflow-hidden relative">
        {/* Map placeholder with Cape Town style imagery */}
        <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
          {/* Mountain silhouette */}
          <svg className="absolute bottom-0 left-0 w-full h-1/2 text-gray-300" viewBox="0 0 400 100" fill="currentColor">
            <path d="M0,100 L0,60 L50,40 L100,50 L150,30 L200,35 L250,25 L300,40 L350,35 L400,45 L400,100 Z"/>
          </svg>
          
          {/* City buildings */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 flex items-end justify-center space-x-1">
            <div className="w-3 h-8 bg-gray-400"></div>
            <div className="w-4 h-12 bg-gray-500"></div>
            <div className="w-3 h-6 bg-gray-400"></div>
            <div className="w-5 h-14 bg-gray-600"></div>
            <div className="w-3 h-9 bg-gray-400"></div>
            <div className="w-4 h-11 bg-gray-500"></div>
          </div>
          
          {/* Map location text */}
          <div className="absolute top-4 left-4 bg-white/90 px-3 py-2 rounded-lg">
            <p className="text-gray-800 text-sm font-medium">Meet Cape Bay</p>
          </div>
          
          {/* Location marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg"></div>
          </div>
        </div>
      </div>
    );
}
  