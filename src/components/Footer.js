export default function Footer() {
  return (
    <footer className="bg-stone-200 mt-16">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center space-x-8 text-sm text-gray-700">
          <a href="#" className="hover:text-gray-900">Products</a>
          <a href="#" className="hover:text-gray-900">Returns</a>
          <a href="#" className="hover:text-gray-900">FAQ</a>
          <a href="#" className="hover:text-gray-900">Shipping</a>
          <a href="#" className="hover:text-gray-900">About us</a>
          <a href="#" className="hover:text-gray-900">Contact us</a>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mt-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.5 6.5a9.5 9.5 0 01-2.7.7 4.7 4.7 0 002.1-2.6 9.4 9.4 0 01-3 1.1 4.7 4.7 0 00-8 4.3A13.3 13.3 0 011.7 5.1a4.7 4.7 0 001.5 6.3 4.7 4.7 0 01-2.1-.6v.1a4.7 4.7 0 003.8 4.6 4.7 4.7 0 01-2.1.1 4.7 4.7 0 004.4 3.3A9.4 9.4 0 011 21a13.3 13.3 0 007.3 2.1c8.8 0 13.6-7.3 13.6-13.6 0-.2 0-.4-.01-.6A9.7 9.7 0 0024 6.5z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.5 12.1c0-5.4-4.4-9.7-9.7-9.7S3.1 6.7 3.1 12.1c0 4.8 3.5 8.8 8.1 9.5v-6.7H8.9v-2.8h2.3V9.9c0-2.3 1.4-3.6 3.5-3.6 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.4v1.7h2.6l-.4 2.8h-2.2v6.7c4.6-.7 8.1-4.7 8.1-9.5z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.2 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4 1.3-.1 1.7-.1 4.9-.1m0-2.2C8.9 0 8.5 0 7.2.1 5.9.1 5 .3 4.2.6c-.8.3-1.5.7-2.2 1.4C1.3 2.7.9 3.4.6 4.2.3 5 .1 5.9.1 7.2 0 8.5 0 8.9 0 12.2s0 3.7.1 5c.1 1.3.2 2.2.5 3 .3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.7.4 3 .5 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.2 3-.5.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.4-1.7.5-3 .1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.2-2.2-.5-3-.3-.8-.7-1.5-1.4-2.2C20.8 1.3 20.1.9 19.3.6c-.8-.3-1.7-.4-3-.5C15 0 14.6 0 11.3 0h.9z"/>
              <path d="M12.2 5.8c-3.5 0-6.4 2.9-6.4 6.4s2.9 6.4 6.4 6.4 6.4-2.9 6.4-6.4-2.9-6.4-6.4-6.4zm0 10.5c-2.3 0-4.1-1.8-4.1-4.1s1.8-4.1 4.1-4.1 4.1 1.8 4.1 4.1-1.8 4.1-4.1 4.1z"/>
              <circle cx="18.8" cy="5.4" r="1.5"/>
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5V9h3v10zM6.5 7.7c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8zM19 19h-3v-5.6c0-3.4-4-3.1-4 0V19h-3V9h3v1.8c1.4-2.6 7-2.8 7 2.5V19z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom copyright section */}
      <div className="bg-green-700 text-white text-center py-3 text-sm">
        COPYRIGHT GREEN THUMB. ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}