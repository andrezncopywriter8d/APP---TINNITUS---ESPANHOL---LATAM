import { navigationItems, type ScreenId } from "../data/protocolData";

interface BottomNavProps {
  readonly activeScreen: ScreenId;
  readonly openScreen: (screen: ScreenId) => void;
}

export function BottomNav({ activeScreen, openScreen }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegacao principal">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            className={item.id === activeScreen ? "active" : ""}
            key={item.id}
            type="button"
            onClick={() => openScreen(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
