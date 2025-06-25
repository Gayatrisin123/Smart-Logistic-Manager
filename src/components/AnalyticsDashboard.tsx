
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, TrendingDown, DollarSign, Package, Truck, Clock, 
  MapPin, AlertTriangle, RefreshCw, Download, Filter, Calendar
} from "lucide-react";

interface PerformanceData {
  date: string;
  deliveries: number;
  onTime: number;
  revenue: number;
  fuelCost: number;
  efficiency: number;
}

interface RegionData {
  region: string;
  deliveries: number;
  revenue: number;
  efficiency: number;
  color: string;
}

const AnalyticsDashboard = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);
  const [kpiData, setKpiData] = useState({
    totalDeliveries: 0,
    onTimeRate: 0,
    avgDeliveryTime: 0,
    totalRevenue: 0,
    fuelSavings: 0,
    customerSatisfaction: 0
  });

  useEffect(() => {
    generateAnalyticsData();
    const interval = setInterval(generateAnalyticsData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const generateAnalyticsData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    
    // Generate performance data
    const performance = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      return {
        date: date.toLocaleDateString(),
        deliveries: Math.floor(Math.random() * 200) + 150,
        onTime: Math.floor(Math.random() * 50) + 85,
        revenue: Math.floor(Math.random() * 5000) + 8000,
        fuelCost: Math.floor(Math.random() * 800) + 400,
        efficiency: Math.floor(Math.random() * 20) + 75
      };
    });

    // Generate region data
    const regions = [
      { region: "North", color: "#8884d8" },
      { region: "South", color: "#82ca9d" },
      { region: "East", color: "#ffc658" },
      { region: "West", color: "#ff7300" },
      { region: "Central", color: "#00ff00" }
    ];

    const regionStats = regions.map(region => ({
      ...region,
      deliveries: Math.floor(Math.random() * 500) + 200,
      revenue: Math.floor(Math.random() * 50000) + 30000,
      efficiency: Math.floor(Math.random() * 30) + 70
    }));

    setPerformanceData(performance);
    setRegionData(regionStats);

    // Update KPIs
    setKpiData({
      totalDeliveries: performance.reduce((sum, day) => sum + day.deliveries, 0),
      onTimeRate: performance.reduce((sum, day) => sum + day.onTime, 0) / performance.length,
      avgDeliveryTime: Math.floor(Math.random() * 20) + 25,
      totalRevenue: performance.reduce((sum, day) => sum + day.revenue, 0),
      fuelSavings: Math.floor(Math.random() * 5000) + 8000,
      customerSatisfaction: Math.floor(Math.random() * 10) + 90
    });
  };

  const refreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      generateAnalyticsData();
      setRefreshing(false);
    }, 1000);
  };

  const exportData = () => {
    const dataToExport = {
      performance: performanceData,
      regions: regionData,
      kpis: kpiData,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Analytics Dashboard
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={refreshData} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Deliveries</p>
                <p className="text-2xl font-bold">{kpiData.totalDeliveries.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-blue-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+12% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">On-Time Rate</p>
                <p className="text-2xl font-bold">{kpiData.onTimeRate.toFixed(1)}%</p>
              </div>
              <Clock className="h-8 w-8 text-green-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+3.2% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg Delivery Time</p>
                <p className="text-2xl font-bold">{kpiData.avgDeliveryTime}min</p>
              </div>
              <Truck className="h-8 w-8 text-orange-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span className="text-sm">-5min faster</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">${(kpiData.totalRevenue / 1000).toFixed(1)}K</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+8.5% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Fuel Savings</p>
                <p className="text-2xl font-bold">${(kpiData.fuelSavings / 1000).toFixed(1)}K</p>
              </div>
              <MapPin className="h-8 w-8 text-teal-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+15% efficiency</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm">Customer Satisfaction</p>
                <p className="text-2xl font-bold">{kpiData.customerSatisfaction}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-pink-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+2.1% rating</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance Trend</CardTitle>
            <CardDescription>Daily deliveries and on-time performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="deliveries" fill="#8884d8" name="Deliveries" />
                <Line yAxisId="right" type="monotone" dataKey="onTime" stroke="#82ca9d" strokeWidth={3} name="On-Time %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue vs Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Fuel Costs</CardTitle>
            <CardDescription>Financial performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="Revenue" />
                <Area type="monotone" dataKey="fuelCost" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Fuel Cost" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Delivery distribution by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ region, deliveries }) => `${region}: ${deliveries}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="deliveries"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Efficiency</CardTitle>
            <CardDescription>Performance metrics by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="region" type="category" width={60} />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Route Efficiency Trends</CardTitle>
          <CardDescription>AI optimization impact over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="efficiency" stroke="#8884d8" strokeWidth={3} name="Route Efficiency %" />
              <Line type="monotone" dataKey="onTime" stroke="#82ca9d" strokeWidth={3} name="On-Time Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
