interface BayVisualizationProps {
  bayCount: number;
  drivesInUse: number;
  sizePerDrive: number;
}

export function BayVisualization({ bayCount, drivesInUse, sizePerDrive }: BayVisualizationProps) {
  return (
    <div className="bay-viz" aria-label="NAS drive bays">
      {Array.from({ length: bayCount }, (_, i) => {
        const filled = i < drivesInUse;
        return (
          <div
            key={i}
            className={`bay-slot${filled ? " bay-slot--filled" : " bay-slot--empty"}`}
          >
            {filled ? (
              <>
                <div className="bay-slot__drive" />
                <span className="bay-slot__label">{sizePerDrive} TB</span>
              </>
            ) : (
              <span className="bay-slot__label bay-slot__label--empty">empty</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
