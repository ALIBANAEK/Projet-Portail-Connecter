import { Lock, Unlock, ShieldAlert } from "lucide-react";
import { PORTAL_STATES } from "../mockData";

export function PortalGraphic({ state, size = "large" }) {
  const isLarge = size === "large";

  const getStatusColor = () => {
    switch (state) {
      case PORTAL_STATES.OPEN:
        return "var(--success)";
      case PORTAL_STATES.HALF_OPEN:
        return "var(--warning)";
      case PORTAL_STATES.CLOSED:
      default:
        return "var(--danger)";
    }
  };

  return (
    <div className={`portal-graphic-container ${size}`}>
      <div className="portal-frame">
        {/* Left Post */}
        <div className="portal-post left-post"></div>

        {/* Gate leaves / panels */}
        <div className={`gate-leaf left-leaf state-${state.replace(/\s+/g, "-")}`}>
          <div className="leaf-bar"></div>
          <div className="leaf-bar"></div>
          <div className="leaf-bar"></div>
        </div>

        <div className={`gate-leaf right-leaf state-${state.replace(/\s+/g, "-")}`}>
          <div className="leaf-bar"></div>
          <div className="leaf-bar"></div>
          <div className="leaf-bar"></div>
        </div>

        {/* Right Post */}
        <div className="portal-post right-post"></div>

        {/* Center state badge icon */}
        <div className="portal-center-indicator" style={{ borderColor: getStatusColor() }}>
          {state === PORTAL_STATES.OPEN && <Unlock size={isLarge ? 26 : 18} color="var(--success)" />}
          {state === PORTAL_STATES.HALF_OPEN && <ShieldAlert size={isLarge ? 26 : 18} color="var(--warning)" />}
          {state === PORTAL_STATES.CLOSED && <Lock size={isLarge ? 26 : 18} color="var(--danger)" />}
        </div>
      </div>

      <div className="portal-ground"></div>
    </div>
  );
}
