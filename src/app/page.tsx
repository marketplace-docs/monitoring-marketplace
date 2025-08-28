import {
  backlogData,
  packingPerformanceData,
  pickingPerformanceData,
  shippingPerformanceData,
  stats,
} from "@/lib/mock-data";
import StatsCards from "@/components/dashboard/stats-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { BacklogTable } from "@/components/dashboard/backlog-table";
import { AiTips } from "@/components/dashboard/ai-tips";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="border-b bg-card px-6 py-4">
        <h1 className="text-3xl font-bold font-headline">
          E-Commerce Marketplace
        </h1>
        <p className="text-muted-foreground">
          Real-time e-commerce metrics at a glance.
        </p>
      </header>
      <main className="flex-1 space-y-8 p-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Order Tracking</h2>
          <StatsCards
            picked={stats.totalPicked}
            packed={stats.totalPacked}
            shipped={stats.totalShipped}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Performance Analysis</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PerformanceChart
              data={pickingPerformanceData}
              title="Picking Performance"
              description="Average time to pick an order."
              dataKey="avg_time_min"
              label="Avg. Time (min)"
            />
            <PerformanceChart
              data={packingPerformanceData}
              title="Packing Performance"
              description="Average time to pack an order."
              dataKey="avg_time_min"
              label="Avg. Time (min)"
            />
            <PerformanceChart
              data={shippingPerformanceData}
              title="Shipping Performance"
              description="Average time to ship an order."
              dataKey="avg_time_hours"
              label="Avg. Time (hours)"
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Backlog Management</h2>
            <BacklogTable data={backlogData} />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Optimization</h2>
            <AiTips />
          </section>
        </div>
      </main>
    </div>
  );
}
