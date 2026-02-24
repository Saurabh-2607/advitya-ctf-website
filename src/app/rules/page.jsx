export default function RulesPage() {
  const rules = [
    "Participants must not attack, exploit, or disrupt the CTF platform infrastructure, servers, or network.",
    "Denial-of-Service (DoS/DDoS), brute-force attacks, automated scanning, or traffic flooding against the platform are strictly prohibited.",
    "Flags must not be shared, traded, or leaked between teams or participants.",
    "Teams must only exploit vulnerabilities within the intended challenge scope.",
    "Any attempt to access other teams’ accounts, flags, or private data is forbidden.",
    "Use of automated flag submission scripts or bots is not allowed unless explicitly permitted.",
    "Respect all participants and organizers; abusive or inappropriate behavior will not be tolerated.",
    "Any unintended vulnerabilities discovered in the platform must be reported to organizers immediately.",
    "Organizers reserve the right to disqualify any team for unfair advantage, cheating, or rule violations.",
    "All decisions by the organizers are final and binding."
  ];

  return (
    <div className="text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">
          Rules and Terms
        </h1>
        <p className="text-white/60 mb-2">
          Please read and follow all rules carefully during the CTF event.
        </p>
        <div className="mb-8 p-4 bg-red-500/10 text-red-400">
          Violation of any rule may result in immediate disqualification and removal from the competition.
        </div>

        <ul className="space-y-1 text-white/80">
          {rules.map((rule, index) => (
            <li
              key={index}
              className="border-b border-white/10 p-3"
            >
              <span className="text-white font-semibold mr-4 text-xl">
                {index + 1}.
              </span>
              {rule}
            </li>
          ))}
        </ul>

        
      </div>
    </div>
  );
}
