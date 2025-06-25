
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Brain, Calendar, AlertCircle, Clock, Target } from "lucide-react";

const PredictiveAnalytics = () => {
  const predictions = [
    {
      metric: "Peak Delivery Hours",
      prediction: "2:00 PM - 4:00 PM",
      confidence: 94,
      trend: "up",
      impact: "High volume expected"
    },
    {
      metric: "Weather Impact",
      prediction: "15% delay risk",
      confidence: 87,
      trend: "stable",
      impact: "Rain forecast 3-5 PM"
    },
    {
      metric: "Traffic Congestion",
      prediction: "Downtown 25% slower",
      confidence: 91,
      trend: "up",
      impact: "Construction on Main St"
    },
    {
      metric: "Delivery Success Rate",
      prediction: "96.2% completion",
      confidence: 89,
      trend: "up",
      impact: "Above average performance"
    }
  ];

  const weeklyForecast = [
    { day: "Monday", packages: 145, difficulty: "Medium", efficiency: 92 },
    { day: "Tuesday", packages: 128, difficulty: "Low", efficiency: 96 },
    { day: "Wednesday", packages: 167, difficulty: "High", efficiency: 87 },
    { day: "Thursday", packages: 142, difficulty: "Medium", efficiency: 94 },
    { day: "Friday", packages: 189, difficulty: "High", efficiency: 85 },
    { day: "Saturday", packages: 98, difficulty: "Low", efficiency: 98 },
    { day: "Sunday", packages: 67, difficulty: "Low", efficiency: 99 }
  ];

  const optimizationSuggestions = [
    {
      title: "Route Consolidation",
      description: "Combine routes in East Side district to reduce total travel time by 12%",
      impact: "High",
      savings: "$45/day"
    },
    {
      title: "Delivery Window Adjustment",
      description: "Shift 15% of deliveries to morning hours to avoid afternoon traffic",
      impact: "Medium",
      savings: "$28/day"
    },
    {
      title: "Vehicle Allocation",
      description: "Use smaller vehicles for residential areas to improve parking efficiency",
      impact: "Medium",
      savings: "$22/day"
    },
    {
      title: "Priority Scheduling",
      description: "Schedule high-priority deliveries before 11 AM for 99% success rate",
      impact: "High",
      savings: "$38/day"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI Predictions */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI-Powered Predictions
          </CardTitle>
          <CardDescription>
            Machine learning insights for today's operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((pred, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{pred.metric}</h4>
                  <TrendingUp className={`h-4 w-4 ${pred.trend === 'up' ? 'text-green-500' : 'text-gray-400'}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-blue-600">{pred.prediction}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Confidence Level</span>
                      <span>{pred.confidence}%</span>
                    </div>
                    <Progress value={pred.confidence} className="h-2" />
                  </div>
                  
                  <p className="text-sm text-gray-600">{pred.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Weekly Forecast
          </CardTitle>
          <CardDescription>
            Predicted delivery volume and efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyForecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-sm w-20">{day.day}</span>
                  <Badge variant={getDifficultyColor(day.difficulty)}>
                    {day.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">{day.packages} packages</span>
                  <span className="font-medium text-green-600">{day.efficiency}% efficiency</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Optimization Suggestions
          </CardTitle>
          <CardDescription>
            AI-recommended improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationSuggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(suggestion.impact)}>
                      {suggestion.impact}
                    </Badge>
                    <span className="text-sm font-medium text-green-600">{suggestion.savings}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Performance Insights
          </CardTitle>
          <CardDescription>
            Key metrics and trends analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">23%</div>
              <div className="text-sm text-gray-600">Route Efficiency Gain</div>
              <div className="text-xs text-green-600 mt-1">↑ vs last month</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">4.2min</div>
              <div className="text-sm text-gray-600">Avg Time Saved</div>
              <div className="text-xs text-green-600 mt-1">↑ per delivery</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12%</div>
              <div className="text-sm text-gray-600">Fuel Cost Reduction</div>
              <div className="text-xs text-green-600 mt-1">↓ this quarter</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">97.8%</div>
              <div className="text-sm text-gray-600">Prediction Accuracy</div>
              <div className="text-xs text-gray-600 mt-1">AI model performance</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Today's Recommendations</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Increase vehicle allocation for Downtown area (+2 vehicles)</li>
              <li>• Delay non-priority deliveries by 30 minutes due to traffic</li>
              <li>• Consider alternative routes for Uptown district</li>
              <li>• Schedule additional driver break at 2:30 PM</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
