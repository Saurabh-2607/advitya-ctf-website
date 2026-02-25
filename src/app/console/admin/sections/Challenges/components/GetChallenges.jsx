import ChallengeCard from "./ChallengeCard";
import { Trophy, Loader2, Database } from "lucide-react";

const GetChallenges = ({
  challenges,
  loading,
  onToggleVisibility,
  togglingId,
  onDeleteChallenge,
  deletingId,
  onBuildInstance,
  buildingId,
  onEdit
}) => {
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-12 h-12">
            <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-neutral-100 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-neutral-400 font-medium animate-pulse">
            Loading Challenges...
          </div>
        </div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-neutral-900/50 p-6 rounded-full mb-6 border border-neutral-800">
          <Database className="w-12 h-12 text-neutral-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          No challenges found
        </h3>
        <p className="text-neutral-400 max-w-sm">
          Get started by creating your first challenge from the control panel above.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge._id}
          challenge={challenge}
          onToggleVisibility={onToggleVisibility}
          togglingId={togglingId}
          onDeleteChallenge={onDeleteChallenge}
          deletingId={deletingId}
          onBuildInstance={onBuildInstance}
          buildingId={buildingId}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default GetChallenges;
