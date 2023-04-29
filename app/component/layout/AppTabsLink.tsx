import { useLocation } from "react-router";
import AppTabLink from "./AppTabLink";
import AppTabs from "./AppTabs";

interface TabDto {
  label: string;
  href: string;
}

export default function AppTabsLink({ tabs }: { tabs: Array<TabDto> }) {
  const location = useLocation();

  return (
    <AppTabs
      // value={findIndex(tabs, (tab) => tab.href.endsWith(location.pathname))}
      value={tabs.find(tab => location.pathname.startsWith(tab.href))?.href || location.pathname}
      // value={tabs[0].href}
      // value={location.pathname}
    >
      {tabs.map((tab: TabDto, index) => (
        <AppTabLink
          key={tab.href}
          label={tab.label}
          href={tab.href}
          index={index}
          // must be given here otherwise AppTabs does not take it into account
          // and fallback to tab value indexes instead of our custom value
          value={tab.href}
        />
      ))}
    </AppTabs>
  );
}

// 5.10.4
// "/pse/clevglqmt0006t07crbsz7zor/students/clevgms3f000zt07cqs22cs6c/preparatory-work"
// "/pse/clevglqmt0006t07crbsz7zor/students/clevgms3f000zt07cqs22cs6c/preparatory-work"