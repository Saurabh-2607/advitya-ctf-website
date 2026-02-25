import React from "react";
import { Shield, AlertTriangle, Scale, CheckCircle2, Gavel } from "lucide-react";

export default function RulesPage() {
  const rules = [
    {
      title: "Infrastructure Integrity",
      description: "Participants must not attack, exploit, or disrupt the CTF platform infrastructure, servers, or network."
    },
    {
      title: "No DoS/DDoS",
      description: "Denial-of-Service (DoS/DDoS), brute-force attacks, automated scanning, or traffic flooding against the platform are strictly prohibited."
    },
    {
      title: "Flag Confidentiality",
      description: "Flags must not be shared, traded, or leaked between teams or participants."
    },
    {
      title: "Scope Limitation",
      description: "Teams must only exploit vulnerabilities within the intended challenge scope."
    },
    {
      title: "Privacy Respect",
      description: "Any attempt to access other teams’ accounts, flags, or private data is forbidden."
    },
    {
      title: "No Automation",
      description: "Use of automated flag submission scripts or bots is not allowed unless explicitly permitted."
    },
    {
      title: "Code of Conduct",
      description: "Respect all participants and organizers; abusive or inappropriate behavior will not be tolerated."
    },
    {
      title: "Responsible Disclosure",
      description: "Any unintended vulnerabilities discovered in the platform must be reported to organizers immediately."
    },
    {
      title: "Fair Play",
      description: "Organizers reserve the right to disqualify any team for unfair advantage, cheating, or rule violations."
    },
    {
      title: "Final Decision",
      description: "All decisions by the organizers are final and binding."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Rules & Regulations</h1>
            <p className="text-neutral-500 text-sm">Review the guidelines to ensure a fair competition</p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 px-4 py-2 rounded-full backdrop-blur-md">
          <Scale className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-300 text-sm font-medium">Terms of Service</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rules List */}
        <div className="lg:col-span-2 space-y-4">
            <div className="w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
                    <Shield className="w-5 h-5 text-neutral-400" />
                    <h2 className="text-sm uppercase tracking-widest text-neutral-400 font-bold">Competition Rules</h2>
                </div>
                
                <div className="grid gap-4">
                    {rules.map((rule, index) => (
                        <div 
                            key={index}
                            className="group flex gap-4 p-4 rounded-2xl border border-neutral-800/50 bg-neutral-900/40 hover:bg-neutral-800/40 hover:border-neutral-700 transition-all duration-300"
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 text-neutral-400 font-mono text-sm group-hover:bg-neutral-700 group-hover:text-white transition-colors">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="text-neutral-200 font-bold text-base mb-1 group-hover:text-white transition-colors">
                                    {rule.title}
                                </h3>
                                <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors">
                                    {rule.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar / Warning */}
        <div className="space-y-6">
            <div className="w-full overflow-hidden rounded-3xl border border-red-900/20 bg-red-950/10 backdrop-blur-md p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-2">Disqualification</h3>
                        <p className="text-red-200/60 text-sm leading-relaxed mb-4">
                            Violation of any rule may result in immediate disqualification and removal from the competition without prior warning.
                        </p>
                        <div className="text-xs uppercase tracking-wider font-bold text-red-500/80 border border-red-500/20 rounded px-2 py-1 inline-block">
                            Zero Tolerance Policy
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md p-6">
                 <div className="flex items-center gap-3 mb-4">
                    <Gavel className="w-5 h-5 text-neutral-400" />
                    <h3 className="text-white font-bold">Legal Notice</h3>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed">
                    By participating in this CTF, you agree to adhere to all local laws and regulations regarding cybersecurity and authorized testing. The organizers accept no responsibility for actions taken outside the scope of this competition.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}
