
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Truck, User, Fuel, Wrench, AlertTriangle, CheckCircle, 
  Clock, MapPin, Battery, Thermometer, Search, Filter,
  RefreshCw, Plus, Settings, TrendingUp, Calendar
} from "lucide-react";

interface Vehicle {
  id: string;
  type: string;
  model: string;
  driver: string;
  status: "Active" | "Maintenance" | "Idle" | "Out of Service";
  location: string;
  mileage: number;
  fuelLevel: number;
  batteryLevel: number;
  temperature: number;
  lastMaintenance: string;
  nextMaintenance: string;
  efficiency: number;
  deliveriesToday: number;
  hoursActive: number;
}

interface MaintenanceRecord {
  vehicleId: string;
  type: string;
  date: string;
  cost: number;
  description: string;
  status: "Completed" | "Scheduled" | "Overdue";
}

const FleetManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    generateFleetData();
    const interval = setInterval(updateVehicleData, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const generateFleetData = () => {
    const vehicleTypes = ["Van", "Truck", "Bike", "SUV"];
    const models = ["Ford Transit", "Mercedes Sprinter", "Volvo FH", "Honda CB", "Toyota RAV4"];
    const drivers = ["John Smith", "Sarah Johnson", "Mike Davis", "Lisa Wilson", "Tom Brown", "Anna Garcia"];
    const locations = ["Downtown Hub", "North Depot", "South Station", "East Terminal", "West Center"];
    const statuses: ("Active" | "Maintenance" | "Idle" | "Out of Service")[] = ["Active", "Maintenance", "Idle", "Out of Service"];

    const fleet = Array.from({ length: 15 }, (_, i) => ({
      id: `VEH${String(i + 1).padStart(3, '0')}`,
      type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      model: models[Math.floor(Math.random() * models.length)],
      driver: drivers[Math.floor(Math.random() * drivers.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      mileage: Math.floor(Math.random() * 150000) + 10000,
      fuelLevel: Math.floor(Math.random() * 100),
      batteryLevel: Math.floor(Math.random() * 100),
      temperature: Math.floor(Math.random() * 30) + 65,
      lastMaintenance: generatePastDate(),
      nextMaintenance: generateFutureDate(),
      efficiency: Math.floor(Math.random() * 30) + 70,
      deliveriesToday: Math.floor(Math.random() * 25),
      hoursActive: Math.floor(Math.random() * 12) + 1
    }));

    const maintenance = fleet.map(vehicle => ({
      vehicleId: vehicle.id,
      type: ["Oil Change", "Tire Rotation", "Brake Check", "Engine Service"][Math.floor(Math.random() * 4)],
      date: Math.random() > 0.5 ? generatePastDate() : generateFutureDate(),
      cost: Math.floor(Math.random() * 500) + 100,
      description: "Routine maintenance and inspection",
      status: ["Completed", "Scheduled", "Overdue"][Math.floor(Math.random() * 3)] as "Completed" | "Scheduled" | "Overdue"
    }));

    setVehicles(fleet);
    setMaintenanceRecords(maintenance);
  };

  const generatePastDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    return date.toLocaleDateString();
  };

  const generateFutureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 60) + 1);
    return date.toLocaleDateString();
  };

  const updateVehicleData = () => {
    setVehicles(prev => prev.map(vehicle => ({
      ...vehicle,
      fuelLevel: Math.max(0, vehicle.fuelLevel - Math.random() * 2),
      batteryLevel: Math.max(0, vehicle.batteryLevel - Math.random() * 1),
      temperature: vehicle.temperature + (Math.random() - 0.5) * 3,
      efficiency: Math.max(0, Math.min(100, vehicle.efficiency + (Math.random() - 0.5) * 5)),
      deliveriesToday: vehicle.status === "Active" ? vehicle.deliveriesToday + Math.floor(Math.random() * 2) : vehicle.deliveriesToday,
      hoursActive: vehicle.status === "Active" ? Math.min(16, vehicle.hoursActive + 0.25) : vehicle.hoursActive
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Maintenance": return "bg-yellow-500";
      case "Idle": return "bg-blue-500";
      case "Out of Service": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Maintenance": return "destructive";
      case "Idle": return "secondary";
      case "Out of Service": return "destructive";
      default: return "secondary";
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const scheduleMaintenace = (vehicleId: string) => {
    console.log(`Scheduling maintenance for vehicle ${vehicleId}`);
    // Simulate scheduling maintenance
  };

  const sendAlert = (vehicleId: string) => {
    console.log(`Sending alert for vehicle ${vehicleId}`);
    // Simulate sending alert
  };

  const refreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      generateFleetData();
      setRefreshing(false);
    }, 1000);
  };

  // Calculate fleet statistics
  const activeVehicles = vehicles.filter(v => v.status === "Active").length;
  const maintenanceVehicles = vehicles.filter(v => v.status === "Maintenance").length;
  const avgFuelLevel = vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / vehicles.length;
  const avgEfficiency = vehicles.reduce((sum, v) => sum + v.efficiency, 0) / vehicles.length;

  // Chart data
  const statusData = [
    { name: "Active", value: vehicles.filter(v => v.status === "Active").length, color: "#22c55e" },
    { name: "Maintenance", value: vehicles.filter(v => v.status === "Maintenance").length, color: "#eab308" },
    { name: "Idle", value: vehicles.filter(v => v.status === "Idle").length, color: "#3b82f6" },
    { name: "Out of Service", value: vehicles.filter(v => v.status === "Out of Service").length, color: "#ef4444" }
  ];

  const efficiencyData = vehicles.map(v => ({
    name: v.id,
    efficiency: v.efficiency,
    deliveries: v.deliveriesToday
  }));

  return (
    <div className="space-y-6">
      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Vehicles</p>
                <p className="text-3xl font-bold">{activeVehicles}</p>
              </div>
              <Truck className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">In Maintenance</p>
                <p className="text-3xl font-bold">{maintenanceVehicles}</p>
              </div>
              <Wrench className="h-10 w-10 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Avg Fuel Level</p>
                <p className="text-3xl font-bold">{avgFuelLevel.toFixed(0)}%</p>
              </div>
              <Fuel className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg Efficiency</p>
                <p className="text-3xl font-bold">{avgEfficiency.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by vehicle ID, driver, or model..."
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Idle">Idle</SelectItem>
                <SelectItem value="Out of Service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={refreshData} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fleet Status Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status Distribution</CardTitle>
            <CardDescription>Current status of all vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Efficiency</CardTitle>
            <CardDescription>Performance metrics by vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={efficiencyData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency %" />
                <Bar dataKey="deliveries" fill="#82ca9d" name="Deliveries Today" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Fleet Vehicles ({filteredVehicles.length})
          </CardTitle>
          <CardDescription>
            Real-time vehicle monitoring and management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{vehicle.id}</span>
                    </div>
                    <Badge variant="outline">{vehicle.model}</Badge>
                    <Badge variant={getStatusBadge(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => scheduleMaintenace(vehicle.id)}
                    >
                      <Wrench className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendAlert(vehicle.id)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Driver:</span>
                    <p className="text-gray-600">{vehicle.driver}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p className="text-gray-600">{vehicle.location}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Mileage:</span>
                    <p className="text-gray-600">{vehicle.mileage.toLocaleString()} mi</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Deliveries Today:</span>
                    <p className="text-gray-600">{vehicle.deliveriesToday}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="flex items-center gap-1 text-blue-600 text-xs">
                      <Fuel className="h-3 w-3" />
                      <span>Fuel</span>
                    </div>
                    <div className="mt-1">
                      <Progress value={vehicle.fuelLevel} className="h-2" />
                      <p className="text-xs mt-1">{vehicle.fuelLevel.toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-2 rounded">
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <Battery className="h-3 w-3" />
                      <span>Battery</span>
                    </div>
                    <div className="mt-1">
                      <Progress value={vehicle.batteryLevel} className="h-2" />
                      <p className="text-xs mt-1">{vehicle.batteryLevel.toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-2 rounded">
                    <div className="flex items-center gap-1 text-orange-600 text-xs">
                      <Thermometer className="h-3 w-3" />
                      <span>Temperature</span>
                    </div>
                    <p className="text-sm font-medium mt-1">{vehicle.temperature.toFixed(1)}°F</p>
                  </div>

                  <div className="bg-purple-50 p-2 rounded">
                    <div className="flex items-center gap-1 text-purple-600 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      <span>Efficiency</span>
                    </div>
                    <p className="text-sm font-medium mt-1">{vehicle.efficiency}%</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 border-t pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>Last Maintenance: {vehicle.lastMaintenance}</div>
                    <div>Next Maintenance: {vehicle.nextMaintenance}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FleetManagement;
