import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, MapPin, Clock, Package, User, Phone, Search, Filter, AlertTriangle, RefreshCw, MessageSquare, Navigation2 } from "lucide-react";

interface ActiveDelivery {
  id: string;
  driver: string;
  vehicle: string;
  phone: string;
  currentLocation: string;
  nextStop: string;
  progress: number;
  packagesDelivered: number;
  totalPackages: number;
  estimatedCompletion: string;
  status: "En Route" | "Loading" | "Delivering" | "Delayed" | "Break";
  speed: number;
  lastUpdate: Date;
  batteryLevel: number;
  temperature: number;
  customerNotes: string;
}

interface RecentDelivery {
  id: string;
  address: string;
  customer: string;
  time: string;
  status: "Delivered" | "Failed" | "Returned";
  driver: string;
  rating: number;
  deliveryTime: number;
  signatureUrl?: string;
}

interface WeatherCondition {
  area: string;
  condition: "Sunny" | "Rainy" | "Cloudy" | "Storm";
  temperature: number;
  impact: "None" | "Low" | "Medium" | "High";
}

const RealTimeTracking = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>([]);
  const [recentDeliveries, setRecentDeliveries] = useState<RecentDelivery[]>([]);
  const [weatherConditions, setWeatherConditions] = useState<WeatherCondition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [emergencyAlerts, setEmergencyAlerts] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (autoRefresh) {
        updateDeliveryProgress();
        updateWeatherConditions();
      }
    }, refreshInterval * 1000);

    generateInitialData();
    const alertTimer = setInterval(checkForAlerts, 15000);
    const weatherTimer = setInterval(updateWeatherConditions, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(alertTimer);
      clearInterval(weatherTimer);
    };
  }, [autoRefresh, refreshInterval]);

  const generateInitialData = () => {
    const drivers = ["John Smith", "Sarah Johnson", "Mike Davis", "Lisa Wilson", "Tom Brown", "Anna Garcia", "Chris Lee", "Emma Rodriguez"];
    const vehicles = ["Van #247", "Truck #189", "Van #356", "Truck #442", "Van #523", "Bike #101", "Van #678", "Truck #234"];
    const locations = ["Downtown District", "Midtown Area", "Uptown Zone", "Suburbs", "East Side", "West End", "Industrial Park", "Airport Area"];
    const statuses: ("En Route" | "Loading" | "Delivering" | "Delayed" | "Break")[] = ["En Route", "Loading", "Delivering", "Delayed", "Break"];
    const customerNotes = ["Handle with care", "Signature required", "Leave at door", "Call upon arrival", "Ring doorbell twice", ""];
    
    const active = Array.from({ length: 6 + Math.floor(Math.random() * 4) }, (_, i) => ({
      id: `DEL${String(i + 1).padStart(3, '0')}`,
      driver: drivers[i % drivers.length],
      vehicle: vehicles[i % vehicles.length],
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      currentLocation: locations[Math.floor(Math.random() * locations.length)],
      nextStop: `${Math.floor(Math.random() * 999) + 100} ${["Main St", "Oak Ave", "Pine Rd", "Elm St", "Maple Dr", "Cedar Ln", "Birch Rd"][Math.floor(Math.random() * 7)]}`,
      progress: Math.floor(Math.random() * 90) + 10,
      packagesDelivered: Math.floor(Math.random() * 10) + 2,
      totalPackages: Math.floor(Math.random() * 8) + 12,
      estimatedCompletion: generateRandomTime(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      speed: Math.floor(Math.random() * 30) + 15,
      lastUpdate: new Date(Date.now() - Math.random() * 300000),
      batteryLevel: Math.floor(Math.random() * 50) + 50,
      temperature: Math.floor(Math.random() * 20) + 65,
      customerNotes: customerNotes[Math.floor(Math.random() * customerNotes.length)]
    }));

    const recentStatuses: ("Delivered" | "Failed" | "Returned")[] = ["Delivered", "Failed", "Returned"];
    const recent = Array.from({ length: 12 }, (_, i) => ({
      id: `PKG${String(i + 1).padStart(3, '0')}`,
      address: `${Math.floor(Math.random() * 999) + 100} ${["Elm St", "Maple Dr", "Cedar Ln", "Birch Rd", "Willow Way", "Pine Ave", "Oak Blvd"][Math.floor(Math.random() * 7)]}`,
      customer: `Customer ${String.fromCharCode(65 + i)} ${["Smith", "Johnson", "Brown", "Wilson", "Davis", "Miller", "Garcia", "Rodriguez"][Math.floor(Math.random() * 8)]}`,
      time: generatePastTime(),
      status: Math.random() > 0.85 ? recentStatuses[Math.floor(Math.random() * 3)] : "Delivered",
      driver: drivers[Math.floor(Math.random() * drivers.length)],
      rating: Math.floor(Math.random() * 2) + 4,
      deliveryTime: Math.floor(Math.random() * 30) + 5,
      signatureUrl: Math.random() > 0.7 ? "/placeholder.svg" : undefined
    }));

    setActiveDeliveries(active);
    setRecentDeliveries(recent);
    updateWeatherConditions();
  };

  const updateWeatherConditions = () => {
    const areas = ["Downtown", "Midtown", "Uptown", "Suburbs", "East Side", "West End", "Industrial", "Airport"];
    const conditions: ("Sunny" | "Rainy" | "Cloudy" | "Storm")[] = ["Sunny", "Rainy", "Cloudy", "Storm"];
    const impacts: ("None" | "Low" | "Medium" | "High")[] = ["None", "Low", "Medium", "High"];
    
    const weather = areas.map(area => ({
      area,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      temperature: Math.floor(Math.random() * 30) + 50,
      impact: impacts[Math.floor(Math.random() * impacts.length)]
    }));

    setWeatherConditions(weather);
  };

  const generateRandomTime = () => {
    const hour = Math.floor(Math.random() * 8) + 9;
    const minute = Math.floor(Math.random() * 60);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const generatePastTime = () => {
    const now = new Date();
    const pastHours = Math.floor(Math.random() * 6);
    const pastMinutes = Math.floor(Math.random() * 60);
    const pastTime = new Date(now.getTime() - (pastHours * 60 + pastMinutes) * 60000);
    return pastTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const updateDeliveryProgress = () => {
    setActiveDeliveries(prev => prev.map(delivery => {
      const progressIncrease = Math.floor(Math.random() * 8) + 1;
      const newProgress = Math.min(100, delivery.progress + progressIncrease);
      
      // Simulate package deliveries based on progress
      const expectedDelivered = Math.floor((newProgress / 100) * delivery.totalPackages);
      const newPackagesDelivered = Math.min(delivery.totalPackages, Math.max(delivery.packagesDelivered, expectedDelivered));
      
      // Complete delivery if progress reaches 100%
      if (newProgress >= 100) {
        // Move to recent deliveries
        const completedDelivery: RecentDelivery = {
          id: `PKG${Date.now()}`,
          address: delivery.nextStop,
          customer: `Customer at ${delivery.nextStop}`,
          time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          status: "Delivered",
          driver: delivery.driver,
          rating: Math.floor(Math.random() * 2) + 4,
          deliveryTime: Math.floor(Math.random() * 20) + 10
        };
        
        setRecentDeliveries(prev => [completedDelivery, ...prev.slice(0, 11)]);
        return null; // Remove from active deliveries
      }

      return {
        ...delivery,
        progress: newProgress,
        speed: Math.max(5, delivery.speed + (Math.random() - 0.5) * 10),
        lastUpdate: new Date(),
        packagesDelivered: newPackagesDelivered,
        batteryLevel: Math.max(10, delivery.batteryLevel - Math.random() * 2),
        temperature: delivery.temperature + (Math.random() - 0.5) * 5
      };
    }).filter(Boolean) as ActiveDelivery[]);
  };

  const checkForAlerts = () => {
    const alerts: string[] = [];
    activeDeliveries.forEach(delivery => {
      if (delivery.status === "Delayed") {
        alerts.push(`🚛 ${delivery.driver} is delayed in ${delivery.currentLocation}`);
      }
      if (delivery.speed < 10) {
        alerts.push(`⚠️ ${delivery.vehicle} is moving slowly (${delivery.speed.toFixed(1)} mph)`);
      }
      if (delivery.batteryLevel < 20) {
        alerts.push(`🔋 ${delivery.driver}'s device battery is low (${delivery.batteryLevel}%)`);
      }
      if (delivery.temperature > 85) {
        alerts.push(`🌡️ High temperature alert for ${delivery.vehicle} (${delivery.temperature}°F)`);
      }
      const timeSinceUpdate = (Date.now() - delivery.lastUpdate.getTime()) / 60000;
      if (timeSinceUpdate > 10) {
        alerts.push(`📡 No update from ${delivery.driver} for ${Math.floor(timeSinceUpdate)} minutes`);
      }
    });
    setEmergencyAlerts(alerts.slice(0, 5));
  };

  const sendMessageToDriver = (driverId: string) => {
    console.log(`Sending message to driver ${driverId}`);
    // Simulate message sending
  };

  const optimizeRoute = (deliveryId: string) => {
    setActiveDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId 
        ? { ...delivery, status: "En Route" as const, speed: delivery.speed + 5 }
        : delivery
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-500";
      case "En Route": return "bg-blue-500";
      case "Loading": return "bg-yellow-500";
      case "Delivering": return "bg-orange-500";
      case "Delayed": return "bg-red-500";
      case "Break": return "bg-purple-500";
      case "Failed": return "bg-red-600";
      case "Returned": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "En Route": return "secondary";
      case "Loading": return "outline";
      case "Delivering": return "destructive";
      case "Delayed": return "destructive";
      case "Break": return "secondary";
      case "Failed": return "destructive";
      case "Returned": return "outline";
      default: return "secondary";
    }
  };

  const filteredDeliveries = activeDeliveries.filter(delivery => {
    const matchesSearch = delivery.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.currentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDeliveries = recentDeliveries.length;
  const successfulDeliveries = recentDeliveries.filter(d => d.status === "Delivered").length;
  const averageRating = recentDeliveries.reduce((sum, d) => sum + d.rating, 0) / totalDeliveries;
  const activeVehicles = activeDeliveries.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Auto Refresh Controls */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={`h-5 w-5 ${autoRefresh ? 'animate-spin text-green-600' : 'text-gray-400'}`} />
              Auto Refresh Controls
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {currentTime.toLocaleTimeString()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              size="sm"
            >
              {autoRefresh ? "Pause" : "Resume"} Auto Refresh
            </Button>
            <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Every 3s</SelectItem>
                <SelectItem value="5">Every 5s</SelectItem>
                <SelectItem value="10">Every 10s</SelectItem>
                <SelectItem value="30">Every 30s</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={generateInitialData} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Force Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alerts */}
      {emergencyAlerts.length > 0 && (
        <Card className="lg:col-span-2 border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              Emergency Alerts ({emergencyAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {emergencyAlerts.map((alert, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-red-700 p-2 bg-red-100 rounded">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {alert}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter Controls */}
      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by driver, vehicle, location, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="En Route">En Route</SelectItem>
                <SelectItem value="Loading">Loading</SelectItem>
                <SelectItem value="Delivering">Delivering</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="Break">Break</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Deliveries with Enhanced Details */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Active Deliveries ({filteredDeliveries.length})
          </CardTitle>
          <CardDescription>
            Real-time tracking with live updates every {refreshInterval} seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{delivery.driver}</span>
                    </div>
                    <Badge variant="outline">{delivery.vehicle}</Badge>
                    <Badge variant={delivery.status === "Delayed" ? "destructive" : "default"}>
                      {delivery.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{delivery.speed.toFixed(1)} mph</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendMessageToDriver(delivery.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => optimizeRoute(delivery.id)}
                    >
                      <Navigation2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Current Location:</span>
                    <p className="text-gray-600">{delivery.currentLocation}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Next Stop:</span>
                    <p className="text-gray-600">{delivery.nextStop}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">ETA:</span>
                    <p className="text-gray-600">{delivery.estimatedCompletion}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-600">{delivery.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <span className="text-blue-600">🔋 Battery</span>
                    <p className="font-medium">{delivery.batteryLevel}%</p>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <span className="text-orange-600">🌡️ Temperature</span>
                    <p className="font-medium">{delivery.temperature.toFixed(1)}°F</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <span className="text-green-600">📦 Packages</span>
                    <p className="font-medium">{delivery.packagesDelivered}/{delivery.totalPackages}</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <span className="text-purple-600">⏱️ Last Update</span>
                    <p className="font-medium">{delivery.lastUpdate.toLocaleTimeString()}</p>
                  </div>
                </div>

                {delivery.customerNotes && (
                  <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                    <span className="text-xs font-medium text-yellow-800">Customer Notes:</span>
                    <p className="text-sm text-yellow-700">{delivery.customerNotes}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Route Progress</span>
                    <span className="text-gray-600">{delivery.progress}%</span>
                  </div>
                  <Progress value={delivery.progress} className="w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Live Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Live Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{activeDeliveries.length}</div>
              <div className="text-sm text-gray-600">Active Vehicles</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {recentDeliveries.filter(d => d.status === "Delivered").length}
              </div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {activeDeliveries.reduce((sum, d) => sum + (d.totalPackages - d.packagesDelivered), 0)}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((recentDeliveries.filter(d => d.status === "Delivered").length / Math.max(recentDeliveries.length, 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Avg Battery Level</span>
              <span className="text-sm font-medium">
                {(activeDeliveries.reduce((sum, d) => sum + d.batteryLevel, 0) / Math.max(activeDeliveries.length, 1)).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Avg Temperature</span>
              <span className="text-sm font-medium">
                {(activeDeliveries.reduce((sum, d) => sum + d.temperature, 0) / Math.max(activeDeliveries.length, 1)).toFixed(1)}°F
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Alerts</span>
              <span className="text-sm font-medium text-red-600">{emergencyAlerts.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Impact Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {weatherConditions.map((weather, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium">{weather.area}</p>
                  <p className="text-sm text-gray-600">{weather.condition} • {weather.temperature}°F</p>
                </div>
                <Badge variant={weather.impact === "High" ? "destructive" : weather.impact === "Medium" ? "default" : "secondary"}>
                  {weather.impact} Impact
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest delivery completions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentDeliveries.slice(0, 6).map((delivery) => (
              <div key={delivery.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(delivery.status)}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{delivery.address}</p>
                  <p className="text-xs text-gray-500">Customer: {delivery.customer}</p>
                  <p className="text-xs text-gray-500">Driver: {delivery.driver}</p>
                  {delivery.status === "Delivered" && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-yellow-600">★</span>
                      <span className="text-xs text-gray-500">{delivery.rating}/5</span>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-medium text-gray-900">{delivery.time}</p>
                  <Badge variant={getStatusBadge(delivery.status)} className="text-xs">
                    {delivery.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeTracking;
