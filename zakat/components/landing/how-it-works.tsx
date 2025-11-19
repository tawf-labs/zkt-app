import { CheckCircle, Shield, FileCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Shield,
      title: "Donasi Secara Privat",
      desc: "Tunaikan zakat tanpa mengungkap identitas Anda. Donasi tercatat dengan bukti yang menjaga privasi.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      step: "02",
      icon: CheckCircle,
      title: "Review DAO & Syariah",
      desc: "Proses DAO yang transparan dengan pengawasan syariah memvalidasi kampanye dan permintaan pencairan dana.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      step: "03",
      icon: FileCheck,
      title: "Bukti Terverifikasi",
      desc: "Dapatkan bukti penyaluran anonim dan terverifikasi sehingga Anda dapat mempercayai dampak donasi Anda.",
      color: "from-cyan-500 to-blue-500"
    },
  ];

  return (
    <section className="bg-gradient-to-b from-emerald-100 via-white  to-emerald-40 py-16">
      <div className="max-w-md mx-auto px-4">
        
        {/* Section Title */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-black mb-3 leading-tight">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-black text-base">
            Tiga langkah mudah untuk berzakat dengan penuh kepercayaan
          </p>
        </div>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 opacity-30"></div>
          
          <div className="space-y-6">
            {steps.map((s, index) => (
              <div 
                key={s.step}
                className="relative bg-green/5 backdrop-blur-sm border border-black/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group"
              >
                {/* Icon circle */}
                <div className={`absolute -left--1 top-14 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br ${s.color} shadow-lg`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="ml-14">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-emerald-400">{s.step}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-400/30 to-transparent"></div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-black mb-2 group-hover:text-emerald-400 transition">
                    {s.title}
                  </h3>
                  
                  <p className="text-sm text-black leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300">
            Mulai Berzakat Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}