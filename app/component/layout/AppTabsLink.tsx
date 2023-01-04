import { useLocation } from "@remix-run/react";
import { findIndex } from "lodash";
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
      value={findIndex(tabs, (tab) => tab.href.endsWith(location.pathname))}
    >
      {tabs.map((tab: TabDto, index) => (
        <AppTabLink key={tab.href} label={tab.label} href={tab.href} />
      ))}
    </AppTabs>
  );
}