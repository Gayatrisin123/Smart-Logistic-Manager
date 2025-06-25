
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RouteOptimization from "@/components/RouteOptimization";
import RealTimeTracking from "@/components/RealTimeTracking";
import PredictiveAnalytics from "@/components/PredictiveAnalytics";
import DeliveryMetrics from "@/components/DeliveryMetrics";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import FleetManagement from "@/components/FleetManagement";
import { Truck, MapPin, Clock, BarChart3, TrendingUp, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto p-6">
        {/* Enhanced Header with Live Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Logistics Optimization System
              </h1>
              <p className="text-lg text-gray-600">
                AI-powered route optimization and real-time delivery tracking
              </p>
            </div>
            <div className="flex gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-sm text-gray-600">On-Time Rate</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-blue-600">47</div>
                <div className="text-sm text-gray-600">Active Routes</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-orange-600">$12.4K</div>
                <div className="text-sm text-gray-600">Daily Savings</div>
              </Card>
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard with More Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Route Optimization
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Real-Time Tracking
            </TabsTrigger>
            <TabsTrigger value="fleet" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Fleet Management
            </TabsTrigger>
            <TabsTrigger value="predictive" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Predictive Analytics
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Delivery Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <RouteOptimization />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <RealTimeTracking />
          </TabsContent>

          <TabsContent value="fleet" className="space-y-6">
            <FleetManagement />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <DeliveryMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
