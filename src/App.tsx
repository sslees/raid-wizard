import { ComparisonZone } from "./components/ComparisonZone.tsx";
import { HardwareZone } from "./components/HardwareZone.tsx";
import { useRaidConfig } from "./hooks/useRaidConfig.ts";

export default function App() {
  const {
    config,
    results,
    rawTb,
    totalCost,
    derivedPerTb,
    setBayCount,
    setDrivesInUse,
    setSizePerDrive,
    setPricePerDrive,
  } = useRaidConfig();

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <svg className="app__brand-icon" width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
            <rect x="2" y="3" width="34" height="9" rx="2.5" fill="currentColor"/>
            <circle cx="32" cy="7.5" r="1.75" fill="white" fillOpacity="0.85"/>
            <rect x="2" y="14.5" width="34" height="9" rx="2.5" fill="currentColor" fillOpacity="0.6"/>
            <circle cx="32" cy="19" r="1.75" fill="white" fillOpacity="0.6"/>
            <rect x="2" y="26" width="34" height="9" rx="2.5" fill="currentColor" fillOpacity="0.3"/>
            <circle cx="32" cy="30.5" r="1.75" fill="white" fillOpacity="0.3"/>
          </svg>
          <div>
            <h1>RAID <span className="app__title-accent">Wizard</span></h1>
            <p>Compare RAID configurations for capacity, cost, and fault tolerance.</p>
          </div>
        </div>
      </header>

      <HardwareZone
        bayCount={config.bayCount}
        drivesInUse={config.drivesInUse}
        sizePerDrive={config.sizePerDrive}
        pricePerDrive={config.pricePerDrive}
        rawTb={rawTb}
        totalCost={totalCost}
        derivedPerTb={derivedPerTb}
        onBayCountChange={setBayCount}
        onDrivesChange={setDrivesInUse}
        onSizeChange={setSizePerDrive}
        onPriceChange={setPricePerDrive}
      />

      <ComparisonZone
        results={results}
        drivesInUse={config.drivesInUse}
        sizePerDrive={config.sizePerDrive}
        rawTb={rawTb}
        bayCount={config.bayCount}
      />
    </div>
  );
}
