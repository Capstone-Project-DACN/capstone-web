import i18n from "@i18n";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";

import { FuseNavItemType } from "@fuse/core/FuseNavigation/types/FuseNavItemType";

i18n.addResourceBundle("en", "navigation", en);
i18n.addResourceBundle("tr", "navigation", tr);
i18n.addResourceBundle("ar", "navigation", ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
  {
    id: "dashboards",
    title: "DASHBOARDS",
    type: "group",
    icon: "heroicons-outline:home",
    children: [
    {
      id: "dashboards.metric",
      title: "Data Dashboard",
      type: "item",
      icon: "heroicons-outline:globe-asia-australia",
      url: "/dashboard",
    },
		{
			id: "dashboards.device",
			title: "Device Management",
			type: "item",
			icon: "heroicons-outline:cpu-chip",
			url: "/device",
		},
    {
			id: "dashboards.cronjob",
			title: "Job Management",
			type: "item",
			icon: "heroicons-outline:adjustments-horizontal",
			url: "/cronjob",
		},
    {
			id: "dashboards.anomaly",
			title: "Anomaly Detection",
			type: "item",
			icon: "heroicons-outline:exclamation-triangle",
			url: "/anomaly",
		},
		{
			id: "dashboards.energy",
			title: "Energy Monitoring",
			type: "item",
			icon: "heroicons-outline:battery-100",
			url: "",
		},
    ],
  },  
  {
    id: "documentation",
    title: "DOCUMENTATIONS",
    type: "group",
    icon: "heroicons-outline:home",
    children: [
      {
        id: "documentation.api_reference",
        title: "API Reference",
        type: "item",
        icon: "heroicons-outline:clipboard-document",
        url: "",
      },
	  {
        id: "documentation.architecture",
        title: "Architecture",
        type: "item",
        icon: "heroicons-outline:rectangle-group",
        url: "",
      },
      {
        id: "documentation.help",
        title: "Helps",
        type: "item",
        icon: "heroicons-outline:wrench-screwdriver",
        url: "",
      },
    ],
  },  
];

export default navigationConfig;
