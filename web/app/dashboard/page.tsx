import { GameDashboard } from "@/components/dashboard/game-dashboard";

export default function DashboardPage() {
  return (
    <main className="h-screen bg-[#050505] text-white flex overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        {/* Background Ambient Effect */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <GameDashboard />
      </div>
    </main>
  );
}
