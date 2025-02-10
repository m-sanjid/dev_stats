import Image from "next/image";

function Dashboard() {
  return (
    <section className="container max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Live Dashboard Preview
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Get real-time insights into your development activity
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden border-8 border-gray-900 shadow-lg mx-auto max-w-5xl">
        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex items-center gap-2 px-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <Image
          src="/dashboard.png"
          width={1200}
          height={800}
          alt="Dashboard Preview"
          className="w-full h-auto pt-5"
          priority
        />
      </div>
    </section>
  );
}

export default Dashboard;
