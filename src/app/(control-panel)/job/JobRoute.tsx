import i18next from 'i18next';
import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import { Navigate } from 'react-router';

i18next.addResourceBundle('en', 'devicesPage', en);
i18next.addResourceBundle('tr', 'devicesPage', tr);
i18next.addResourceBundle('ar', 'devicesPage', ar);

const JobPage = lazy(() => import('./JobPage'));

/**
 * The Example page route.
 */
const DeviceRoute: FuseRouteItemType = {
	path: 'cronjob',
	children: [
		{
			path: '',
			element: <JobPage />
		}
	]
};

export default DeviceRoute;
