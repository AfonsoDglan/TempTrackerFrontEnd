
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, RefreshCw, Thermometer, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface TemperatureReading {
  id: number;
  location_name: string;
  temperature_celsius: number;
  timestamp: string;
  generated_notification: boolean;
}

interface Location {
  id: number;
  location_name: string;
  latitude: number;
  longitude: number;
  temperature_limit_celsius: number;
  monitoring_interval_minutes: number;
  is_active: boolean;
}

interface ReportStats {
  totalReadings: number;
  maxTemp: number;
  avgTemp: number;
  alerts: number;
}

const Reports = () => {
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("24h");
  const [stats, setStats] = useState<ReportStats>({
    totalReadings: 0,
    maxTemp: 0,
    avgTemp: 0,
    alerts: 0
  });

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:8000/temperature/api/v1/monitor-settings/");
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchReadings = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/temperature/api/v1/temperature-readings/?time_range=${selectedPeriod}`;
      
      if (selectedLocation !== "all") {
        url += `&location_id=${selectedLocation}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setReadings(data);
        calculateStats(data);
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar dados de temperatura",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching readings:", error);
      toast({
        title: "Erro",
        description: "Erro ao conectar com a API",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: TemperatureReading[]) => {
    const totalReadings = data.length;
    const temperatures = data.map(r => r.temperature_celsius);
    const maxTemp = temperatures.length > 0 ? Math.max(...temperatures) : 0;
    const avgTemp = temperatures.length > 0 ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length : 0;
    const alerts = data.filter(r => r.generated_notification).length;

    setStats({
      totalReadings,
      maxTemp,
      avgTemp: Number(avgTemp.toFixed(1)),
      alerts
    });
  };

  const exportToCSV = () => {
    if (readings.length === 0) {
      toast({
        title: "Aviso",
        description: "Não há dados para exportar",
        variant: "destructive"
      });
      return;
    }

    const headers = ["ID", "Localidade", "Temperatura (°C)", "Data/Hora", "Alerta Gerado"];
    const csvContent = [
      headers.join(","),
      ...readings.map(reading => [
        reading.id,
        `"${reading.location_name}"`,
        reading.temperature_celsius,
        `"${new Date(reading.timestamp).toLocaleString("pt-BR")}"`,
        reading.generated_notification ? "Sim" : "Não"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_temperatura_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sucesso",
      description: "Relatório exportado com sucesso"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "24h": return "Últimas 24 horas";
      case "7d": return "Últimos 7 dias";
      case "30d": return "Últimos 30 dias";
      default: return period;
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchReadings();
  }, [selectedLocation, selectedPeriod]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios de Temperatura</h1>
            <p className="text-gray-600 mt-1">Análise detalhada dos dados de monitoramento</p>
          </div>
          
          <Button 
            onClick={exportToCSV}
            disabled={readings.length === 0}
            className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Localidade</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as localidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as localidades</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.location_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Período</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Últimas 24 horas</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalReadings}</div>
              <div className="text-sm text-gray-600">Total de Leituras</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Thermometer className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.maxTemp}°C</div>
              <div className="text-sm text-gray-600">Temp. Máxima</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Thermometer className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.avgTemp}°C</div>
              <div className="text-sm text-gray-600">Temp. Média</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.alerts}</div>
              <div className="text-sm text-gray-600">Alertas</div>
            </CardContent>
          </Card>
        </div>

        {/* Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Dados de Temperatura</span>
              <div className="text-sm text-gray-600">
                {selectedLocation === "all" ? "Todas as localidades" : 
                  locations.find(l => l.id.toString() === selectedLocation)?.location_name} - {getPeriodLabel(selectedPeriod)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Carregando dados da API...</p>
              </div>
            ) : readings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum dado encontrado para os filtros selecionados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-900">Localidade</th>
                      <th className="text-left p-3 font-medium text-gray-900">Temperatura</th>
                      <th className="text-left p-3 font-medium text-gray-900">Data/Hora</th>
                      <th className="text-left p-3 font-medium text-gray-900">Alerta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings.map((reading) => (
                      <tr key={reading.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-900">{reading.location_name}</td>
                        <td className="p-3">
                          <span className={`font-medium ${
                            reading.generated_notification ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {reading.temperature_celsius}°C
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">{formatDate(reading.timestamp)}</td>
                        <td className="p-3">
                          {reading.generated_notification && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Sim
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;
