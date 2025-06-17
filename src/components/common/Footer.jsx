const Footer = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-xl border-t border-gray-900 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-500">© 2024</span>
            <span className="text-3xl font-black text-gradient-gold animate-shimmer">vVv</span>
            <span className="text-gray-500">Gaming</span>
          </div>
          
          <p className="text-gray-400 text-sm">
            Track your crusades with{' '}
            <span className="text-vvv-gold font-bold glow-text">$V</span>
          </p>
          
          <div className="flex justify-center space-x-6">
            <a 
              href="https://x.com/vvvdotnet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="p-2 rounded-lg border border-gray-800 group-hover:border-gray-700 group-hover:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all duration-300">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-vvv-gold transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
            </a>
            
            <a 
              href="https://chips.vvv.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="p-2 rounded-lg border border-gray-800 group-hover:border-gray-700 group-hover:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all duration-300">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-vvv-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 15l-2 5l9-11h-6l2-5l-9 11z" />
                </svg>
              </div>
            </a>
            
            <a 
              href="https://vvv.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="p-2 rounded-lg border border-gray-800 group-hover:border-gray-700 group-hover:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all duration-300">
                <span className="text-gray-400 group-hover:text-vvv-gold transition-colors font-bold text-sm">
                  vVv
                </span>
              </div>
            </a>
          </div>
          
          <div className="pt-4 border-t border-gray-900">
            <p className="text-xs text-gray-600">
              Built with strength for the vVv community
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer