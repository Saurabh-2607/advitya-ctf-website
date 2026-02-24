import ChallengeCard from "./ChallengeCard";
import { Trophy } from "lucide-react";

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
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-white/10 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-300 font-medium">
            Loading All Challenges...
          </div>
        </div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-12 h-12 text-white mx-auto mb-3" />
        <h3 className="text-lg font-medium text-white mb-2">
          No challenges uploaded yet
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
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
