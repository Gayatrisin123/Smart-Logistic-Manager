
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, TrendingUp, Award, Users, MapPin } from "lucide-react";

const DeliveryMetrics = () => {
  const todayMetrics = [
    { label: "Total Deliveries", value: "142", change: "+8%", color: "text-blue-600" },
    { label: "On-Time Rate", value: "96.2%", change: "+2.1%", color: "text-green-600" },
    { label: "Average Time", value: "18.5min", change: "-1.2min", color: "text-orange-600" },
    { label: "Customer Rating", value: "4.8/5", change: "+0.1", color: "text-purple-600" }
  ];

  const performanceByArea = [
    { area: "Downtown", deliveries: 45, onTime: 94, avgTime: "22min", difficulty: "High" },
    { area: "Midtown", deliveries: 38, onTime: 97, avgTime: "16min", difficulty: "Medium" },
    { area: "Uptown", deliveries: 32, onTime: 98, avgTime: "14min", difficulty: "Low" },
    { area: "Suburbs", deliveries: 27, onTime: 96, avgTime: "25min", difficulty: "Medium" }
  ];

  const driverPerformance = [
    { name: "John Smith", deliveries: 28, onTime: 96, rating: 4.9, efficiency: 95 },
    { name: "Sarah Johnson", deliveries: 25, onTime: 98, rating: 4.8, efficiency: 92 },
    { name: "Mike Davis", deliveries: 31, onTime: 94, rating: 4.7, efficiency: 89 },
    { name: "Lisa Brown", deliveries: 22, onTime: 100, rating: 5.0, efficiency: 98 },
    { name: "Tom Wilson", deliveries: 26, onTime: 95, rating: 4.6, efficiency: 87 }
  ];

  const weeklyTrends = [
    { week: "Week 1", deliveries: 892, onTime: 94.2, satisfaction: 4.6 },
    { week: "Week 2", deliveries: 945, onTime: 95.1, satisfaction: 4.7 },
    { week: "Week 3", deliveries: 1023, onTime: 96.8, satisfaction: 4.8 },
    { week: "Week 4", deliveries: 1087, onTime: 96.2, satisfaction: 4.8 }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    return value >= threshold ? "text-green-600" : value >= threshold - 5 ? "text-yellow-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Today's Performance Overview
          </CardTitle>
          <CardDescription>
            Real-time delivery metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {todayMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-3xl font-bold ${metric.color}`}>{metric.value}</div>
                <div className="text-sm text-gray-600 mt-1">{metric.label}</div>
                <div className="text-xs text-green-600 mt-1">{metric.change} vs yesterday</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Performance by Area
            </CardTitle>
            <CardDescription>
              Delivery metrics across different districts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceByArea.map((area, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{area.area}</h4>
                    <Badge variant={getDifficultyColor(area.difficulty)}>
                      {area.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-blue-600">{area.deliveries}</div>
                      <div className="text-xs text-gray-600">Deliveries</div>
                    </div>
                    <div>
                      <div className={`text-lg font-semibold ${getPerformanceColor(area.onTime, 95)}`}>
                        {area.onTime}%
                      </div>
                      <div className="text-xs text-gray-600">On-Time</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-orange-600">{area.avgTime}</div>
                      <div className="text-xs text-gray-600">Avg Time</div>
                    </div>
                  </div>
                  
                  <Progress value={area.onTime} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Driver Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Driver Performance
            </CardTitle>
            <CardDescription>
              Individual driver metrics and rankings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {driverPerformance.map((driver, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.deliveries} deliveries today</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getPerformanceColor(driver.onTime, 95)}`}>
                        {driver.onTime}%
                      </span>
                      <span className="text-sm text-purple-600">★{driver.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {driver.efficiency}% efficiency
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Weekly Performance Trends
          </CardTitle>
          <CardDescription>
            Historical performance data and trends analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyTrends.map((week, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900 w-20">{week.week}</span>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{week.deliveries}</div>
                      <div className="text-xs text-gray-600">Deliveries</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getPerformanceColor(week.onTime, 95)}`}>
                        {week.onTime}%
                      </div>
                      <div className="text-xs text-gray-600">On-Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">★{week.satisfaction}</div>
                      <div className="text-xs text-gray-600">Satisfaction</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {index > 0 && (
                    <div className="text-sm text-green-600">
                      +{((week.deliveries - weeklyTrends[index-1].deliveries) / weeklyTrends[index-1].deliveries * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Performance Highlights</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-lg font-bold text-blue-600">22%</div>
                <div className="text-blue-700">Delivery volume increase</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">2.6%</div>
                <div className="text-green-700">On-time improvement</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">0.2★</div>
                <div className="text-purple-700">Rating increase</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryMetrics;
