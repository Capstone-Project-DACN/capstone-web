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

const Device = lazy(() => import('./DevicePage'));

/**
 * The Example page route.
 */
const DeviceRoute: FuseRouteItemType = {
	path: 'device',
	children: [
		{
			path: '',
			element: <Navigate to='overview' />
		},
		{
			path: ':tab',
			element: <Device />
		}
	]
};

export default DeviceRoute;
