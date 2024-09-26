import React from 'react'
import Navbar from './shared/Nav'

const MainPageLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
           <Navbar/>
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t py-4 text-center text-sm text-muted-foreground">
                <div className="container mx-auto px-4">
                    &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

export default MainPageLayout