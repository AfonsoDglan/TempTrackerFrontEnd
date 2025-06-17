
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertTriangle, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface Alert {
  id: number;
  location_name: string;
  alert_temperature_celsius: number;
  alert_timestamp: string;
  read_confirmation: boolean;
  notification_sent: boolean;
  monitor_setting: number;
}

interface Location {
  id: number;
  location_name: string;
  latitude: number;
  longitude: number;
  temperature_limit_celsius: number;
  monitoring_interval_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [alertsResponse, locationsResponse] = await Promise.all([
        fetch("http://localhost:8000/temperature/api/v1/alerts/"),
        fetch("http://localhost:8000/temperature/api/v1/monitor-settings/")
      ]);

      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        const unconfirmedAlerts = alertsData.filter((alert: Alert) => !alert.read_confirmation);
        setAlerts(unconfirmedAlerts);
      }

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();
        setLocations(locationsData.filter((loc: Location) => loc.is_active));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados. Verifique se a API está funcionando.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const confirmAlert = async (alertId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/temperature/api/v1/alerts/confirm/${alertId}/`, {
        method: "POST"
      });

      if (response.ok) {
        setAlerts(alerts.filter(alert => alert.id !== alertId));
        toast({
          title: "Sucesso",
          description: "Alerta confirmado com sucesso"
        });
      }
    } catch (error) {
      console.error("Error confirming alert:", error);
      toast({
        title: "Erro",
        description: "Erro ao confirmar alerta",
        variant: "destructive"
      });
    }
  };

  const refreshAll = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Monitoramento</h1>
            <p className="text-gray-600 mt-2">
              {locations.length} localidades · {alerts.length} alertas ativos
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={refreshAll}
              disabled={refreshing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Atualizar Todos</span>
            </Button>
            
            <Link to="/add-location">
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nova Localidade</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Alertas Ativos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Alertas Ativos ({alerts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum alerta ativo no momento</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span className="font-semibold text-red-900">{alert.location_name}</span>
                        <Badge variant="destructive">Ativo</Badge>
                      </div>
                      <p className="text-red-700">
                        Temperatura de {alert.alert_temperature_celsius}°C excede o limite
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        {formatDate(alert.alert_timestamp)}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => confirmAlert(alert.id)}
                      variant="outline"
                      className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
                    >
                      ✓ Confirmar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Localidades Ativas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Localidades Monitoradas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {locations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-4">Nenhuma localidade configurada</p>
                <Link to="/add-location">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeira Localidade
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <Card key={location.id} className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{location.location_name}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Ativo
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Limite: {location.temperature_limit_celsius}°C</p>
                        <p>Intervalo: {location.monitoring_interval_minutes} min</p>
                        <p>Coordenadas: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
