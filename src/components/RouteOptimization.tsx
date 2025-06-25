import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Navigation, Clock, Fuel, AlertTriangle, RefreshCw, Plus, X, Filter } from "lucide-react";

interface DeliveryPoint {
  id: number;
  address: string;
  packages: number;
  priority: "High" | "Medium" | "Low";
  estimatedTime: string;
  customerName: string;
  phoneNumber: string;
  isCompleted: boolean;
}

interface TrafficCondition {
  area: string;
  condition: "Heavy" | "Moderate" | "Light";
  color: string;
  delay: number;
}

const RouteOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoint[]>([]);
  const [trafficConditions, setTrafficConditions] = useState<TrafficCondition[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("time");
  const [newAddress, setNewAddress] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [routeEfficiency, setRouteEfficiency] = useState(85);
  const [estimatedSavings, setEstimatedSavings] = useState({ time: 0, fuel: 0, cost: 0 });

  // Initialize dynamic data
  useEffect(() => {
    generateInitialData();
    const trafficInterval = setInterval(updateTrafficConditions, 15000); // Update every 15 seconds
    const optimizationInterval = setInterval(() => {
      if (autoOptimize && !isOptimizing) {
        handleOptimizeRoute();
      }
    }, 60000); // Auto-optimize every minute
    
    const realTimeInterval = setInterval(() => {
      if (realTimeUpdates) {
        updateDeliveryStatus();
        calculateRouteMetrics();
      }
    }, 10000); // Update delivery status every 10 seconds

    return () => {
      clearInterval(trafficInterval);
      clearInterval(optimizationInterval);
      clearInterval(realTimeInterval);
    };
  }, [autoOptimize, isOptimizing, realTimeUpdates]);

  const generateInitialData = () => {
    const addresses = [
      "123 Main St, Downtown", "456 Oak Ave, Midtown", "789 Pine Rd, Uptown",
      "321 Elm St, Suburbs", "654 Maple Dr, East Side", "987 Cedar Ln, West End",
      "147 Birch Rd, North District", "258 Willow Way, South Area"
    ];
    
    const customers = [
      "John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Wilson",
      "Diana Davis", "Eve Martinez", "Frank Garcia", "Grace Lee", "Henry Wang"
    ];

    const priorities: ("High" | "Medium" | "Low")[] = ["High", "Medium", "Low"];
    
    const points = addresses.slice(0, 5 + Math.floor(Math.random() * 3)).map((address, index) => ({
      id: index + 1,
      address,
      packages: Math.floor(Math.random() * 8) + 1,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      estimatedTime: generateRandomTime(),
      customerName: customers[Math.floor(Math.random() * customers.length)],
      phoneNumber: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      isCompleted: Math.random() > 0.8
    }));

    setDeliveryPoints(points);
    updateTrafficConditions();
    calculateRouteMetrics();
  };

  const generateRandomTime = () => {
    const hour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
    const minute = Math.floor(Math.random() * 60);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const updateTrafficConditions = () => {
    const areas = ["Downtown", "Midtown", "Uptown", "Suburbs", "East Side", "West End"];
    const conditions: ("Heavy" | "Moderate" | "Light")[] = ["Heavy", "Moderate", "Light"];
    const colors = ["bg-red-500", "bg-yellow-500", "bg-green-500"];
    
    const traffic = areas.map(area => {
      const conditionIndex = Math.floor(Math.random() * conditions.length);
      return {
        area,
        condition: conditions[conditionIndex],
        color: colors[conditionIndex],
        delay: conditionIndex === 0 ? Math.floor(Math.random() * 20) + 10 : 
               conditionIndex === 1 ? Math.floor(Math.random() * 10) + 5 : 
               Math.floor(Math.random() * 5)
      };
    });

    setTrafficConditions(traffic);
  };

  const handleOptimizeRoute = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          // Advanced optimization: consider priority, traffic, and package count
          const optimized = [...deliveryPoints].sort((a, b) => {
            const priorityWeight = { High: 3, Medium: 2, Low: 1 };
            const trafficDelay = getTrafficDelay(a.address) - getTrafficDelay(b.address);
            const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
            
            // Primary sort by priority, secondary by traffic conditions
            if (priorityDiff !== 0) return priorityDiff;
            return trafficDelay;
          });
          setDeliveryPoints(optimized);
          calculateRouteMetrics();
          return 100;
        }
        return prev + 12;
      });
    }, 150);
  };

  const getTrafficDelay = (address: string) => {
    const area = address.split(',')[1]?.trim() || 'Unknown';
    const traffic = trafficConditions.find(t => area.includes(t.area));
    return traffic?.delay || 0;
  };

  const bulkUpdatePriority = (priority: "High" | "Medium" | "Low") => {
    const selectedIds = deliveryPoints
      .filter(p => !p.isCompleted)
      .slice(0, 3)
      .map(p => p.id);
    
    setDeliveryPoints(prev => prev.map(point =>
      selectedIds.includes(point.id) ? { ...point, priority } : point
    ));
  };

  const simulateTrafficIncident = () => {
    const incidents = [
      "Major accident on Highway 101 - 25 min delay",
      "Construction work on Main Street - 15 min delay", 
      "Weather warning: Heavy rain expected - 20 min delay",
      "Bridge closure on Oak Avenue - 30 min delay"
    ];
    
    const incident = incidents[Math.floor(Math.random() * incidents.length)];
    console.log(`Traffic Incident: ${incident}`);
    
    // Update traffic conditions to reflect incident
    updateTrafficConditions();
  };

  const exportRouteData = () => {
    const routeData = {
      deliveryPoints,
      trafficConditions,
      efficiency: routeEfficiency,
      estimatedSavings,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(routeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `route-optimization-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const updateDeliveryStatus = () => {
    setDeliveryPoints(prev => prev.map(point => {
      // Randomly complete some deliveries over time
      if (!point.isCompleted && Math.random() > 0.95) {
        return { ...point, isCompleted: true };
      }
      // Update estimated times for incomplete deliveries
      if (!point.isCompleted && Math.random() > 0.8) {
        return { ...point, estimatedTime: generateRandomTime() };
      }
      return point;
    }));
  };

  const calculateRouteMetrics = () => {
    const efficiency = Math.floor(Math.random() * 20) + 75; // 75-95%
    setRouteEfficiency(efficiency);
    
    const timeSaved = Math.floor(Math.random() * 45) + 15; // 15-60 minutes
    const fuelSaved = Math.floor(Math.random() * 8) + 2; // 2-10 gallons
    const costSaved = Math.floor(Math.random() * 50) + 25; // $25-75
    
    setEstimatedSavings({ time: timeSaved, fuel: fuelSaved, cost: costSaved });
  };

  const addDeliveryPoint = () => {
    if (!newAddress.trim()) return;
    
    const newPoint: DeliveryPoint = {
      id: deliveryPoints.length + 1,
      address: newAddress,
      packages: Math.floor(Math.random() * 5) + 1,
      priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)] as "High" | "Medium" | "Low",
      estimatedTime: generateRandomTime(),
      customerName: `Customer ${deliveryPoints.length + 1}`,
      phoneNumber: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      isCompleted: false
    };
    
    setDeliveryPoints([...deliveryPoints, newPoint]);
    setNewAddress("");
  };

  const removeDeliveryPoint = (id: number) => {
    setDeliveryPoints(deliveryPoints.filter(point => point.id !== id));
  };

  const toggleComplete = (id: number) => {
    setDeliveryPoints(deliveryPoints.map(point =>
      point.id === id ? { ...point, isCompleted: !point.isCompleted } : point
    ));
  };

  const refreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      generateInitialData();
      setRefreshing(false);
    }, 1000);
  };

  const filteredAndSortedPoints = deliveryPoints
    .filter(point => filterPriority === "all" || point.priority === filterPriority)
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "packages":
          return b.packages - a.packages;
        case "time":
        default:
          return a.estimatedTime.localeCompare(b.estimatedTime);
      }
    });

  const completedCount = deliveryPoints.filter(p => p.isCompleted).length;
  const totalPackages = deliveryPoints.reduce((sum, p) => sum + p.packages, 0);
  const avgDelay = trafficConditions.reduce((sum, t) => sum + t.delay, 0) / trafficConditions.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Enhanced Route Configuration */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            Route Configuration
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={refreshing}
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
          <CardDescription>
            AI-powered route optimization with real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Real-time Settings */}
          <div className="bg-blue-50 p-3 rounded-lg space-y-3">
            <h4 className="font-medium text-blue-800">Real-time Settings</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-Optimization</span>
              <Button
                variant={autoOptimize ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoOptimize(!autoOptimize)}
              >
                {autoOptimize ? "ON" : "OFF"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Live Updates</span>
              <Button
                variant={realTimeUpdates ? "default" : "outline"}
                size="sm"
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
              >
                {realTimeUpdates ? "ON" : "OFF"}
              </Button>
            </div>
          </div>

          {/* Advanced Route Metrics */}
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Route Efficiency</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Efficiency</span>
                <span className="font-medium">{routeEfficiency}%</span>
              </div>
              <Progress value={routeEfficiency} className="w-full" />
            </div>
          </div>

          {/* Estimated Savings */}
          <div className="bg-orange-50 p-3 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Estimated Savings</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-orange-600">{estimatedSavings.time}m</div>
                <div className="text-xs text-gray-600">Time</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">{estimatedSavings.fuel}gal</div>
                <div className="text-xs text-gray-600">Fuel</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">${estimatedSavings.cost}</div>
                <div className="text-xs text-gray-600">Cost</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startLocation">Starting Location</Label>
            <Input
              id="startLocation"
              placeholder="Enter warehouse address"
              defaultValue="Warehouse A - 100 Industrial Blvd"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="maxStops">Max Stops</Label>
              <Input
                id="maxStops"
                type="number"
                placeholder="15"
                defaultValue="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle</Label>
              <Select defaultValue="van">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="van">Delivery Van</SelectItem>
                  <SelectItem value="truck">Large Truck</SelectItem>
                  <SelectItem value="bike">Bike Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Add New Delivery Point</Label>
            <div className="flex gap-2">
              <Input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter address"
                onKeyPress={(e) => e.key === 'Enter' && addDeliveryPoint()}
              />
              <Button onClick={addDeliveryPoint} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Optimization Controls */}
          <div className="space-y-2">
            <Button 
              onClick={handleOptimizeRoute} 
              className="w-full"
              disabled={isOptimizing}
            >
              {isOptimizing ? `Optimizing... ${optimizationProgress}%` : "🚀 AI Optimize Route"}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => bulkUpdatePriority("High")}
              >
                Mark High Priority
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={simulateTrafficIncident}
              >
                Simulate Incident
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportRouteData}
              className="w-full"
            >
              📊 Export Route Data
            </Button>
          </div>

          {isOptimizing && (
            <div className="space-y-2">
              <Progress value={optimizationProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                Processing {optimizationProgress}%
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{deliveryPoints.length}</div>
                <div className="text-xs text-gray-600">Total Stops</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-green-600">{completedCount}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Optimized Route */}
      <Card className="lg:col-span-1 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            Smart Delivery Route ({filteredAndSortedPoints.length})
            {realTimeUpdates && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-24 h-6">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-28 h-6">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">By Time</SelectItem>
                <SelectItem value="priority">By Priority</SelectItem>
                <SelectItem value="packages">By Packages</SelectItem>
              </SelectContent>
            </Select>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-full overflow-y-auto">
            {filteredAndSortedPoints.map((point, index) => (
              <div key={point.id} className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                point.isCompleted ? 'bg-green-50 border-green-200 opacity-75' : 'border-gray-200 hover:bg-gray-50 hover:shadow-md'
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  point.isCompleted ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {point.isCompleted ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate transition-colors ${
                    point.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {point.address}
                  </p>
                  <p className="text-xs text-gray-500">{point.customerName} • {point.phoneNumber}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={point.priority === "High" ? "destructive" : point.priority === "Medium" ? "default" : "secondary"}
                      className="animate-pulse"
                    >
                      {point.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">{point.packages} packages</span>
                    <span className="text-xs text-blue-600">+{getTrafficDelay(point.address)}min delay</span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  <span className="text-sm text-gray-500">{point.estimatedTime}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleComplete(point.id)}
                      className="h-6 px-2"
                    >
                      {point.isCompleted ? "Undo" : "Done"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDeliveryPoint(point.id)}
                      className="h-6 px-2 text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Traffic & Conditions */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Live Intelligence Hub
          </CardTitle>
          <CardDescription>
            AI-powered traffic and route analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ... keep existing code (traffic conditions) the same */}

          {/* AI Insights */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              🤖 AI Insights
            </h4>
            <div className="space-y-2 text-sm">
              <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                <p className="text-blue-800">📈 Peak efficiency time: 2:00-4:00 PM</p>
              </div>
              <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                <p className="text-yellow-800">⚠️ Heavy traffic expected in Downtown at 5:00 PM</p>
              </div>
              <div className="bg-green-50 p-2 rounded border-l-4 border-green-400">
                <p className="text-green-800">✅ Route optimization improved efficiency by 12%</p>
              </div>
              <div className="bg-red-50 p-2 rounded border-l-4 border-red-400">
                <p className="text-red-800">🚨 High-priority delivery at risk of delay: consider re-routing</p>
              </div>
              <div className="bg-purple-50 p-2 rounded border-l-4 border-purple-400">
                <p className="text-purple-800">🔍 Predictive maintenance alert: Vehicle #8 due for inspection in 3 days</p>
              </div>
              <div className="bg-teal-50 p-2 rounded border-l-4 border-teal-400">
                <p className="text-teal-800">📊 Demand forecast: Increased delivery requests in Zone 3 for next week</p>
              </div>
              <div className="bg-pink-50 p-2 rounded border-l-4 border-pink-400">
                <p className="text-pink-800">💡 Suggested fuel-saving route: 8% lower consumption</p>
              </div>
              <div className="bg-gray-50 p-2 rounded border-l-4 border-gray-400">
                <p className="text-gray-800">🧭 New customer acquisition trend in Zone 5: consider adding delivery slots</p>
              </div>
              <div className="bg-lime-50 p-2 rounded border-l-4 border-lime-400">
                <p className="text-lime-800">🌱 Eco-friendly mode recommended: Reduced CO₂ emissions by 15%</p>
              </div>
              <div className="bg-amber-50 p-2 rounded border-l-4 border-amber-400">
                <p className="text-amber-800">📦 Warehouse A restock alert: Low inventory for Item #42</p>
              </div>
              <div className="bg-rose-50 p-2 rounded border-l-4 border-rose-400">
                <p className="text-rose-800">🛡️ Security alert: Unusual access detected at Depot #4</p>
              </div>
            </div>
          </div>


          {/* ... keep existing code (route statistics, performance metrics) the same */}
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteOptimization;
