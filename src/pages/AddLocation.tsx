
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapPin, Thermometer, Clock, Save, ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const AddLocation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location_name: "",
    latitude: "",
    longitude: "",
    temperature_limit_celsius: "30",
    monitoring_interval_minutes: "30",
    notification_email: "",
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }));
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setLoading(false);
          toast({
            title: "Localização obtida",
            description: "Coordenadas atualizadas com sucesso"
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
          toast({
            title: "Erro",
            description: "Não foi possível obter a localização atual",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Erro",
        description: "Geolocalização não suportada pelo navegador",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location_name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da localidade é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        location_name: formData.location_name.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        temperature_limit_celsius: formData.temperature_limit_celsius ? parseFloat(formData.temperature_limit_celsius) : null,
        monitoring_interval_minutes: formData.monitoring_interval_minutes ? parseInt(formData.monitoring_interval_minutes) : null,
        notification_email: formData.notification_email.trim() || null,
        is_active: formData.is_active
      };

      const response = await fetch("http://localhost:8000/temperature/api/v1/monitor-settings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Localidade adicionada com sucesso"
        });
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro",
          description: errorData.message || "Erro ao adicionar localidade",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding location:", error);
      toast({
        title: "Erro",
        description: "Erro ao conectar com a API",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Adicionar Nova Localidade</h1>
            <p className="text-gray-600 mt-1">Configure uma nova localidade para monitoramento de temperatura</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Configuração da Localidade</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome da Localidade */}
              <div className="space-y-2">
                <Label htmlFor="location_name" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Nome da Localidade *</span>
                </Label>
                <Input
                  id="location_name"
                  name="location_name"
                  value={formData.location_name}
                  onChange={handleInputChange}
                  placeholder="Ex: São Paulo - Centro"
                  className="w-full"
                  required
                />
              </div>

              {/* Coordenadas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Usar Minha Localização Atual
              </Button>

              {/* Limite de Temperatura */}
              <div className="space-y-2">
                <Label htmlFor="temperature_limit_celsius" className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4" />
                  <span>Limite de Temperatura (°C)</span>
                </Label>
                <Input
                  id="temperature_limit_celsius"
                  name="temperature_limit_celsius"
                  type="number"
                  step="0.1"
                  value={formData.temperature_limit_celsius}
                  onChange={handleInputChange}
                  placeholder="30"
                />
              </div>

              {/* Intervalo de Monitoramento */}
              <div className="space-y-2">
                <Label htmlFor="monitoring_interval_minutes" className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Intervalo de Monitoramento (minutos)</span>
                </Label>
                <Input
                  id="monitoring_interval_minutes"
                  name="monitoring_interval_minutes"
                  type="number"
                  min="1"
                  value={formData.monitoring_interval_minutes}
                  onChange={handleInputChange}
                  placeholder="30"
                />
              </div>

              {/* Email de Notificação */}
              <div className="space-y-2">
                <Label htmlFor="notification_email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email de Notificação</span>
                </Label>
                <Input
                  id="notification_email"
                  name="notification_email"
                  type="email"
                  value={formData.notification_email}
                  onChange={handleInputChange}
                  placeholder="exemplo@email.com"
                />
              </div>

              {/* Ativar Monitoramento */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <Label htmlFor="is_active" className="font-medium">Ativar Monitoramento</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Iniciar monitoramento automaticamente após adicionar
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleSwitchChange}
                />
              </div>

              {/* Botões */}
              <div className="flex space-x-4 pt-4">
                <Link to="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Localidade"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddLocation;
