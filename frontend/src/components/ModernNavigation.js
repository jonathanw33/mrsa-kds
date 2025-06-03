import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { useTheme } from './providers/theme-provider'
import { 
  Home, 
  Search, 
  History, 
  Info, 
  Moon, 
  Sun, 
  Activity,
  Shield
} from 'lucide-react'

const NavigationItem = ({ to, icon: Icon, children, className }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden md:inline">{children}</span>
    </Link>
  )
}

const ModernNavigation = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 medical-gradient rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-medical-600 to-bio-600 bg-clip-text text-transparent">
                MRSA-KDS
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Resistance Detection System
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <NavigationItem to="/" icon={Home}>
              Home
            </NavigationItem>
            <NavigationItem to="/analysis" icon={Search}>
              Analysis
            </NavigationItem>
            <NavigationItem to="/history" icon={History}>
              History
            </NavigationItem>
            <NavigationItem to="/about" icon={Info}>
              About
            </NavigationItem>
          </div>

          {/* Theme Toggle & Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-bio-500 animate-pulse" />
              <span className="hidden sm:inline">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default ModernNavigation
