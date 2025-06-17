
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Monitoramento em Tempo Real",
      description: "Acompanhe a temperatura de múltiplas localidades com intervalos configuráveis",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: AlertTriangle,
      title: "Alertas Inteligentes",
      description: "Receba notificações quando a temperatura ultrapassar os limites definidos",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description: "Visualize históricos completos e analise tendências de temperatura",
      color: "bg-green-50 text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Thermometer className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">TempTracker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistema inteligente de monitoramento de temperatura com alertas automáticos e relatórios detalhados para suas localidades
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Thermometer className="mr-2 h-5 w-5" />
                Ver Dashboard
              </Button>
            </Link>
            <Link to="/add-location">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Adicionar Localidade
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.color} mb-6`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Comece agora mesmo</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Configure sua primeira localidade e comece a monitorar a temperatura em tempo real
          </p>
          <Link to="/add-location">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Adicionar Primeira Localidade
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
