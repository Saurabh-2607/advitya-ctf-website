"use client";

import NormalChallenge from "./NormalChallenge";
import InstanceChallenge from "./InstanceChallenge";

const ChallengeCard = ({
  challenge,
  togglingId,
  onToggleVisibility,
  onDeleteChallenge,
  deletingId,
  onBuildInstance,
  buildingId,
  onEdit
}) => {
  return (
    <div className="bg-white/10 rounded-lg">
      {challenge.type === "instance" ? (
        <InstanceChallenge
          challenge={challenge}
          onToggleVisibility={onToggleVisibility}
          togglingId={togglingId}
          onDeleteChallenge={onDeleteChallenge}
          deletingId={deletingId}
          onBuildInstance={onBuildInstance}
          buildingId={buildingId}
        />
      ) : (
        <NormalChallenge
          challenge={challenge}
          onToggleVisibility={onToggleVisibility}
          togglingId={togglingId}
          onDeleteChallenge={onDeleteChallenge}
          deletingId={deletingId}
          onEdit={onEdit}
        />
      )}
    </div>
  );
};

export default ChallengeCard;
