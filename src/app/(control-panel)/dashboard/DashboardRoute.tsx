import i18next from 'i18next';
import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'devicesPage', en);
i18next.addResourceBundle('tr', 'devicesPage', tr);
i18next.addResourceBundle('ar', 'devicesPage', ar);

const DashboardPage = lazy(() => import('./DashboardPage'));
const PredictPage = lazy(() => import('./PredictPage'));

/**
 * The Example page route.
 */
const DataMetricRoute: FuseRouteItemType = {
    path: 'dashboard',
    children: [
        {
            path: '',
            element: <DashboardPage/>
        },
        {
            path: 'predict',
            element: <PredictPage/>
        },
    ]
};

export default DataMetricRoute;
