
import { Link, useLocation } from "react-router-dom";
import { Thermometer, Home, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Início", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: Thermometer },
    { path: "/add-location", label: "Adicionar Local", icon: Plus },
    { path: "/reports", label: "Relatórios", icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Thermometer className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">TempTracker</span>
        </Link>
        
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
